import mongoose from "mongoose";

const walletSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    balance: {
        type: Number,
        required: true,
        default: 0
    },
    transactions: [
        {
            type: {
                type: String,
                enum: ['Credit', 'Debit'],
                required: true
            },
            amount: {
                type: Number,
                required: true
            },
            description: {
                type: String,
                required: true
            },
            orderId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Order' 
            },
            balanceAfter: {
                type: Number,
                required: true
            },
            createdAt: {
                type: Date,
                default: Date.now
            }
        }
    ]
}, { timestamps: true });

const Wallet = mongoose.model('Wallet', walletSchema);
export default Wallet;
