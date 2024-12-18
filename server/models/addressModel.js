import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true 
    },
    firstName:{ 
        type: String, 
        required: true 
    },
    lastName:{ 
        type: String,
        required: true
    },
    email:{ 
        type: String, 
        required: true 
    },
    mobile:{ 
        type: String, 
        required: true 
    },
    address:{ 
        type: String, 
        required: true 
    },
    locality:{ 
        type: String, 
        required: true 
    },
    state:{
        type: String, 
        required: true 
    },
    country:{ 
        type: String,
        required: true 
    },
    pincode:{ 
        type: String, 
        required: true 
    },
    isDefault:{ 
        type: Boolean,
        default: false 
    },
});

const Address = mongoose.model("Address", addressSchema);
export default Address