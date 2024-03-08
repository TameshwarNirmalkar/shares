import mongoose, { Schema } from "mongoose";

const transactionHisotyrSchema: Schema = new Schema(
    {
        uuid: { require: true, type: String },
        investment_name: { type: String, require: true },
        full_name: { require: true, type: String },
        investment_date: { type: Date, require: true },
        amount: { type: Number, require: true },
        percentage: { type: Number, require: true },
        interest_date: { type: Date, require: true },
        is_paid: { type: Boolean, require: true },

    },
    {
        timestamps: true,
        versionKey: false
    }
);

const TransactionHistoryModel = mongoose.models.TransactionHistory || mongoose.model("TransactionHistory", transactionHisotyrSchema);

export default TransactionHistoryModel;
