import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema({
    productId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Product', 
        required: true 
    },
    quantity: { type: Number, required: true, min: 1 },
    mockUserId: { type: String, required: true, default: 'mock_user_123' },
})

const CartItem = mongoose.models.CartItem || mongoose.model("CartItem", cartItemSchema);

export default CartItem;