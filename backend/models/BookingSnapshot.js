const mongoose = require("mongoose");

const BookingSnapshotSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  serviceId: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const BookingSnapshot = mongoose.models.BookingSnapshot
  || mongoose.model("BookingSnapshot", BookingSnapshotSchema);

module.exports = BookingSnapshot;