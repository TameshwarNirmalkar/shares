import mongoose, { Schema } from "mongoose";

// const investmentSchema = new Schema({
//   uuid: { require: true, type: String },
//   investment_name: { type: String, require: true },
//   investment_date: { type: Date, require: true },
//   amount: { type: Number, require: true },
//   percentage: { type: Number, require: true },
//   interest_date: { type: Date, require: true },
//   calculated_amount: { type: Number, require: true },
// });

// uuid: { require: true, type: String },
// investments: [investmentSchema],

const interestSchema: Schema = new Schema(
  {
    uuid: { require: true, type: String },
    investment_name: { type: String, require: true },
    investment_date: { type: Date, require: true },
    amount: { type: Number, require: true },
    percentage: { type: Number, require: true },
    interest_date: { type: Date, require: true },
    calculated_amount: { type: Number, require: true },
  },
  {
    timestamps: true,
    versionKey: false
  }
);

const InterestModel = mongoose.models.Interests || mongoose.model("Interests", interestSchema);

export default InterestModel;
