  // 3️⃣ Open Razorpay popup
      const options = {
        key: "rzp_test_SASQiPOIdXdhH0",
        amount: priceNumber * 100, // ✅ Amount in paise (Razorpay requirement)
        currency: "INR",
        name: "HomeMend",
        description: selectedService?.service,
        order_id: orderData.order.id,

        handler: async function (response) {
          // 4️⃣ After payment success → confirm booking
          try {
            const bookingRes = await fetch(
              "https://your-backend.onrender.com/api/bookings/confirm",
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  userId: user.id,
                  serviceId: selectedService?.service,
                  price: priceNumber,
                  scheduledDate: data.date.toISOString(), // ✅ Convert Date to ISO string
                  preferredTime: data.time,
                  address: data.address,
                }),
              },
            );

            const bookingData = await bookingRes.json();

            if (bookingData.success) {
              toast.success("Booking Confirmed!");
              onOpenChange(false);
              handleBack();
            } else {
              toast.error("Booking failed after payment");
              console.error("Booking error:", bookingData);
            }
          } catch (error) {
            console.error("Booking confirmation error:", error);
            toast.error("Failed to confirm booking");
          }
        },

        prefill: {
          name: data.fullName,
          contact: data.phone,
        },

        theme: {
          color: "#7C3AED",
        },
      };

const options = {
      key: "rzp_test_SASQiPOIdXdhH0",
      order_id: orderData.order.id,
      amount: price * 100, // paise (correct)
      currency: "INR",
      name: "Honey Homes",
      description: selectedService.title,

      handler: async function (response) {
        // PHASE 3️⃣ — Verify payment (backend)
        const verifyRes = await fetch(
         "https://your-backend.onrender.com/api/bookings/confirm",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              amount: price, // rupees only
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,

              // booking data
              userId: user.id,
              serviceId: selectedService?.service,
              price: priceNumber,
              scheduledDate: data.date.toISOString(), // ✅ Convert Date to ISO string
              preferredTime: data.time,
              address: data.address,
            }),
          },
        );

        const verifyData = await verifyRes.json();

        if (!verifyRes.ok) {
          toast.error("Payment verification failed");
          return;
        }

        toast.success("Payment successful & booking confirmed!");
        onOpenChange(false);
        setSelectedService(null);
      },
      prefill: {
        name: formData.name || "Customer",
        email: user.email || "test@honeyhomes.com",
        contact: `+91${formData.phone}`, // ⭐ THIS FIXES PHONE AUTO-FILL
      },
      theme: {
        color: "#ffcd77",
      },
    };
