import mongoose from "mongoose";
import { Schema } from "mongoose";

const userDataSchema = new Schema({
  recommendation: {
    useCases: [String],
  },
  gender: { 
    type: String, 
    enum: ['male', 'female', 'others'], 
    required: true 
  }, 
  culinary: {
    cuisine: String,
    dishes: [String],
    flavor: String,
    healthBenefits: [String],
    healthConditions: [String],
    learnTechniques: String
  },
  medicinal: {
    medications: String,
    benefits: [String],
    consultedProvider: String, // Keep as String for received data
    concerns: String
  },
  cosmetic: {
    skinType: String,
    skinConcerns: [String],
    applicationFrequency: String,
    usedSaffron: String // Keep as String for received data
  },
  pregnantWomen: {
    pregnancyStage: String,
    usedBeforePregnancy: String, // Keep as String for received data
    usingDuringPregnancy: String, // Keep as String for received data
    knownAllergies: String
  },
  user: {
    id: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    role: String,
  },
});

const UserData = mongoose.model("UserData", userDataSchema);
export default UserData;
