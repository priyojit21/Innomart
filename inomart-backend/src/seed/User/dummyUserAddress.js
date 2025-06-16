import { faker } from '@faker-js/faker';
import Users from '../../models/users/userSchema.js';
import UsersAddress from '../../models/users/userAddressSchema.js';


const generateSixDigitPinCode = () => {
  return Math.floor(100000 + Math.random() * 900000);
};

const dummyUserAddress = async (num) => {
  const address = [];

  const allUsers = await Users.find();
  for (let i = 1; i <= num; i++) {
    const country = faker.location.country();
    const street = faker.location.streetAddress();
    const city = faker.location.city();
    const state = faker.location.state();
    const pinCode = generateSixDigitPinCode();
    const houseNo = `A/${i}`;

    const random = Math.floor(Math.random() * allUsers.length);
    const userId = allUsers[random]._id;


    address.push({
      userId,
      country,
      street,
      city,
      state,
      pinCode,
      houseNo
    });
  }
  try {
    await UsersAddress.insertMany(address);
  }
  catch (error) {
    console.log(error);
  }
};

export default dummyUserAddress;