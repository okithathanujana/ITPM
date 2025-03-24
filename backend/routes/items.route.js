import express from 'express';
import { 
  Itcreate, 
  updateItem, 
  getAllItems, 
  deleteItem, 
  deleteItems 
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

router.put('/Update/:itemId', updateItem); // Handle updating product by itemId

router.get('/IgetAll', getAllItems);  // Ensure the route is fetching all items, including dates



export default router;
