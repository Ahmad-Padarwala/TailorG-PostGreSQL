const axios = require("axios");

const smsAPI = {
    sendOTP: async (contactNumber, otp) => {
        const url = `Your Sms Api Key`;
        try {
            const response = await axios.post(url);
            return response.data;
        } catch (error) {
            console.error("Error sending OTP:", error);
            throw new Error("Failed to send OTP");
        }
    }
};

module.exports = smsAPI;