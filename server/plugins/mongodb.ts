import { Nitro } from "nitropack";
import mongoose from "mongoose";

export default async (_nitroApp: Nitro) => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URL}`, {
        dbName: process.env.DB_NAME,
    });
    console.log("Connected to MongoDB");
  } catch (e) {
    console.error(e);
  }
};