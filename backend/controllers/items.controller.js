import Cart from "../models/cart.mode.js";
import Items from "../models/items.model.js";

// Add new item
export const Itcreate = async (req, res, next) => {
  const { ItemsN, unitPrice, packPrice, quantity, image, descrip, manufactureDate, expiryDate } = req.body;

  // Basic validation
  if (!ItemsN || !unitPrice || !packPrice || !quantity || !image || !descrip || !manufactureDate || !expiryDate) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Create new item with dates
    const newItems = new Items({
      ItemsN,
      unitPrice,
      packPrice,
      quantity,
      image,
      descrip,
      manufactureDate: new Date(manufactureDate),
      expiryDate: new Date(expiryDate),
      size: req.body.size || "N/A",
      flavor: req.body.flavor || "N/A"
    });

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
    const items = await Items.find().lean();

    // Format dates for each item
    const formattedItems = items.map(item => ({
      ...item,
      manufactureDate: item.manufactureDate ? item.manufactureDate.toISOString() : null,
      expiryDate: item.expiryDate ? item.expiryDate.toISOString() : null
    }));

    if (formattedItems.length > 0) {
      res.json({ message: "Items details retrieved successfully", items: formattedItems });
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
          manufactureDate: manufactureDate ? new Date(manufactureDate) : null,
          expiryDate: expiryDate ? new Date(expiryDate) : null,
          size: req.body.size || "N/A",
          flavor: req.body.flavor || "N/A"
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

  // Basic validation
  if (!CurrentuserId || !ItemsN || !price || !quantity || !image) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const newItems = new Cart({
      CurrentuserId,
      ItemsN,
      price,
      quantity,
      image,
    });

    const savedItems = await newItems.save();
    res.status(201).json({ message: "Item added to cart successfully", item: savedItems });
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ message: "Failed to add item to cart" });
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
export const deleteItems = async (req, res) => {
  try {
    const { itemId } = req.params;
    
    // Check if the item exists
    const cartItem = await Cart.findById(itemId);
    if (!cartItem) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    // Delete the item
    await Cart.findByIdAndDelete(itemId);
    res.status(200).json({ message: "Item has been removed from cart" });
  } catch (error) {
    console.error("Error deleting cart item:", error);
    res.status(500).json({ message: "Failed to remove item from cart" });
  }
};

// Clear the cart
export const deleteItemss = async (req, res) => {
  try {
    const { CurrentuserId } = req.params;
    const result = await Cart.deleteMany({ CurrentuserId });
    
    if (result.deletedCount > 0) {
      res.status(200).json({ message: "All items have been removed from cart" });
    } else {
      res.status(404).json({ message: "No items found in cart" });
    }
  } catch (error) {
    console.error("Error clearing cart:", error);
    res.status(500).json({ message: "Failed to clear cart" });
  }
};
