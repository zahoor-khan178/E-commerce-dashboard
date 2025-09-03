const mongoose = require("mongoose");
require("dotenv").config();

const LOCAL_URI = "mongodb://127.0.0.1:27017/E-dashboard";
const CLOUD_URI = process.env.MONGO_URI; // Atlas connection

const dbconnection = async () => {
  try {
    if (CLOUD_URI) {
      console.log(" Trying to connect to MongoDB Atlas...");
      await mongoose.connect(CLOUD_URI);
      console.log(" Connected to MongoDB Atlas");
      return; // stop here if Atlas works
    }
  } catch (cloudErr) {
    console.error(" Could not connect to Atlas:", cloudErr.message);
  }

  // If Atlas failed → fallback to local
  try {
    console.log("💻 Falling back to Local MongoDB...");
    await mongoose.connect(LOCAL_URI);
    console.log(" Connected to Local MongoDB");
  } catch (localErr) {
    console.error(" Could not connect to Local DB:", localErr.message);
    process.exit(1); // Exit only if *both* connections fail
  }
};

 dbconnection();
