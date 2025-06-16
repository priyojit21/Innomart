import { faker } from '@faker-js/faker';
import Product from '../../models/product/productSchema.js';
import Feedback from '../../models/product/feedbackSchema.js';
import Users from '../../models/users/userSchema.js';

const dummyFeedback = async (num) => {
  const feedback = [];

  const allUsers = await Users.find();
  const allProducts = await Product.find();
  for (let i = 1; i <= num; i++) {
    const random = Math.floor(Math.random() * allUsers.length);
    const productId = allProducts[random]._id;
    const userId = allUsers[random]._id;
    const rating = Math.floor(Math.random() * 4) + 1;
    const review = faker.lorem.sentence();

    feedback.push({
      productId,
      userId,
      rating,
      review
    });
  }
  try {
    await Feedback.insertMany(feedback);
  }
  catch (error) {
    console.log(error);
  }
};

export default dummyFeedback;