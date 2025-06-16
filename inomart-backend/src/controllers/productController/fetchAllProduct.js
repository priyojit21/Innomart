import Product from "../../models/product/productSchema.js";
import { statusCode } from "../../config/constant.js";
import feedbackSchema from "../../models/product/feedbackSchema.js";

// Helper function to get filter options from products
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

// Main function to get all products with filters applied
export const getAllProducts = async (req, res) => {
  try {
    const {
      filterOption,
      sellerId,
      category,
      order,
      sortby,
      stock,
      rating,
      page = 1,
      limit = 24,
    } = req.body;
    let { findBy, lowestPrice, highestPrice, discount } = req.body;

    // Sanitize the input parameters
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

    const findByObject = {
      $or: findConditions.flat(),
    };

    // Filter by rating if provided
    if (rating > 0 && rating < 6) {
      const ratings = await feedbackSchema.aggregate([
        {
          $group: {
            _id: "$productId",
            averageRating: { $avg: "$rating" },
          },
        },
        { $match: { averageRating: { $gte: rating } } },
      ]);
      if (ratings && ratings.length > 0) {
        const ratedProduct = ratings.map((rating) => rating._id);
        findByObject._id = { $in: ratedProduct };
      }
    }

    // Filter by category if provided
    if (category) {
      findByObject.category = { $in: category };
    }

    // Filter by seller ID if provided
    if (sellerId) {
      findByObject.sellerId = sellerId;
    } else {
      findByObject.isEnabled = true;
    }

    // Fetch the products from the database
    const findProduct = await Product.find(findByObject, {
      sellerId: 0,
    });

    if (!findProduct || findProduct.length === 0) {
      return res.status(statusCode.NOT_FOUND).json({
        success: false,
        message: "No products found matching the search criteria.",
      });
    }

    // Filter products by price, discount, and stock
    const filteredProducts = findProduct
      .map((product) => {
        const matchingVariations = product.variation.filter((variation) => {
          const isWithinPriceRange =
            variation.regularPrice > lowestPrice &&
            variation.regularPrice <= highestPrice;

          const isAboveDiscount = variation.discount >= discount;

          let checkStock = true;
          if (stock) {
            checkStock =
              stock === "out"
                ? variation.stock === 0
                : stock === "in"
                ? variation.stock > 5
                : stock === "low"
                ? variation.stock > 0 && variation.stock < 6
                : stock >= 0;
          }

          return isWithinPriceRange && isAboveDiscount && checkStock;
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

    // Get filter options from the filtered products
    const filterOptions = getFilterOptions(filteredProducts);

    // Further filter the products based on the details
    const detailsFiltered = filteredProducts
      .map((product) => {
        const matchingVariations = product.variation.filter((variation) => {
          let matchesDetails = true;

          // Check if filterOption is an object and filter accordingly
          if (filterOption && typeof filterOption === "object") {
            Object.keys(filterOption).forEach((key) => {
              if (variation.details[key] !== filterOption[key]) {
                matchesDetails = false;
              }
            });
          }

          return matchesDetails;
        });

        if (matchingVariations.length > 0) {
          return {
            ...product,
            variation: matchingVariations,
          };
        }
        return null;
      })
      .filter((product) => product !== null);

    // Sorting logic: Sort by price or discount or created date
    if (sortby && (sortby === "price" || sortby === "discount")) {
      const key = sortby === "price" ? "sellingPrice" : "discount";

      detailsFiltered.forEach((product) => {
        product.variation.sort((a, b) => {
          const variationA = a[key] || 0;
          const variationB = b[key] || 0;
          return order === "asc"
            ? variationA - variationB
            : variationB - variationA;
        });
      });

      detailsFiltered.sort((a, b) => {
        const variationA = a.variation[0]?.[key] || 0;
        const variationB = b.variation[0]?.[key] || 0;
        return order === "asc"
          ? variationA - variationB
          : variationB - variationA;
      });
    } else {
      // Default sort by creation date
      detailsFiltered.sort((a, b) => {
        const dateA = new Date(a.createdAt);
        const dateB = new Date(b.createdAt);
        return order === "asc" ? dateA - dateB : dateB - dateA;
      });
    }

    // Return the filtered and sorted products with pagination
    return res.status(statusCode.ACCEPTED).json({
      success: true,
      message: "Filtered Products Fetched Successfully.",
      data: detailsFiltered.slice((page - 1) * limit, page * limit),
      filterOption: filterOptions,
    });
  } catch (error) {
    return res.status(statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};
