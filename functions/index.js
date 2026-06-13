const functions = require("firebase-functions");
const admin = require("firebase-admin");
const axios = require("axios");

admin.initializeApp();

exports.syncHotels = functions.https.onRequest(async (req, res) => {
  try {
    const response = await axios.get(
      "https://booking-com15.p.rapidapi.com/api/v1/hotels/searchHotels",
      {
        params: {
          dest_id: "-2092174",
          search_type: "CITY",
          arrival_date: "2026-06-15",
          departure_date: "2026-06-18",
          adults: "2",
          room_qty: "1",
          page_number: "1",
          currency_code: "EGP",
          languagecode: "en-us",
        },
        headers: {
          "x-rapidapi-key": "fb51683203mshf0c81a04e5359adp14a1c8jsn67caa812920d",
          "x-rapidapi-host": "booking-com15.p.rapidapi.com",
        },
      }
    );

    const hotels = response.data.data.hotels;

    const batch = admin.firestore().batch();

    hotels.forEach((hotel) => {
      const ref = admin.firestore().collection("hotels").doc();

      batch.set(ref, {
        name: hotel.property?.name || "",
        price:
          hotel.property?.priceBreakdown?.grossPrice?.value || 0,
        image: hotel.property?.photoUrls?.[0] || "",
        rating: hotel.property?.reviewScore || 0,
        location: "Aswan",
        hotelId: hotel.hotel_id,
        createdAt:
          admin.firestore.FieldValue.serverTimestamp(),
      });
    });

    await batch.commit();

    res.json({
      success: true,
      hotelsCount: hotels.length,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      error: error.message,
    });
  }
});