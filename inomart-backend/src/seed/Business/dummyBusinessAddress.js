import { faker } from "@faker-js/faker";
import businessAddress from "../../models/business/businessAddressSchema.js";
import Business from "../../models/business/businessSchema.js";

const generateNumber = () => {
  return Math.floor(100000 + Math.random() * 900000);
};

const dummyBusinessAddress = async (num) => {
  const address = [];

  const allUsers = await Business.find();
  for (let i = 1; i <= num; i++) {
    const random = Math.floor(Math.random() * allUsers.length);
    const businessId = allUsers[random]._id;
    const country = faker.location.country();
    const street = faker.location.streetAddress();
    const city = faker.location.city();
    const state = faker.location.state();
    const zipCode = generateNumber();
    const addressProof = " ";
    const buildingNo = `A/${i}`;

    address.push({
      businessId,
      country,
      street,
      city,
      state,
      zipCode,
      addressProof,
      buildingNo,
    });
  }
  try {
    await businessAddress.insertMany(address);
  } catch (error) {
    console.log(error);
  }
};

export default dummyBusinessAddress;
