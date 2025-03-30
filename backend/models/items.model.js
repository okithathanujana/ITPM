import mongoose from 'mongoose';

const ItemsSchema = new mongoose.Schema({
  ItemsN: { type: String, required: true },
  unitPrice: { type: Number, required: false, default: null },
  packPrice: { type: Number, required: true },
  quantity: { type: Number, required: true },
  image: { type: String, required: true },
  descrip: { type: String, required: true },
  manufactureDate: { type: Date, required: true },
  expiryDate: { type: Date, required: true },
  size: { type: String, default: "N/A" },
  flavor: { type: String, default: "N/A" }
});

const Items = mongoose.model('Items', ItemsSchema);
export default Items;
