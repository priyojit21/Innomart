import Product from "../../models/product/productSchema.js";
import { statusCode } from "../../config/constant.js";
import wishlistSchema from "../../models/cart/wishlistSchema.js";

const getFilterOptions = (products) => {
  const filterOption = {};
  products.forEach((product) => {
    product.variation.forEach((variation) => {
      Object.keys(variation.details).forEach((key) => {
        filterOption[key]
          ? !filterOption[key].includes(variation.details[key]) &&
            filterOption[key].push(variation.details[key])
          : (filterOption[key] = [variation.details[key]]);
      });
    });
  });
  return filterOption;
};

export const getAllWishlistProduct = async (req, res) => {
  try {
    const {
      filterOption,
      userId,
      category,
      order,
      sortby,
      stock,
      page = 1,
      limit = 10,
    } = req.body;
    let { findBy, lowestPrice, highestPrice, discount } = req.body;


    discount = discount > 0 ? (discount > 100 ? 100 : discount) : 0;
    lowestPrice = lowestPrice > 0 ? lowestPrice : 1;
    highestPrice = highestPrice > 0 ? highestPrice : Number.MAX_VALUE;

    findBy = findBy || "";
    const terms = findBy.split(/[\W_]+/).filter((term) => term.length > 0);

    const findConditions = terms.map((term) => {
      const regexp = new RegExp("^" + term, "i");
      return [
        { productName: regexp },
        { description: regexp },
        { tags: { $in: [regexp] } },
      ];
    });

    const wishlistProducts = await wishlistSchema.find({userId});
    const allWishlistProducts = wishlistProducts.map(({productId}) => productId);

    const findByObject = {
      $or: findConditions.flat(),
      _id : {$in : allWishlistProducts}
    };

    if (category) {
      findByObject.category = { $in: category };
    }

    const findProduct = await Product.find(findByObject, {
      sellerId: 0,
    });

    if (!findProduct || findProduct.length === 0) {
      return res.status(statusCode.NOT_FOUND).json({
        success: false,
        message: "No products found matching the search criteria.",
      });
    }

    const filteredProducts = findProduct
      .map((product) => {
        const matchingVariations = product.variation.filter((variation) => {
          const isWithinPriceRange =
            variation.regularPrice > lowestPrice &&
            variation.regularPrice <= highestPrice;

          const isAboveDiscount = variation.discount >= discount;

          let matchesDetails = true;
          if (typeof filterOption === "object") {
            Object.keys(filterOption).forEach((key) => {
              if (variation.details[key] !== filterOption[key]) {
                matchesDetails = false;
              }
            });
          }

          let checkStock = true;
          if (stock) {
            checkStock =
              stock === "out"
                ? variation.stock === 0
                : stock === "in"
                ? variation.stock > 5
                : variation.stock > 0 && variation.stock < 6;
          }

          return (
            isWithinPriceRange &&
            isAboveDiscount &&
            matchesDetails &&
            checkStock
          );
        });

        if (matchingVariations.length > 0) {
          return {
            ...product.toObject(),
            variation: matchingVariations,
          };
        }
        return null;
      })
      .filter((product) => product !== null);

    if (sortby && (sortby === "price" || sortby === "discount")) {
      const key = sortby === "price" ? "sellingPrice" : "discount";

      filteredProducts.forEach((product) => {
        product.variation.sort((a, b) => {
          const variationA = a[key] || 0;
          const variationB = b[key] || 0;
          return order === "asc"
            ? variationA - variationB
            : variationB - variationA;
        });
      });

      filteredProducts.sort((a, b) => {
        const variationA = a.variation[0]?.[key] || 0;
        const variationB = b.variation[0]?.[key] || 0;
        return order === "asc"
          ? variationA - variationB
          : variationB - variationA;
      });
    } else {
      filteredProducts.sort((a, b) => {
        const dateA = new Date(a.createdAt);
        const dateB = new Date(b.createdAt);
        return order === "asc" ? dateA - dateB : dateB - dateA;
      });
    }

    return res.status(statusCode.ACCEPTED).json({
      success: true,
      message: "Filtered Products Fetched Successfully.",
      data: filteredProducts.slice((page - 1) * limit, page * limit),
      filterOption: getFilterOptions(filteredProducts),
    });
  } catch (error) {
    return res.status(statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};