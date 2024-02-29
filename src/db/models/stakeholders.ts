import mongoose, { Schema } from "mongoose";

const stakeholdersSchema: Schema = new Schema(
  {
    uuid: {
      type: String,
      require: true,
    },
    full_name: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      require: true,
    },
    phone: {
      type: Number,
      require: false,
    },
    principle_amount: {
      type: Number,
      require: true,
    },
    base_percentage: {
      type: Number,
      require: true,
    },
    base_interest: {
      type: Number,
      require: true,
    },
    percentage: {
      type: Number,
      require: true,
    },
    monthly_interest: {
      type: Number,
      require: true,
    },
    profit: {
      type: Number,
      require: true,
    },
    interest_date: {
      type: Date,
      require: true,
    },
    client_id: {
      type: String,
      require: true,
    },
  },
  {
    timestamps: true,
    versionKey: false
  }
);

const StakeholdersModel = mongoose.models.Stakeholders || mongoose.model("Stakeholders", stakeholdersSchema);

export default StakeholdersModel;
