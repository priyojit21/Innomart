import { faker } from '@faker-js/faker';
import Users from '../../models/users/userSchema.js';
import bcrypt from "bcryptjs";


const generateTenDigitPhoneNumber = () => {
  return Math.floor(1000000000 + Math.random() * 9000000000);
};

const dummyUser = async (num) => {
  const users = [];

  for (let i = 1; i <= num; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    let password = `Password@123`;
    const email = `user+${i}@itobuz.com`;
    const phone = generateTenDigitPhoneNumber();

    const hashedPassword = await bcrypt.hash(password, 10);
    password = hashedPassword;

    users.push({
      firstName,
      lastName,
      password,
      email,
      phone,
    });
  }
  try {
    await Users.insertMany(users);
  }
  catch (error) {
    console.log(error);
  }
};

export default dummyUser;