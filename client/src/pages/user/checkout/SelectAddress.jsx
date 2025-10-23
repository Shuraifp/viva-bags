import { useState, useEffect,useRef } from "react";
import { FaCheck, FaPlus,FaMinus } from "react-icons/fa";
import { getAddresses } from "../../../api/address";
import AddAddress from "../profile/AddAddress";


const SelectAddress = ({selectedAddress,setSelectedAddress}) => {
  const addressFormScrollRef = useRef(null);
  const [addresses, setAddresses] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedOnly, setSelectedOnly] = useState(false);
  const [editing,setEditing] = useState(null);
  const [adding,setAdding] = useState(false);
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

  useEffect(() => {
    if (editing || adding) {
      addressFormScrollRef.current?.scrollIntoView({  behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'auto', });
    }
  }, [editing, adding]);

  useEffect(() => {
    const getAllAddr = async () => {
      try {
        const response = await getAddresses();
        setAddresses([...response.data]);
        setSelectedAddress(response.data.find(addr => addr.isDefault===true))
        setSelectedOnly(response.data.find(addr => addr.isDefault===true))
      } catch (err) {
        console.log(err);
      }
    };
    getAllAddr();
  }, []);

  const handleEditAddress = (id) => {
    const addressToEdit = addresses.find((address) => address._id === id);
    setNewAddress(addressToEdit);
    setEditing(addressToEdit);
  };
console.log(selectedOnly)
  return (
    <div className="bg-gray-100">
      <div
        className="py-2 px-2 md:px-4 bg-gray-500 hover:bg-gray-600 text-white text-md md:text-lg shadow-sm cursor-pointer flex justify-between items-center"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
      >
        <div className="flex gap-2 items-center">
          <p>Select delivery address</p>
          {selectedOnly && <FaCheck className="text-white" />}
        </div>
        {isDropdownOpen? <FaMinus /> : <FaPlus />}
      </div>

      <div className={`transition-all duration-500 ease-in-out ${
          isDropdownOpen ? "opacity-100" : "max-h-0 opacity-0"
        }`}>
      <div
        className={`mt-2 overflow-y-scroll max-h-[300px] no-scrollbar`}
      >
        {addresses.map((address, index) => (
          <div
            key={index}
            className={`p-4 my-2 border shadow-sm bg-white flex flex-col md:flex-row justify-between items-start md:items-center ${
              address._id === selectedOnly?._id ? "border-blue-500" : "border-gray-300"
            }`}
            onClick={() => setSelectedOnly(address)}
          >
            <div className="flex items-start space-x-2">
              <input
                type="radio"
                name="deliveryAddress"
                className="mt-2"
                checked={selectedOnly?._id === address._id ? true : false}
              />
              <div>
                
                  <p className="font-semibold text-md">{address.firstName} {address.lastName}</p>
                  <p className="text-gray-600">{address.email}</p>
                
                <p className="text-gray-600">{address.mobile}</p>
                <p className="text-gray-600">
                  {address.address}, {address.state} - <strong>{address.pincode}</strong>
                </p>
              </div>
            </div>
            <div className="flex flex-col md:flex-row items-start md:items-center space-y-2 md:space-y-0 md:space-x-4 mt-4 md:mt-0">
              <button 
              onClick={() => {setSelectedAddress(address); setIsDropdownOpen(false)}} className="px-4 py-2 bg-orange-500 text-white shadow hover:bg-orange-600">
                DELIVER HERE
              </button>
              <button
              onClick={() => handleEditAddress(address._id)}
              className="text-blue-500 hover:underline">EDIT</button>
            </div>
          </div>
        ))}
        </div>
        <button
          className="py-2 mt-2 px-2 md:px-4 bg-gray-500 hover:bg-gray-600  text-white text-md md:text-lg shadow-sm w-full"
          onClick={() => setAdding(true)}
        >
          Add New Address
        </button>

        <AddAddress addresses={addresses} setAddresses={setAddresses} editing={editing} setEditing={setEditing} adding={adding} setAdding={setAdding} newAddress={newAddress} setNewAddress={setNewAddress} addressFormScrollRef={addressFormScrollRef}/>
      </div>
    </div>
  );
};

export default SelectAddress;
