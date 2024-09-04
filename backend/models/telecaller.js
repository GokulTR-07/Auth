import mongoose from 'mongoose';

const teleCallerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  businessName: { type: String },
  email: { type: String },
  phone: { type: String, required: true },
  purchasedProduct: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  streetAddress: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zipCode: { type: String, required: true },
});

const TeleCaller = mongoose.model('TeleCaller', teleCallerSchema);

export default TeleCaller;
