import React, { useEffect, useState, useRef } from "react";
import { getCouponsForUser } from "../../../api/coupon";
import toast from "react-hot-toast";

const AvailableCoupons = ({ selectedCoupon, setSelectedCoupon,purchaseAmount }) => {
  const [coupons, setCoupons] = useState([]);
  const couponListRef = useRef(null);

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const response = await getCouponsForUser(purchaseAmount);
        let fetchedCoupons = response.data.coupons;

        if (fetchedCoupons.length > 1) {
          fetchedCoupons = fetchedCoupons
            .sort((a, b) =>
              a.discountType === b.discountType
                ? b.discountValue - a.discountValue
                : a.discountType === "percentage"
                ? b.discountValue - purchaseAmount * (a.discountValue / 100)
                : purchaseAmount * (b.discountValue / 100) - a.discountValue
            )
            .slice(0, 2);
        }

        setCoupons(fetchedCoupons);
      } catch (error) {
        console.error("Error fetching coupons: " + error);
      }
    };

    fetchCoupons();
  }, [purchaseAmount]);

  if(coupons.length === 0) {
    return (
      <div className="text-center text-yellow-600 my-6">No coupons available for this purchase amount</div>
    )
  }

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code)
      .then(() => {
        toast.success("Coupon code copied to clipboard");
        setSelectedCoupon(null);
      })
      .catch((err) => {
        console.error("Failed to copy code: "+ err);
      });
  };

  return (
    <>
      <h3 className="text-lg font-semibold text-slate-600 my-2 md:flex md:items-center md:justify-start">
        AVAILABLE COUPON
        <span className="ml-2 border-t border-gray-400 border-dashed md:inline-block flex flex-grow"></span>
      </h3>
      <div className="coupon-section p-4 mt-4">
        <ul className="flex gap-2">
          {coupons?.map((coupon) => (
            <li 
            key={coupon._id}
            ref={couponListRef}
            onClick={() => setSelectedCoupon(!selectedCoupon || selectedCoupon !== coupon._id ? coupon._id : null)}
            className="flex p-2 items-center mb-2 cursor-pointer hover:bg-gray-100 rounded-md"
            >
              <div className="bg-orange-200 flex flex-col items-center gap-1 rounded-sm p-2 ">
                <div className="font-semibold text-center p-2 w-full rounded-sm bg-yellow-400">{coupon.code}</div>
               <div
                className={`p-2 font-medium text-slate-600 transition-translate ${selectedCoupon !== coupon._id ? "hidden" : "block"} duration-300 ease-in-out`}
              >
                { coupon.isDisabled ? <p className="text-sm text-red-500">you've already used this coupon allowed times</p> : <p>
                  {coupon.discountType === "percentage"
                    ? (
                      <>
                      <span className="text-green-600">
                        {coupon.discountValue}%{" "}
                      </span>
                      off on orders above ₹{coupon.minimumPurchase}
                      </>
                    )
                    : (
                      <>
                      <span className="text-green-600">
                        ₹{coupon.discountValue}{" "}
                      </span>
                      off on orders above ₹{coupon.minimumPurchase}
                      </>
                    )}
                </p>}
                { !coupon.isDisabled &&<p>Valid till: {coupon.validTill.toString().slice(0, 10)}</p>}
                <p className="text-sm">you can use this coupon only {coupon.usageLimit} times</p>
              </div>
                <div
                  className=" py-1 p-3 w-full text-center bg-slate-800 hover:bg-gray-600 text-white"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCopyCode(coupon.code)
                  }}
                >
                  Copy Code
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default AvailableCoupons;
