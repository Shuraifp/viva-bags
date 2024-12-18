import Address from "../models/addressModel.js";



export const addAddress = async (req, res) => {
  const userId = req.user.Id
  const { firstName, lastName, email, mobile, address, locality, state, pincode, country, isDefault } =req.body.newAddress
  const addressData = {
    user: userId,
    firstName: firstName,
    lastName: lastName,
    email: email,
    mobile: mobile,
    address: address,
    locality: locality,
    state: state,
    pincode: pincode,
    country: country,
    isDefault: isDefault,
  };
  try{
    if(isDefault){
      const previousDefault = await Address.findOneAndUpdate({user:userId, isDefault: true}, {isDefault: false}, {new: true})
    }
    const address = new Address(addressData)
    await address.save();
    const { __v , ...addrData} = address
    res.status(201).json({message: "address added successfully", addrData:addrData._doc})
  } catch(err){
    res.status(500).json({message: "server error"})
  }
}


export const getAllAddresses = async (req,res) => {
  try{
    const addresses = await Address.find({user:req.user.Id}).select('-__v')
    res.status(200).json(addresses);
  } catch(err){
    res.status(500).json({message: 'server error'})
  }
}


export const editAddress = async (req, res) => {
  const addressId = req.params.id 
  const userId = req.user.Id
  const updatedData = req.body.updatedAddress; 

  try {
    if(updatedData.isDefault){
      const previousDefault = await Address.findOneAndUpdate({user:userId, isDefault: true}, {isDefault: false}, {new: true})
    }
    const updatedAddress = await Address.findByIdAndUpdate(
      addressId,
      { ...updatedData },
      { new: true } 
    )

    if (!updatedAddress) {
      return res.status(404).json({ message: "Address not found" });
    }
console.log(updatedAddress)
    res.status(200).json({
      message: "Address updated successfully",
      updatedAddress,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


export const deleteAddress = async (req, res) => {
  const addressId = req.params.id

  try {
    const deletedAddress = await Address.findByIdAndDelete(addressId);
    console.log(deleteAddress)

    if (!deletedAddress) {
      return res.status(404).json({ message: "Address not found" });
    }

    res.status(200).json({
      message: "Address deleted successfully",
      deletedAddress,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


export const toggleDefault = async (req,res) => {
  const addressId = req.params.id
  const userId = req.user.Id
  try{
    if(!await Address.findById(addressId)){
      return res.status(404).json({message: "address not found"})
    }
    const previousDefault = await Address.findOneAndUpdate({user:userId, isDefault: true}, {isDefault: false}, {new: true})
    const currentDefault = await Address.findOneAndUpdate({user:userId, _id:addressId}, {isDefault: true}, {new: true})
    res.status(200).json({message: "default address has been changed", currentDefault})
  } catch(err){
    res.status(500).json({message: "server error"})
  }
}