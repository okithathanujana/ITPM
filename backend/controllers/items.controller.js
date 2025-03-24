import Cart from "../models/cart.mode.js";
import Items from "../models/items.model.js";
import Items from "../models/items.model.js";

// Add new item
export const Itcreate = async (req, res, next) => {
  const { ItemsN, unitPrice, packPrice, quantity, image, descrip, manufactureDate, expiryDate } = req.body;

  // Basic validation
  if (!ItemsN || !unitPrice || !packPrice || !quantity || !image || !descrip || !manufactureDate || !expiryDate) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Ensure that the dates are valid Date objects
  const formattedManufactureDate = new Date(manufactureDate);
  const formattedExpiryDate = new Date(expiryDate);

  if (isNaN(formattedManufactureDate.getTime()) || isNaN(formattedExpiryDate.getTime())) {
    return res.status(400).json({ message: "Invalid date format" });
  }

  // Create new item with valid dates
  const newItems = new Items({
    ItemsN,
    unitPrice,
    packPrice,
    quantity,
    image,
    descrip,
    manufactureDate: formattedManufactureDate,
    expiryDate: formattedExpiryDate,
   
  });
  

  try {
    const savedItems = await newItems.save();
    res.status(201).json(savedItems);
  } catch (error) {
    next(error);
    console.log(error);
  }
};

// Get all items
export const getAllItems = async (req, res, next) => {
  try {
    const items = await Items.find();

    if (items.length > 0) {
      res.json({ message: "Items details retrieved successfully", items });
    } else {
      return next(errorHandle(404, "Items not found"));
    }
  } catch (error) {
    console.log(error.message);
    next(error);
  }
};

// Update item
export const updateItem = async (req, res, next) => {
  const { unitPrice, packPrice, quantity, ItemsN, descrip, image, manufactureDate, expiryDate } = req.body;

  // Validation for price
  if (!unitPrice || !packPrice) {
    return res.status(400).json({ message: "Both unit price and pack price are required" });
  }

  // Ensure that the dates are valid Date objects
  const formattedManufactureDate = new Date(manufactureDate);
  const formattedExpiryDate = new Date(expiryDate);

  if (isNaN(formattedManufactureDate.getTime()) || isNaN(formattedExpiryDate.getTime())) {
    return res.status(400).json({ message: "Invalid date format" });
  }

  try {
    const updateItem = await Items.findByIdAndUpdate(
      req.params.itemId,
      {
        $set: {
          ItemsN,
          descrip,
          unitPrice,
          packPrice,
          quantity,
          image,
          manufactureDate: formattedManufactureDate,
          expiryDate: formattedExpiryDate,
          
        },
      },
      { new: true }
    );
    res.status(200).json(updateItem);
  } catch (error) {
    next(error);
  }
};

// Delete item
export const deleteItem = async (req, res, next) => {
  try {
    await Items.findByIdAndDelete(req.params.ItemmId);
    res.status(200).json("The item has been deleted");
  } catch (error) {
    next(error);
  }
};

// Add to cart
export const Cartcrete = async (req, res, next) => {
  const { CurrentuserId, ItemsN, price, quantity, image } = req.body;

  const newItems = new Cart({
    CurrentuserId,
    ItemsN,
    price,
    quantity,
    image,
  });

  try {
    const savedItems = await newItems.save();
    res.status(201).json(savedItems);
  } catch (error) {
    next(error);
    console.log(error);
  }
};

// Display items in the cart
export const getCartItem = async (req, res, next) => {
  try {
    const { CurrentuserId } = req.params;

    // Query the database for documents matching CurrentuserId
    const items = await Cart.find({ CurrentuserId });
    res.json(items);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Remove one item from the cart
export const deleteItems = async (req, res, next) => {
  try {
    await Cart.findByIdAndDelete(req.params.itemsId);
    res.status(200).json("The post has been deleted");
  } catch (error) {
    next(error);
  }
};

// Clear the cart
export const deleteItemss = async (req, res, next) => {
  try {
    const { CurrentuserId } = req.params;

    // Delete items associated with the specified CurrentUserId
    await Cart.deleteMany({ CurrentuserId });

    res.status(200).json({ message: "Items have been deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};
