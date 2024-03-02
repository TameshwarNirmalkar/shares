import mongoose, { Schema } from "mongoose";

const reInvestmentsSchema: Schema = new Schema(
    {
        uuid: {
            type: String,
            require: true,
        },
        investment_date: {
            type: Date,
            require: true,
        },
        interest_date: {
            type: Date,
            require: false,
        },
        initial_amount: {
            type: Number,
            require: false,
        },
        monthly_amount: {
            type: Number,
            require: true,
        },
        base_percentage: {
            type: Number,
            require: false,
        },
        base_interest: {
            type: Number,
            require: false,
        },
        monthly_percentage: {
            type: Number,
            require: true,
        },
        monthly_interest: {
            type: Number,
            require: true,
        },
        profit: {
            type: Number,
            require: false,
        },
        total_amount: {
            type: Number,
            require: true,
        },
    },
    {
        timestamps: true,
        versionKey: false
    }
);

const ReInvestmentsModel = mongoose.models.ReInvestments || mongoose.model("ReInvestments", reInvestmentsSchema);

export default ReInvestmentsModel;
