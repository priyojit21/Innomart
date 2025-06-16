import { faker } from "@faker-js/faker";
import Business from "../../models/business/businessSchema.js";
import Users from "../../models/users/userSchema.js";

const generateNumber = () => {
  return Math.floor(100000 + Math.random() * 900000);
};

const governmentIdTypes = [
  "Aadhaar Card",
  "Passport",
  "Driver's License",
  "PAN",
  "Voter ID",
];

const dummyBusiness = async (num) => {
  const business = [];

  const allUsers = await Users.find();
  for (let i = 1; i <= num; i++) {
    const random = Math.floor(Math.random() * allUsers.length);
    const sellerId = allUsers[random]._id;
    const storeName = faker.person.firstName();
    const registrationNumber = generateNumber();
    const description = faker.lorem.sentence();
    const logo = " ";
    const businessLicense = generateNumber();
    const randomIdTypeIndex = Math.floor(
      Math.random() * governmentIdTypes.length
    );
    const governmentIdType = governmentIdTypes[randomIdTypeIndex];
    const governmentId = generateNumber();

    business.push({
      sellerId,
      storeName,
      registrationNumber,
      description,
      logo,
      businessLicense,
      governmentIdType,
      governmentId,
    });
  }
  try {
    await Business.insertMany(business);
  } catch (error) {
    console.log(error);
  }
};

export default dummyBusiness;
