import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Admin from "../models/adminModel.js";
import User from "../models/userModel.js";
import Wishlist from "../models/wishlistModel.js";
import Wallet from "../models/walletModel.js";
import Cart from "../models/cartModel.js";
import crypto from "crypto";
import Otp from "../models/otpModel.js";
import dotenv from "dotenv";
dotenv.config();
import { Resend } from "resend";
const resend = new Resend(process.env.RESEND_API_KEY);

//                    Admin

export const adminLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await Admin.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Admin not found" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const accessToken = jwt.sign(
      { Id: user.id, role: user.role },
      process.env.SECRET_KEY,
      { expiresIn: "1d" }
    );
    const refreshToken = jwt.sign(
      { Id: user.id, role: user.role },
      process.env.SECRET_KEY,
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      message: "Admin logged in successfully",
      accessToken,
      refreshToken,
      admin: user,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
    console.log(error);
  }
};

//                      User

const addMoneyToWallet = async (user, amount, description) => {
  try {
    let wallet = await Wallet.findOne({ user: user._id });

    if (!wallet) {
      wallet = new Wallet({
        user: user._id,
        balance: amount,
        transactions: [],
      });
      wallet.transactions.push({
        type: "Credit",
        amount: amount,
        description: description,
        balanceAfter: amount,
        orderId: null,
      });
      await wallet.save();
    } else {
      const newBalance = wallet.balance + amount;
      wallet.balance = newBalance;

      wallet.transactions.push({
        type: "Credit",
        amount: amount,
        description: description,
        balanceAfter: newBalance,
        orderId: null,
      });

      await wallet.save();
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

export const register = async (req, res) => {
  const { username, email, password, referralCode } = req.body;
  try {
    const emailExists = await User.findOne({ email });
    const usernameExists = await User.findOne({ username });
    if (emailExists || usernameExists) {
      return res.status(400).json({ message: "User already exists" });
    }
    const newReferralCode = `#$${username}-${Date.now()}`;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      referralCode: newReferralCode,
      referredBy: referralCode,
    });
    await newUser.save();
    const user = await User.findOne({ email });
    const accessToken = jwt.sign(
      { Id: user.id, role: "user" },
      process.env.SECRET_KEY,
      { expiresIn: "1d" }
    );
    const refreshToken = jwt.sign(
      { Id: user.id, role: "user" },
      process.env.SECRET_KEY,
      { expiresIn: "7d" }
    );

    let referrer = null;
    if (referralCode) {
      referrer = await User.findOne({ referralCode: referralCode });

      if (!referrer || referrer.isBlocked) {
        return res
          .status(400)
          .json({ message: "Invalid or blocked referral code" });
      }

      await addMoneyToWallet(user, 50, "Referral Bonus");
      await addMoneyToWallet(referrer, 100, "Referral Reward");
    }

    const wishlist = await Wishlist.findOne({ userId: user._id });
    const cart = await Cart.findOne({ user: user._id });
    return res.status(201).json({
      message: "User registered successfully",
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        profileImage: user.profileImage.path,
        referralCode: user.referralCode,
        wishlistCount: wishlist ? wishlist.products.length : 0,
        cartCount: cart
          ? cart.items.reduce((total, item) => total + item.quantity, 0)
          : 0,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.isBlocked) {
      return res.status(401).json({ message: "User is blocked" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const accessToken = jwt.sign(
      { Id: user.id, role: "user" },
      process.env.SECRET_KEY,
      { expiresIn: "1d" }
    );
    const refreshToken = jwt.sign(
      { Id: user.id, role: "user" },
      process.env.SECRET_KEY,
      { expiresIn: "7d" }
    );
    const wishlist = await Wishlist.findOne({ userId: user._id });
    const cart = await Cart.findOne({ user: user._id });
    return res.status(200).json({
      message: "User logged in successfully",
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        profileImage: user.profileImage.path,
        referralCode: user.referralCode,
        wishlistCount: wishlist ? wishlist.products.length : 0,
        cartCount: cart
          ? cart.items.reduce((total, item) => total + item.quantity, 0)
          : 0,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const sendOtp = async (req, res) => {
  const { email } = req.body;

  try {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await Otp.deleteMany({ email });

    await Otp.create({
      email,
      otp,
      expiresAt: new Date(Date.now() + 90 * 1000),
    });

    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: "Your OTP Code",
      html: `
        <div style="font-family: Arial, sans-serif;">
          <h2>🔐 Your Verification Code</h2>
          <p>Your OTP is:</p>
          <h3 style="color: #ff9900;">${otp}</h3>
          <p>This code will expire in 90 seconds.</p>
        </div>
      `,
    });

    if (error) throw new Error(error.message);

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (error) {
    console.error("Error sending OTP:", error);
    return res.status(500).json({
      success: false,
      message: "Error sending OTP",
      error: error.message,
    });
  }
};

export const verifyOtp = async (req, res, next) => {
  const { email, otp } = req.body;

  try {
    const record = await Otp.findOne({ email });

    if (!record) {
      return res
        .status(400)
        .json({ success: false, message: "OTP not found or expired" });
    }

    if (record.expiresAt < new Date()) {
      await Otp.deleteMany({ email });
      return res.status(400).json({ success: false, message: "OTP expired" });
    }

    if (record.otp !== otp) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    await Otp.deleteMany({ email });
    next();
  } catch (err) {
    console.error("Error verifying OTP:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const loginUserWithGoogle = async (req, res) => {
  console.log(req.body.userInfo);
  const { uid, displayName, email, photoURL } = req.body.userInfo;
  try {
    let user = await User.findOne({ $or: [{ googleId: uid }, { email }] });
    if (!user) {
      console.log("hi");
      user = new User({
        googleId: uid,
        username: displayName,
        email,
        profileImage: {
          filename: photoURL,
          path: photoURL,
        },
      });
    } else if (!user.googleId) {
      user.googleId = uid;
    }
    if (user.isBlocked) {
      return res.status(401).json({ message: "User is blocked" });
    }
    await user.save();
    const wishlist = await Wishlist.findOne({ userId: user._id });
    const cart = await Cart.findOne({ user: user._id });
    const accessToken = jwt.sign(
      { Id: user.id, role: "user" },
      process.env.SECRET_KEY,
      { expiresIn: "1d" }
    );
    const refreshToken = jwt.sign(
      { Id: user.id, role: "user" },
      process.env.SECRET_KEY,
      { expiresIn: "7d" }
    );
    return res.status(200).json({
      message: "User logged in successfully",
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        profileImage: user.profileImage.path,
        wishlistCount: wishlist ? wishlist.products.length : 0,
        cartCount: cart
          ? cart.items.reduce((total, item) => total + item.quantity, 0)
          : 0,
      },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error with logging in, try again" });
  }
};

export const sendResetPasswordEmail = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: "Reset Your Password",
      html: `
        <div style="font-family: Arial, sans-serif;">
          <h2>🧭 Password Reset</h2>
          <p>Click the link below to reset your password:</p>
          <a href="${resetLink}" target="_blank"
             style="display:inline-block;background-color:#ff9900;color:white;
                    padding:10px 15px;border-radius:5px;text-decoration:none;">
             Reset Password
          </a>
          <p>This link will expire in 1 hour.</p>
        </div>
      `,
    });

    if (error) throw new Error(error.message);

    return res
      .status(200)
      .json({ success: true, message: "Link sent successfully" });
  } catch (error) {
    console.error("Error sending reset password email:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const resetPassword = async (req, res) => {
  console.log(req.body);
  try {
    const { resetToken, newPassword } = req.body;
    const user = await User.findOne({
      resetPasswordToken: resetToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token." });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ message: "Password reset successful." });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
