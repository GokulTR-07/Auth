import TeleCaller from "../models/telecaller.js";


export const telecallerOrders = async (req,res) => {
  const formData = req.body;
  try {
    const newEntry = new TeleCaller(formData);
    await newEntry.save();
    res.status(201).json({ message: 'Data saved successfully!' });
  } catch (error) {
    console.error('Error saving data:', error);
    res.status(500).json({ message: 'Error saving data' });
  }
}

