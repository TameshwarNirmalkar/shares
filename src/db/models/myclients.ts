import mongoose, { Schema } from "mongoose";

const myclientsSchema: Schema = new Schema(
    {
        uuid: {
            type: String,
            require: true,
        },
        profile_image: {
            type: String,
            require: true,
        },
        full_name: {
            type: String,
            require: true,
        },
        phone: {
            type: Number,
            require: true,
        },
        email: {
            type: String,
            require: false,
        },
        principle_amount: {
            type: Number,
            require: false,
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
            require: false,
        },
        monthly_interest: {
            type: Number,
            require: false,
        },
        profit: {
            type: Number,
            require: false,
        },
        interest_date: {
            type: Date,
            require: false,
        },
        favourite: {
            type: Boolean,
            require: false,
        },
    },
    {
        timestamps: true,
        versionKey: false
    }
);

const MyClientsModel = mongoose.models.MyClients || mongoose.model("MyClients", myclientsSchema);

export default MyClientsModel;
