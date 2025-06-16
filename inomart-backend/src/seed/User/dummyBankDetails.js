import { faker } from '@faker-js/faker';
import UsersBankDetails from '../../models/users/userBankDetailsSchema.js';
import Users from '../../models/users/userSchema.js';

const generateAccountNumber = () => {
    return Math.floor(100000 + Math.random() * 900000);
};

const generateRandomNumber = () => {
    const max = 9;
    const min = 1;
    return Math.floor(Math.random() * (max - min + 1) + min);
};

const dummyBankDetails = async (num) => {
    const bankDetails = [];
    const allUsers = await Users.find();

    for (let i = 0; i < num; i++) {
        const userName = faker.person.fullName(); 
        const bankName = faker.finance.accountName(); 
        const branchName = faker.location.city();
        const accountNumber = generateAccountNumber();
        const ifscCode = `IDIB0${generateRandomNumber()}${generateRandomNumber()}${generateRandomNumber()}${generateRandomNumber()}99`;

        const randomIndex = Math.floor(Math.random() * allUsers.length);
        const userId = allUsers[randomIndex]._id;

        bankDetails.push({
            userId,
            userName,
            bankName,
            branchName,
            accountNumber,
            ifscCode
        });
    }

    try {
        await UsersBankDetails.insertMany(bankDetails);
        console.log(`${num} bank details inserted successfully.`);
    } catch (error) {
        console.error("Error inserting bank details:", error);
    }
};

export default dummyBankDetails;