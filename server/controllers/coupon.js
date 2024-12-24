import Coupon from "../models/couponModel.js"; 
import { UserUsage } from "../models/couponModel.js";


export const addCoupon = async (req, res) => {
  try {
    const {
      code,
      discountType,
      discountValue,
      minimumPurchase,
      maximumDiscount,
      validFrom,
      validTill,
      usageLimit,
      isActive,
    } = req.body;
    console.log(req.body);

    let errors = {};
    if(!code) errors.code = "Coupon code is required";
    if(!discountType) errors.discountType = "Discount type is required";
    if(!discountValue) errors.discountValue = "Discount value is required";
    if(!validFrom) errors.validFrom = "Valid from date is required";
    if(!validTill) errors.validTill = "Valid till date is required";
    if (minimumPurchase < 0) {
      errors.minimumPurchase = "Minimum purchase must be a non-negative value";
    }
    if(discountType === 'percentage' && (discountValue < 0 || discountValue > 60)) {
      errors.discountValue = "Discount value must be between 0 and 60 for percentage discount";
    }
    if (discountType === 'fixed' && discountValue < 0) {
      errors.discountValue = "Discount value must be a non-negative value for fixed discount";
    }
    if(discountType === 'fixed' && discountValue > minimumPurchase) {
      errors.discountValue = "Discount value cannot be greater than minimum purchase for fixed discount";
    }
    if (maximumDiscount < 0) {
      errors.maximumDiscount = "Maximum discount must be a non-negative value";
    }
    if (usageLimit < 0) {
      errors.usageLimit = "Usage limit must be a non-negative value";
    }
    if (validFrom >= validTill) {
      errors.validTill = "Valid till date must be after valid from date";
    }
    if (Object.keys(errors).length > 0) {
      return res.status(400).json(errors);
    }

    const existingCoupon = await Coupon.findOne({ code, isActive: true });
    if (existingCoupon) {
      return res.status(400).json({ message: "Coupon code already exists" });
    }

    const newCoupon = new Coupon({
      code,
      discountType,
      discountValue,
      minimumPurchase,
      maximumDiscount,
      validFrom: new Date(validFrom),
      validTill: new Date(validTill),
      usageLimit,
      isActive,
    });

    await newCoupon.save();

    return res.status(201).json({ message: "Coupon added successfully", coupon: newCoupon });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to add coupon", error: error.message });
  }
};


export const getCoupons = async (req, res) => {

  const { currentPage, limitPerPage, filter, sort, search } = req.query;
  try {
    const now = new Date();
    await Coupon.updateMany({ validTill: { $lt: now }, isActive: true }, { isActive: false });

    const filters = {};
    if (filter && filter === 'active') {
      filters.isActive = true;
      filters.validFrom = { $lte: now };
    } else if (filter && filter === 'inactive') {
      filters.isActive = false;
    } else if (filter && filter === 'expired') {
      filters.validTill = { $lt: now };
    } else if (filter && filter === 'upcoming') {
      filters.validFrom = { $gt: now };
    } else if (filter && filter === 'percentage') {
      filters.discountType = 'percentage';
    } else if (filter && filter === 'fixed') {
      filters.discountType = 'fixed';
    }

    if (search) {
      filters.code = { $regex: search, $options: 'i' };
    }

    const sortQuery = {};
    if (sort && sort === 'ascending') {
      sortQuery.createdAt = 1;
    } else if (sort && sort === 'descending') {
      sortQuery.createdAt = -1;
    }

    const skip = (parseInt(currentPage) - 1) * parseInt(limitPerPage);
    const coupons = await Coupon.find(filters).sort(sortQuery).skip(skip).limit(parseInt(limitPerPage));
    const totalCoupons = await Coupon.countDocuments(filters);
    const totalPages = Math.ceil(totalCoupons / parseInt(limitPerPage));
    
    return res.status(200).json({ totalPages, coupons });
    } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to get coupons", error: error.message });
    }
  }


export const updateCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    const { code, discountType, discountValue, minimumPurchase, maximumDiscount, validFrom, validTill, usageLimit, isActive } = req.body;

    let errors = {};
    if(!code) errors.code = "Coupon code is required";
    if(!discountType) errors.discountType = "Discount type is required";
    if(!discountValue) errors.discountValue = "Discount value is required";
    if(!validFrom) errors.validFrom = "Valid from date is required";
    if(!validTill) errors.validTill = "Valid till date is required";
    if (minimumPurchase < 0) {
      errors.minimumPurchase = "Minimum purchase must be a non-negative value";
    }
    if(discountType === 'percentage' && (discountValue < 0 || discountValue > 60)) {
      errors.discountValue = "Discount value must be between 0 and 60 for percentage discount";
    }
    if (discountType === 'fixed' && discountValue < 0) {
      errors.discountValue = "Discount value must be a non-negative value for fixed discount";
    }
    if(discountType === 'fixed' && discountValue > minimumPurchase) {
      errors.discountValue = "Discount value cannot be greater than minimum purchase for fixed discount";
    }
    if (maximumDiscount < 0) {
      errors.maximumDiscount = "Maximum discount must be a non-negative value";
    }
    if (usageLimit < 0) {
      errors.usageLimit = "Usage limit must be a non-negative value";
    }
    if (validFrom >= validTill) {
      errors.validTill = "Valid till date must be after valid from date";
    }
    if (Object.keys(errors).length > 0) {
      return res.status(400).json(errors);
    }

    const updatedCoupon = await Coupon.findByIdAndUpdate(id, {
      code,
      discountType,
      discountValue,
      minimumPurchase,
      maximumDiscount,
      validFrom: new Date(validFrom),
      validTill: new Date(validTill),
      usageLimit,
      isActive,
    }, { new: true });
    res.status(200).json({ message: "Coupon updated successfully", coupon: updatedCoupon });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update coupon", error: error.message });
  }
}

export const deleteOrRestoreCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    const coupon = await Coupon.findById(id);
    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }
    const updatedCoupon = await Coupon.findByIdAndUpdate(id, { isDeleted: !coupon.isDeleted }, { new: true });
    if (updatedCoupon.isDeleted) {
      updatedCoupon.isActive = false;
    } else {
      if (updatedCoupon.validTill < new Date()) {
        updatedCoupon.isActive = false;
      } else {
        updatedCoupon.isActive = true;
      }
    }
    await updatedCoupon.save();
    res.status(200).json({ message: `Coupon ${updatedCoupon.isActive ? 'restored' : 'deleted'} successfully`, coupon: updatedCoupon });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update coupon", error: error.message });
  }
}



//                           User
export const getCouponsForUser = async (req, res) => {
  try {
    const now = new Date();

    await Coupon.updateMany(
      { validTill: { $lt: now }, isActive: true },
      { isActive: false }
    );

    const activeCoupons = await Coupon.find({
      isActive: true,
      validFrom: { $lte: now },
      validTill: { $gte: now },
    });

    const userUsage = await UserUsage.findOne({ userId: req.user.Id });

    let couponsForUser = activeCoupons.map(coupon => {
      let usageCount = 0;
      let isDisabled = false;

      if (userUsage) {
        const userCoupon = userUsage.coupons.find(
          c => c.couponId.toString() === coupon._id.toString()
        );
        if (userCoupon) {
          usageCount = userCoupon.usageCount;
          isDisabled = usageCount >= coupon.usageLimit;
        }
      }

      return {
        ...coupon.toObject(),
        usageCount,
        isDisabled,
      };
    });

    res.status(200).json({ coupons: couponsForUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to get coupons", error: error.message });
  }
};


export const applyCoupon = async (req, res) => {
  try {
    const userId = req.user.Id;
    const { couponCode: code, orderValue } = req.body;
    const coupon = await Coupon.findOne({ code, isActive: true, isDeleted: false});

    if (!coupon) {
      return res.status(404).json({ message: "Invalid or inactive coupon code" });
    }
    if (coupon.minimumPurchase > orderValue) {
      return res.status(400).json({ message: "Minimum purchase value not met" });
    }
    const userCoupon = await UserUsage.findOne({ userId });
    if (!userCoupon) {
      const newUserCoupon = new UserUsage({
        userId,
        coupons: [{ couponId: coupon._id, usageCount: 1 }],
      });
      await newUserCoupon.save();
    } else {
      const existingCoupon = userCoupon.coupons.find(c => c.couponId.toString() === coupon._id.toString());
      if (existingCoupon) {
        if (existingCoupon.usageCount >= coupon.usageLimit) {
          return res.status(400).json({ message: "Coupon usage limit exceeded" });
        }
        existingCoupon.usageCount += 1;
      } else {
        userCoupon.coupons.push({ couponId: coupon._id, usageCount: 1 });
      }
    }
    if(userCoupon) await userCoupon.save();
    coupon.usageCount += 1;
    await coupon.save();
    res.status(200).json(coupon);
  }
  catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to apply coupon", error: error.message });
  }
}

export const removeAppliedCoupon = async (req, res) => {
  try {
    const userId = req.user.Id;
    const { id } = req.params;
    const userCoupon = await UserUsage.findOne({ userId, coupons: { $elemMatch: { couponId: id } } });
    if (!userCoupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }
    const existingCoupon = userCoupon.coupons.find(c => c.couponId.toString() === id);
    if (existingCoupon.usageCount > 1) {
      existingCoupon.usageCount -= 1;
    } else {
      userCoupon.coupons = userCoupon.coupons.filter(c => c.couponId.toString() !== id);
      console.log(userCoupon);
    }
    userCoupon.markModified('coupons');
    await userCoupon.save();
    const coupon = await Coupon.findOne({ _id : existingCoupon.couponId });
    coupon.usageCount -= 1;
    await coupon.save();
    res.status(200).json({ message: "Coupon removed successfully", coupon });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to remove coupon", error: error.message });
  }
}

    
