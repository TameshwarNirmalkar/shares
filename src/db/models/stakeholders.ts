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
    percentage: {
      type: Number,
      require: true,
    },
    interest_date: {
      type: Date,
      require: true,
    },
  },
  {
    timestamps: true,
  }
);

const StakeholdersModel = mongoose.models.Stakeholders || mongoose.model("Stakeholders", stakeholdersSchema);

export default StakeholdersModel;
