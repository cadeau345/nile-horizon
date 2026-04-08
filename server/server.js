import express from "express";
import cors from "cors";
import nodemailer from "nodemailer";

const app = express();

app.use(cors());
app.use(express.json());


// إعداد إرسال الإيميل

const transporter = nodemailer.createTransport({

service: "gmail",

auth: {

user: "cadeau200510@gmail.com",   // حط هنا إيميلك الحقيقي

pass: "vhxz jxjd vhsb ciqt"     // App Password اللي ظهرلك

}

});


// Endpoint إرسال Email بعد قبول الحجز

app.post("/send-email", async (req, res) => {

const { email, serviceName } = req.body;

try {

await transporter.sendMail({

from: "YOUR_GMAIL@gmail.com",

to: email,

subject: "Booking Confirmation - Nile Horizon",

text: `Your booking for ${serviceName} has been approved successfully. Thank you for choosing Nile Horizon.`

});

res.send("Email sent successfully");

} catch (error) {

console.log(error);

res.status(500).send("Error sending email");

}

});


// تشغيل السيرفر

app.listen(5000, () => {

console.log("Server running on port 5000");

});