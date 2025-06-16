import { faker } from '@faker-js/faker';
import Product from '../../models/product/productSchema.js';
import Business from '../../models/business/businessSchema.js';


const dummyProduct = async (num) => {
  const product = [];

  const allUsers = await Business.find();
  for (let i = 1; i <= num; i++) {
    const random = Math.floor(Math.random() * allUsers.length);
    const sellerId = allUsers[random].sellerId;
    const productName = faker.person.lastName();
    const details = { color: "red", size: "XS" };
    const category = faker.lorem.sentence();
    const subCategory = faker.lorem.sentence();
    const price = random * 100;
    const discount = i;
    const stock = (random + 1) * 2;
    const productImages = ["path 1", "path 2"];
    const productVideo = "";

    product.push({
      sellerId,
      productName,
      details,
      category,
      subCategory,
      price,
      discount,
      stock,
      productImages,
      productVideo
    });
  }
  try {
    await Product.insertMany(product);
  }
  catch (error) {
    console.log(error);
  }
};

export default dummyProduct;