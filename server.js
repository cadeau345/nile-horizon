import express from "express";
import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

app.post("/pay", async (req, res) => {

try {

const price = req.body.price;

if (!price || price <= 0) {

return res.status(400).json({
message: "Invalid price"
});

}


// STEP 1 AUTH TOKEN

const authResponse = await axios.post(
"https://accept.paymob.com/api/auth/tokens",
{
api_key: process.env.PAYMOB_API_KEY
}
);

const authToken = authResponse.data.token;


// STEP 2 CREATE ORDER

const orderResponse = await axios.post(
"https://accept.paymob.com/api/ecommerce/orders",
{
auth_token: authToken,
delivery_needed: false,
amount_cents: price * 100,
currency: "EGP",
items: []
}
);

const orderId = orderResponse.data.id;


// STEP 3 GENERATE PAYMENT KEY

const paymentKeyResponse = await axios.post(
"https://accept.paymob.com/api/acceptance/payment_keys",
{
auth_token: authToken,

amount_cents: price * 100,

expiration: 3600,

order_id: orderId,

currency: "EGP",

integration_id: 5604595,

lock_order_when_paid: false,

billing_data: {

first_name: "Test",
last_name: "User",

email: "test@example.com",

phone_number: "+201000000000",

apartment: "NA",
floor: "NA",
street: "NA",
building: "NA",
shipping_method: "NA",
postal_code: "NA",
city: "Cairo",
country: "EG",
state: "Cairo"

}

}
);


res.json({
payment_token: paymentKeyResponse.data.token
});

} catch (error) {

console.log("PAYMOB ERROR:");

console.log(error.response?.data || error.message);

res.status(500).json({
message: "Payment failed"
});

}

});

app.listen(5000, () => {

console.log("Server running on port 5000 🚀");

});