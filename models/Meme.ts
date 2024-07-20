import mongoose from "mongoose";

const memeSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["image", "video"],
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    image: {
      type: String,
      default: "",
    },
    video: {
      type: String,
      default: "",
    },
    height: {
      type: Number,
      required: true,
    },
    padding: {
      type: Number,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { collection: "memes" }
);

const Meme = mongoose.model("Meme", memeSchema);

export default Meme;
