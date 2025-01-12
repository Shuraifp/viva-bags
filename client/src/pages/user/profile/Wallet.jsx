import React, { useState, useEffect } from 'react';
import { fetchWallet, addMoneyToWallet } from '../../../api/wallet';
import toast from 'react-hot-toast';

const WalletPage = () => {
  const [wallet, setWallet] = useState({});
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchWalletData();
  }, []);

  const fetchWalletData = async () => {
    try {
      const response = await fetchWallet();
      setWallet(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddMoney = async () => {
    if (!amount) {
      toast.error('Please enter an amount');
      return;
    }

    try {
      setLoading(true);
      const response = await addMoneyToWallet({ amount: Number(amount)});
      toast.success('Money added successfully');
      fetchWalletData();
      setAmount('');
    } catch (error) {
      console.error(error);
      toast.error('Failed to add money');
    } finally {
      setLoading(false);
    }
  };
console.log(wallet)
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-semibold mb-4">My Wallet</h2>
      
      <div className="bg-yellow-100 p-4 rounded-sm shadow-md mb-6">
        <h3 className="text-xl text-center mt-4 font-semibold">Current Balance</h3>
        <p className="text-3xl text-center my-4 font-bold text-green-500">₹{wallet?.balance}</p>
      </div>

      <div className="bg-white p-4 rounded-sm shadow-md mb-6">
        <h3 className="text-xl font-semibold mb-4">Add Money</h3>
        <div className="flex flex-col gap-4">
          <input
            type="number"
            placeholder="Enter amount"
            className="p-2 border rounded-sm"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <button
            className={`p-2 bg-yellow-500 text-white rounded-sm ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={handleAddMoney}
            disabled={loading}
          >
            {loading ? 'Adding...' : 'Add Money'}
          </button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-sm shadow-md">
        <h3 className="text-xl font-semibold mb-4">Transaction History</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white text-gray-600">
            <thead>
              <tr>
                <th className="py-2">Date</th>
                <th className="py-2">Type</th>
                <th className="py-2">Description</th>
                <th className="py-2">Order ID</th>
                <th className="py-2">Amount</th>
                <th className="py-2">Balance</th>
              </tr>
            </thead>
            <tbody>
              {wallet?.transactions?.map((transaction, index) => (
                <tr key={index} className="bg-gray-50">
                  <td className="py-2 px-4 border">{new Date(transaction.createdAt).toLocaleDateString()}</td>
                  <td className={`py-2 px-4 border ${transaction.type === 'Credit' ? 'text-green-500' : 'text-red-500'}`}>
                    {transaction.type}
                  </td>
                  <td className="py-2 px-4 border">{transaction.description}</td>
                  <td className="py-2 px-4 border">{transaction.orderId ? transaction.orderId.orderNumber : 'N/A'}</td>
                  <td className={`py-2 px-4 border ${transaction.type === 'Credit' ? 'text-green-500' : 'text-red-500'}`}>
                    {transaction.type === 'Credit' ? '+' : '-'}₹{transaction.amount.toFixed(2)}
                  </td>
                  <td className="py-2 px-4 border">{transaction.balanceAfter.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default WalletPage;
