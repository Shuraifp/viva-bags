import { useState, useEffect, useRef, useContext } from 'react';
import { AuthContext } from '../../../context/AuthProvider';
import { getAddresses, deleteAddress, changeDefaultAddress } from '../../../api/address';
import { FaEdit, FaTrash } from 'react-icons/fa';
import toast from 'react-hot-toast';
import AddAddress from './AddAddress';

const Address = () => {
  const { logout } = useContext(AuthContext);
  const addressFormScrollRef = useRef(null);
  const [addresses, setAddresses] = useState([])
  const [defaultAddr, setDefaultAddr] = useState(null);
  useEffect(() => {
    const getAllAddr = async () => {
      try{
        const response = await getAddresses();
        setAddresses([...response.data])
      } catch(err){
        if(err.response){
          if(err.response.status === 401 && err.response.data.message === "User is blocked"){
            logout();
          }
        } else {
          console.log(err)
        }
      }
    }
    getAllAddr();
    const defaultAddress = addresses.find(addr => addr.isDefault === true)
    setDefaultAddr(defaultAddress)
  },[])
  console.log(addresses)
  const [newAddress, setNewAddress] = useState({
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
  
  const [editing, setEditing] = useState(null);
  const [adding,setAdding] = useState(false);


  useEffect(() => {
    if (editing || adding) {
      addressFormScrollRef.current?.scrollIntoView({  behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'auto', });
    }
  }, [editing, adding]);

  const handleSetDefault = (id) => {
    if (defaultAddr && defaultAddr._id === id) return;
    const setDefault = async () => {
      try {
        const response = await changeDefaultAddress(id);
        if (response.status === 200) {
          toast.success(response.data.message);
          const updatedAddresses = addresses.map((addr) => {
            return addr._id === id ? { ...addr, isDefault: true } : { ...addr, isDefault: false };
          });
          setDefaultAddr(updatedAddresses.find(addr => addr._id === id));
          setAddresses(updatedAddresses);
        } else {
          toast.error(response.data.message);
        }
      } catch (err) {
        toast.error(err.message);
      }
    }
    setDefault();
   
    setAddresses(updatedAddresses);
  }
   
  const handleDeleteAddress = (id) => {
    const deleteAdds = async () => {
      try{
        const response = await deleteAddress(id)
        if(response.status === 200){
          toast.success(response.data.message)
          setAddresses(addresses.filter((address) => address._id !== response.data.deletedAddress._id));
        } else {
          toast.error(response.data.message)
        }
      } catch(err){
        console.log(err)
      }
    }
    deleteAdds()
  };

  const handleEditAddress = (id) => {
    const addressToEdit = addresses.find((address) => address._id === id);
    setNewAddress(addressToEdit);
    setEditing(addressToEdit);
  };
  
  return (
    <div className="bg-slate-100 md:min-h-screen p-6 my-4">
      <div className='flex justify-between'>
      <h2 className="text-2xl font-semibold">Manage Addresses</h2>
      <button
        onClick={() => setAdding(true)}
        className="bg-slate-500 text-white rounded-md px-4 py-2 mr-2"
      >
        Add New Address
      </button>
      </div>
      <ul className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {addresses.map((address,i) => (
          <li key={address._id} className="flex flex-col justify-between relative bg-white shadow-md px-5 py-6 mt-2">
          
              <div className='absolute top-2 right-2 flex'>
                <div 
                onClick={() => handleEditAddress(address._id)} className='mr-3 flex items-center cursor-pointer'>
                  <FaEdit />
                </div>
                <div
                  onClick={() => handleDeleteAddress(address._id)}
                  className="cursor-pointer"
                >
                  <FaTrash />
                </div>
            
            </div>
            <div>
              <h3 className='text-lg font-semibold mt-1 mb-3'>Address {i + 1}</h3>
              <p>{address.firstName} {address.lastName}</p>
              <p>{address.address}</p>
              <p>{address.email}</p>
              <p>{address.mobile}</p>
              <p>{address.locality}, {address.state} {address.pincode}</p>
              <p>{address.country}</p>  
            </div>
            <label onClick={() => handleSetDefault(address._id)} className='mt-4 text-yellow-600 flex gap-1 text-sm'><input type="radio" checked={address.isDefault} />Default Address</label>
          </li>
        ))}
      </ul>

      <AddAddress addressFormScrollRef={addressFormScrollRef} editing={editing} setEditing={setEditing} newAddress={newAddress} setNewAddress={setNewAddress} addresses={addresses} setAddresses={setAddresses} adding={adding} setAdding={setAdding} />  

    </div>
  );
};

export default Address;
