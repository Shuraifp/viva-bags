import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    orderNumber: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    products: [{
        productId: {
            type: mongoose.Schema.ObjectId,
            ref: 'Product',
            required: true
        },
        quantity: {
            type: Number,
            requried: true
        },
        status: {
            type: String,
            enum: ['Pending', 'Shipped', 'Delivered', 'Cancelled'],
            default: 'Pending'
        },
    }
    ],
    address: {
        fullName: {
            type: String,
            required: true
        },
        email: {
            type: String,
        },
        mobile: {
            type: String,
            required: true
        },
        address: {
            type: String,
            required: true
        },
        locality: {
            type: String,
            required: true
        },
        state: {
            type: String,
            required: true
        },
        pincode: {
            type: String,
            required: true
        },
        country: {
            type: String,
            required: true
        }
    },
    totalAmount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Shipped', 'Delivered', 'Cancelled'],
        default: 'Pending'
    },
    paymentMethod: {
        type: String,
        enum: ['COD', "Razorpay", "Wallet"],
        default: "COD"
    },
    shippingCost: {
        type: Number,
        required: true
    },
    coupon : {
        code: {
            type: String
        },
        discountType: {
            type: String
        },
        discountValue: {
            type: Number
        }
    },
    paymentStatus: {
        type: String,
        enum: ['Pending', 'Completed', 'Failed'],
        default: 'Pending'
    },

}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);
export default Order;