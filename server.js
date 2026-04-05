const express = require("express");
const cors = require("cors");
const twilio = require("twilio");

const app = express();

app.use(cors());
app.use(express.json());

const client = twilio("ACCOUNT_SID", "AUTH_TOKEN");

app.post("/send-sms", async (req, res) => {

  const { phone, serviceName } = req.body;

  try {

    await client.messages.create({
      body: `Your booking for ${serviceName} is confirmed ✅`,
      from: "+1234567890",
      to: phone
    });

    res.send("SMS sent");

  } catch (error) {

    console.log(error);
    res.status(500).send("SMS failed");

  }

});

app.listen(5000, () => {
  console.log("SMS server running on port 5000");
});