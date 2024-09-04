import User from "../models/user.js";
import Order from "../models/order.js";
import mongoose from "mongoose";


// getting all the User's data
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// updating user profile 

export const updateProfile = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { id, name, phone } = req.body;

    // Update the User model
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { name, phone },
      { new: true, runValidators: true, session }
    );

    if (!updatedUser) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ error: 'User not found' });
    }

    // Update related models (Example: Orders and Comments)
    await Order.updateMany(
      { "user.id" : id },
      { $set: { "user.name": name } },
      { session }
    );

    // await Comment.updateMany(
    //   { userId: id },
    //   { $set: { userName: name } }, 
    //   { session }
    // );

    await session.commitTransaction();
    session.endSession();

    res.status(200).json(updatedUser);
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
};

export const userLogout = async(req,res)=>{
  try {
    // Clear the cookie
    res.clearCookie('token', {
      httpOnly: true, // Secure the cookie
      sameSite: 'none',
      secure: true, // Only send the cookie over HTTPS
    });

    // Send a success response
    return res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Error during logout:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}