import { faker } from '@faker-js/faker';
import Users from '../../models/users/userSchema.js';
import Coupons from '../../models/product/couponSchema.js';

const dummyCoupon = async (num) => {
  const coupon = [];

  const allUsers = await Users.find();
  for (let i = 1; i <= num; i++) {
    const random = Math.floor(Math.random() * allUsers.length);
    const userId = allUsers[random]._id;
    const subCategory = [faker.lorem.sentence(), faker.lorem.sentence()];
    const code = `ABCDEF${i}`;
    const amount = (random + 1) * 100;
    const validTill = Date.now();
    const minLimit = (random + 1) * 1000;

    coupon.push({
      userId,
      subCategory,
      code,
      amount,
      validTill,
      minLimit
    });
  }
  try {
    await Coupons.insertMany(coupon);
  }
  catch (error) {
    console.log(error);
  }
};

export default dummyCoupon;