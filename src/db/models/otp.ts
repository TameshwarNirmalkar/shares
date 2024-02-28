const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    otp: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 60 * 5, // The document will be automatically deleted after 5 minutes of its creation time
    }
}, {
    timestamps: true,
    versionKey: false
}
);

const OtpModel = mongoose.models.Otp || mongoose.model("Otp", otpSchema);

export default OtpModel;