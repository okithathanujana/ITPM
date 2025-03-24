import express from 'express';
import { 
  Itcreate, 
  updateItem, 
  getAllItems, 
  deleteItem, 
  deleteItems,
  Cartcrete,
  getCartItem,
  deleteItemss
} from '../controllers/items.controller.js';

const router = express.Router();

// Route to create a new item
router.post('/create', Itcreate);

// Route to get all items
router.get('/IgetAll', getAllItems);

// Route to update an item by itemId
router.put('/Update/:itemId', updateItem);

// Route to delete an item by itemId
router.delete('/delete/:ItemmId', deleteItem);

// Route to delete all items (optional)
router.delete('/deleteall', deleteItems);

// Cart Routes
router.post('/Ccreate', Cartcrete);  // Add to cart
router.get('/CgetAll/:CurrentuserId', getCartItem);  // Get cart items
router.delete('/deletes/:itemId', deleteItems);  // Remove item from cart
router.delete('/deleteall/:CurrentuserId', deleteItemss);  // Clear cart

export default router;
