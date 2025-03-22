import mongoose from 'mongoose';

const ItemSchema = new mongoose.Schema(
  {
    ItemsN: {
      type: String,
      required: true,
    },
    unitPrice: {
      type: Number,
      required: true,
    },
    packPrice: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    descrip: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Items = mongoose.model("Items", ItemSchema);

export default Items;
