import React from 'react'
import { useState } from 'react';
import { addAddress, editAddress} from '../../../api/address';
import { toast } from 'react-hot-toast';


const AddAddress = ({ addresses, setAddresses, editing, setEditing, adding, setAdding, newAddress, setNewAddress, addressFormScrollRef }) => {
  const [errors, setErrors] = useState({});


  const handleAddAddress = () => {
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      console.log(validationErrors)
      setErrors(validationErrors);
      return;
    }
    
    if (editing) {
      const editAdds = async () => {
        try{
          const response = await editAddress(editing._id,newAddress)
          if(response.status === 200){
            toast.success(response.data.message)
            const updatedAddresses = addresses.map((address) => {
              if (address._id === editing._id) {
                return { ...address, ...newAddress };
              }
              return address;
            })
            setAddresses(updatedAddresses);
            setEditing(null);
          } else {
            toast.error(response.data.message)
          }

        } catch(err){
          console.log(err)
        }
      }
      editAdds()
    } else {
      const addAdds = async () => {
      try{
        const response = await addAddress(newAddress)
        const addrData = response.data.addrData
        console.log(response)
        if(response.status === 201 ){
          toast.success(response.data.message)
          setAdding(false)
          setAddresses([...addresses, addrData]);
        }
      } catch(err){
        console.log(err)
      }
    }
    addAdds()
    }
    
    setNewAddress({
      firstName: '',
      lastName: '',
      email: '',
      mobile: '',
      address: '',
      locality: '',
      state: '',
      pincode: '',
      country: '',
      isDefault: false,
    });
    setErrors({});
    setAdding(false);
  };


  const validateForm = () => {
    const validationErrors = {};
    
    Object.keys(newAddress).forEach((key) => {
      if (!newAddress[key] && key !== 'isDefault') {
        validationErrors[key] = `${key} is required`;
      }
    });

    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (newAddress.email && !emailPattern.test(newAddress.email)) {
      validationErrors.email = 'Please enter a valid email address';
    }

    const mobilePattern = /^(\+91[-\s]?)?[6-9]\d{9}$/;
    if (newAddress.mobile && !mobilePattern.test(newAddress.mobile)) {
      validationErrors.mobile = 'Please enter a valid mobile number';
    }

    const pincodePattern = /^[1-9][0-9]{5}$/;
    if (newAddress.pincode && !pincodePattern.test(newAddress.pincode)) {
      validationErrors.pincode = 'Please enter a valid pincode';
    }

    return validationErrors;
  };


  return (
    <div
      ref={addressFormScrollRef} 
      className={`mt-4 ${editing || adding ? 'block' : 'hidden'}`}>
        <div className="bg-slate-100 shadow-md rounded-lg p-6 flex justify-between hover:translate-x-2">
        <h3 className="text-lg font-medium">{editing ? 'Edit Address' : 'Add New Address'}</h3>
        <h2 onClick={() => { setAdding(false); setEditing(null); setNewAddress({
          firstName: '',
          lastName: '',
          email: '',
          mobile: '',
          address: '',
          locality: '',
          state: '',
          pincode: '',
          country: '',
          isDefault: false,
        });
        setErrors({})
      }} className='cursor-pointer text-red-500 font-bold text-xl'>X</h2>
        </div>
        <div className="mt-4 grid grid-cols-1 gap-4">
          <input
            type="text"
            value={newAddress?.firstName}
            onChange={(e) => setNewAddress({ ...newAddress, firstName: e.target.value })}
            className={`p-2 border ${errors.firstName ? 'border-red-500' : 'border-gray-300'} rounded hover:translate-x-1`}
            placeholder="First Name"
          />
          {errors.firstName && <span className="text-red-500 text-sm">{errors.firstName}</span>}

          <input
            type="text"
            value={newAddress?.lastName}
            onChange={(e) => setNewAddress({ ...newAddress, lastName: e.target.value })}
            className={`p-2 border ${errors.lastName ? 'border-red-500' : 'border-gray-300'} rounded hover:translate-x-1`}
            placeholder="Last Name"
          />
          {errors.lastName && <span className="text-red-500 text-sm">{errors.lastName}</span>}

          <input
            type="email"
            value={newAddress?.email}
            onChange={(e) => setNewAddress({ ...newAddress, email: e.target.value })}
            className={`p-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded hover:translate-x-1`}
            placeholder="Email"
          />
          {errors.email && <span className="text-red-500 text-sm">{errors.email}</span>}

          <input
            type="text"
            value={newAddress?.mobile}
            onChange={(e) => setNewAddress({ ...newAddress, mobile: e.target.value })}
            className={`p-2 border ${errors.mobile ? 'border-red-500' : 'border-gray-300'} rounded hover:translate-x-1`}
            placeholder="Mobile"
          />
          {errors.mobile && <span className="text-red-500 text-sm">{errors.mobile}</span>}

          <input
            type="text"
            value={newAddress?.address}
            onChange={(e) => setNewAddress({ ...newAddress, address: e.target.value })}
            className={`p-2 border ${errors.address ? 'border-red-500' : 'border-gray-300'} rounded hover:translate-x-1`}
            placeholder="Address"
          />
          {errors.address && <span className="text-red-500 text-sm">{errors.address}</span>}

          <input
            type="text"
            value={newAddress?.locality}
            onChange={(e) => setNewAddress({ ...newAddress, locality: e.target.value })}
            className={`p-2 border ${errors.locality ? 'border-red-500' : 'border-gray-300'} rounded hover:translate-x-1`}
            placeholder="Locality"
          />
          {errors.locality && <span className="text-red-500 text-sm">{errors.locality}</span>}

          <input
            type="text"
            value={newAddress?.state}
            onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
            className={`p-2 border ${errors.state ? 'border-red-500' : 'border-gray-300'} rounded hover:translate-x-1`}
            placeholder="State"
          />
          {errors.state && <span className="text-red-500 text-sm">{errors.state}</span>}

          <input
            type="text"
            value={newAddress?.pincode}
            onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })}
            className={`p-2 border ${errors.pincode ? 'border-red-500' : 'border-gray-300'} rounded hover:translate-x-1`}
            placeholder="Pincode"
          />
          {errors.pincode && <span className="text-red-500 text-sm">{errors.pincode}</span>}

          <input
            type="text"
            value={newAddress?.country}
            onChange={(e) => setNewAddress({ ...newAddress, country: e.target.value })}
            className={`p-2 border ${errors.country ? 'border-red-500' : 'border-gray-300'} rounded hover:translate-x-1`}
            placeholder="Country"
          />
          {errors.country && <span className="text-red-500 text-sm">{errors.country}</span>}

          <label className="flex items-center mt-2">
            <input
              type="checkbox"
              checked={newAddress?.isDefault}
              onChange={(e) => setNewAddress({ ...newAddress, isDefault: e.target.checked })}
              className="mr-2"
            />
            Set as Default Address
          </label>

          <button
            type="button"
            onClick={handleAddAddress}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
          >
            {editing ? 'Update Address' : 'Add Address'}
          </button>
        </div>
      </div>
  )
}

export default AddAddress
