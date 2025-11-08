
import express from 'express';
import Product from '../models/Product.js';
import CartItem from '../models/CartItem.js';

const router = express.Router();
const MOCK_USER_ID = 'mock_user_123';


// POST /api/seed-products
router.post('/seed-products', async (req, res) => {
  try {
    let products = req.body; 

    // If it's a single object, wrap it in an array
    if (!Array.isArray(products)) {
      products = [products];
    }

    if (products.length === 0) {
      return res.status(400).json({ message: 'No product data provided.' });
    }

    //check for existing products by name to avoid duplicates
    const existingNames = await Product.find({ name: { $in: products.map(p => p.name) } }).select('name');
    if (existingNames.length > 0) {
      return res.status(400).json({ message: 'Some products already exist in the database.', existing: existingNames });
    }

    await Product.insertMany(products);
    res.status(201).json({ message: `${products.length} product(s) added successfully!` });

  } catch (error) {
    res.status(500).json({ message: 'Error inserting product(s)', error: error.message });
  }
});


// GET /api/products
router.get('/products', async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error: error.message });
  }
});

// GET /api/cart
router.get('/cart', async (req, res) => {
  try {
    const cartItems = await CartItem.find({ mockUserId: MOCK_USER_ID }).populate('productId');

    let subtotal = 0;
    let totalQuantity = 0;
    cartItems.forEach(item => {
      if (item.productId && item.productId.price) {
        subtotal += item.productId.price * item.quantity;
        totalQuantity += item.quantity;
      }
    });

    const taxes = 0.075 * subtotal;
    const shipping = subtotal > 100 || totalQuantity === 0 ? 0 : 15.60;
    const total = subtotal + taxes + shipping;

    res.json({
      items: cartItems,
      summary: {
        subtotal: subtotal.toFixed(2),
        shipping: shipping.toFixed(2),
        taxes: taxes.toFixed(2),
        total: total.toFixed(2),
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching cart', error: error.message });
  }
});

// POST /api/cart
router.post('/cart', async (req, res) => {
  const { productId, quantity } = req.body;

  if (!productId || typeof quantity !== 'number' || quantity <= 0) {
    return res.status(400).json({ message: 'Invalid product ID or quantity.' });
  }

  try {
    let cartItem = await CartItem.findOne({ productId, mockUserId: MOCK_USER_ID });

    if (cartItem) {
      cartItem.quantity += quantity;
      await cartItem.save();
    } else {
      cartItem = new CartItem({ productId, quantity, mockUserId: MOCK_USER_ID });
      await cartItem.save();
    }

    const updatedCart = await CartItem.findById(cartItem._id).populate('productId');
    res.status(200).json(updatedCart);
  } catch (error) {
    res.status(500).json({ message: 'Error adding to cart', error: error.message });
  }
});

// PUT /api/cart/:id
router.put('/cart/:id', async (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body;

  if (typeof quantity !== 'number' || quantity < 0) {
    return res.status(400).json({ message: 'Invalid quantity.' });
  }

  try {
    if (quantity === 0) {
      const result = await CartItem.findByIdAndDelete(id);
      if (!result) return res.status(404).json({ message: 'Cart item not found.' });
      return res.status(200).json({ message: 'Item removed successfully.' });
    }

    const cartItem = await CartItem.findOneAndUpdate(
      { _id: id, mockUserId: MOCK_USER_ID },
      { quantity },
      { new: true }
    ).populate('productId');

    if (!cartItem) return res.status(404).json({ message: 'Cart item not found.' });

    res.status(200).json(cartItem);
  } catch (error) {
    res.status(500).json({ message: 'Error updating cart item', error: error.message });
  }
});

// DELETE /api/cart/:id
router.delete('/cart/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await CartItem.findOneAndDelete({ _id: id, mockUserId: MOCK_USER_ID });
    if (!result) return res.status(404).json({ message: 'Cart item not found.' });
    res.status(200).json({ message: 'Item removed successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Error removing cart item', error: error.message });
  }
});

// POST /api/checkout
router.post('/checkout', async (req, res) => {
  const { name, email } = req.body;

  try {
    const cartItems = await CartItem.find({ mockUserId: MOCK_USER_ID }).populate('productId');
    let subtotal = 0;
    let totalQuantity = 0;
    cartItems.forEach(item => {
      if (item.productId && item.productId.price) {
        subtotal += item.productId.price * item.quantity;
        totalQuantity += item.quantity;
      }
    });

    const taxes = 0.075 * subtotal;
    const shipping = subtotal > 100 || totalQuantity === 0 ? 0 : 15.60;
    const total = subtotal + taxes + shipping;

    await CartItem.deleteMany({ mockUserId: MOCK_USER_ID });

    const receipt = {
      orderNumber: 'VC' + Math.floor(Math.random() * 1000000000),
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      totalPaid: total.toFixed(2),
      customerName: name,
      customerEmail: email,
      itemsPurchased: cartItems.map(item => ({
        name: item.productId.name,
        quantity: item.quantity,
        price: item.productId.price,
      })),
    };

    res.status(200).json(receipt);
  } catch (error) {
    res.status(500).json({ message: 'Checkout failed', error: error.message });
  }
});

// GET /api/user

router.get('/user', async(req, res)=>{
  try{ 
   // mock user info
   const mockUser = {
    id:MOCK_USER_ID,
    name: 'john Doe',
    email: 'jhon@gmail.com',
    joinedAt: '2024-05-15T10:00:00Z',
   }

   const cartItems = await CartItem.find({mockUserId: MOCK_USER_ID}).populate('productId');

   res.json({...mockUser, cartItems});
  }catch(error){
    console.error(error);
    res.status(500).json({ message: 'Error fetching user data', error: error.message });
  }
});

export default router;
