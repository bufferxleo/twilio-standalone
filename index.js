const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const axios = require("axios");
const twilio = require("twilio");

dotenv.config(); // Load environment variables from .env file

const app = express();
const PORT = process.env.PORT || 3001;

app.use(bodyParser.json());
app.use(cors());

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const messagingServiceSid = process.env.TWILIO_MESSAGING_SERVICE_SID;

const client = twilio(accountSid, authToken);
// async function createVerification() {
//   const verification = await client.verify.v2
//     .services(`${messagingServiceSid}`)
//     .verifications.create({
//       channel: "sms",
//       to: "+919603028848",
//     });

//   console.log(verification.sid);
// }

// createVerification();

// async function createVerificationCheck() {
//   const verificationCheck = await client.verify.v2
//     .services(`${messagingServiceSid}`)
//     .verificationChecks.create({
//       code: "1234",
//       to: "+919603028848",
//     });

//   console.log(verificationCheck.status);
// }

// createVerificationCheck();

// Endpoint to trigger the verification
app.post("/send-verification", async (req, res) => {
  const { to } = req.body;

  try {
    const response = await axios.post(
      `https://verify.twilio.com/v2/Services/${messagingServiceSid}/Verifications`,
      new URLSearchParams({
        To: to,
        Channel: "sms",
      }),
      {
        auth: {
          username: accountSid,
          password: authToken,
        },
      }
    );

    res.status(200).json({ sid: response.data.sid });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// Endpoint to verify the code
app.post("/verify-verification", async (req, res) => {
  const { code, to } = req.body;

  try {
    const response = await axios.post(
      `https://verify.twilio.com/v2/Services/${messagingServiceSid}/VerificationCheck`,
      new URLSearchParams({
        To: to,
        Code: code,
      }),
      {
        auth: {
          username: accountSid,
          password: authToken,
        },
      }
    );

    res.status(200).json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
