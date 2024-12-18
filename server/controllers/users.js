import User from '../models/userModel.js'; 
import Address from '../models/addressModel.js';
import bcrypt from 'bcryptjs';


export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password -__v -createdAt -updatedAt');
    console.log('fetched all users')
    res.status(200).json(users); 
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};


export const updateBlockStatus = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findByIdAndUpdate(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.isBlocked = !user.isBlocked;
    await user.save();
    console.log('user status updated');
    res.json({ message:"Status updated successfully", user});
  } catch (error) {
    res.status(500).json({ message: "Failed to update" });
  }
};


export const countUsers = async (req, res) => {
  try {
    const count = await User.countDocuments();
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: "Failed to count users" });
  }
};

export const fetchProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.Id).select('-password -__v -createdAt -updatedAt');
    const defaultAddress = await Address.find({user:req.user.Id,isDefault:true}).select('-__v -createdAt -updatedAt -_id');
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if(defaultAddress.length === 0) {
      res.status(200).json({
        user,
        message: "Profile fetched successfully",
      })
    } else{
      res.status(200).json({
        user:{
          ...user.toObject(),
          firstName: defaultAddress[0].firstName || '',
          lastName: defaultAddress[0].lastName || '',
          mobile: defaultAddress[0].mobile || '',
        },
        message: "Profile fetched successfully",
      });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};


export const editProfile = async (req, res) => {
  try {
    const { firstName, lastName, email} = req.body;
    const address = await Address.findOne({user:req.user.Id,isDefault:true});
    const user = await User.findById(req.user.Id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if(address){
      address.firstName = firstName;
      address.lastName = lastName;
      await address.save();
    }
    user.email = email
    await user.save();
    console.log(address)
    res.status(200).json({ message: "Profile updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


export const changePassword = async (req, res) => {

    const { oldPassword, newPassword } = req.body;
  
    try {
      const user = await User.findById(req.user.Id);
      if (!user) return res.status(404).json({ message: "User not found" });
  
      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) return res.status(400).json({ message: "Old password is incorrect" });
  
      user.password = await bcrypt.hash(newPassword, 10);
      await user.save();
  
      res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  }
  
