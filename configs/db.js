import mongoose from "mongoose";

const connectToDB = async () => {
  try {
    if (mongoose.connection.readyState === 1) {
      return true;
    }

    await mongoose.connect(process.env.MONGODB_URI);

    console.log("Connect To DB Successfully :))");

    return true;
  } catch (err) {
    console.error("DB Connection Has Error =>", err);
    throw err;
  }
};

export default connectToDB;