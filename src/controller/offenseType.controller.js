import OffenseType from "../model/offenseTypeModel.js";

export const createOffenseType = async (req, res) => {
  try {
    const offense = await OffenseType.create({
      ...req.body,
      createdBy: req.user?._id,
    });
    res.status(201).json({ success: true, data: offense });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const listOffenseTypes = async (_req, res) => {
  const offenses = await OffenseType.find().sort({ createdAt: -1 });
  res.json({ success: true, data: offenses });
};

export const updateOffenseType = async (req, res) => {
  try {
    const updated = await OffenseType.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ message: "Not found" });
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteOffenseType = async (req, res) => {
  const deleted = await OffenseType.findByIdAndDelete(req.params.id);
  if (!deleted) return res.status(404).json({ message: "Not found" });
  res.json({ success: true, message: "Offense type deleted" });
};

