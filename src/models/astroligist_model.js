import mongoose, { Schema } from "mongoose";

const AstrologistSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: false,
  },
  description: {
    type: String,
    required: true,
  },
  astroType: {
    type: String,
    enum: ["palmist", "kundali"],
    required: true,
  },
  rating: {
    type: Number,
  },
  fees: {
    type: Number,
    required: true,
  },
});

const Astrologist = mongoose.model("Astrologist", AstrologistSchema);

export { Astrologist };
