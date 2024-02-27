import mongoose, { Schema } from "mongoose";

const masterInvestmentSchema: Schema = new Schema(
    {
        uuid: { type: String, require: true, },
        full_name: { type: String, require: true },
        amount: { type: Number, require: true },
        investment_date: { type: Date, require: true },
        interest_date: { type: Date, require: true },
        monthly_interest: { type: Number, require: true },
        daily_interest: { type: Number, require: false },
        no_of_days: { type: Number, require: false },
        base_percentage: { type: Number, require: false },
        monthly_percentage: { type: Number, require: false },
    },
    {
        timestamps: true,
        versionKey: false
    }
);

const MasterInvestmentModel = mongoose.models.MasterInvestment || mongoose.model("MasterInvestment", masterInvestmentSchema);

export default MasterInvestmentModel;
