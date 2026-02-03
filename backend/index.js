require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

app.use(cors());
app.use(express.json());


// 🔗 Mongo connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("Mongo error:", err));

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Backend is running" });
});

const PORT = process.env.PORT || 4000;
const bookingRoutes = require("./routes/bookings");
app.use("/api/bookings", bookingRoutes);

const paymentRoutes = require("./routes/payment");
app.use("/api/payments", paymentRoutes);



app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`); 
});