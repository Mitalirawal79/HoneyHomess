const express = require("express");
const BookingSnapshot = require("../models/BookingSnapshot");
const supabase = require("../lib/supabase");

const router = express.Router();

router.post("/confirm", async (req, res) => {
  try {
   const {
  userId,
  serviceId,
  serviceName,
  price,
  scheduledDate,
  scheduledTime,
  address,
  phone,
  notes
} = req.body;

    if (!userId || !serviceId || !price) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

   // 1️⃣ Mongo snapshot
const snapshot = await BookingSnapshot.create({
  userId,
  serviceId,
  price,
  status: "pending",
});

// 2️⃣ Supabase sync (NON-BLOCKING)
// after Mongo snapshot
const { error: supabaseError } = await supabase
  .from("service_orders")
  .insert({
    user_id: userId,
    service_id: serviceId,
    service_name: serviceName,      // IMPORTANT
    service_price: price,           // IMPORTANT
    scheduled_date: scheduledDate,  // IMPORTANT
    scheduled_time: scheduledTime,  // IMPORTANT
    address,
    phone,
    notes,
    status: "pending",
  });

if (supabaseError) {
  console.error("Supabase sync failed:", supabaseError);
  // non-blocking (as per your plan)
}

// 3️⃣ ALWAYS return success
return res.status(201).json({
  success: true,
  message: "Booking confirmed",
  snapshotId: snapshot._id,
});


    // 3️⃣ Success response
    res.json({
      success: true,
      message: "Booking confirmed and synced",
      snapshot,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;