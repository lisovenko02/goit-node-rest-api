import { Schema, model } from "mongoose";
import Joi from "joi";

import handleMongooseError from "../helpers/handleMongooseError.js";

const emailRegexp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

const userSchema = new Schema ({
    password: {
      type: String,
      required: [true, 'Set password for user'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
    },
    subscription: {
      type: String,
      enum: ["starter", "pro", "business"],
      default: "starter"
    },
    token: String,
    avatarURL: {
      type: String,
      required: true,
    },  
  });

userSchema.post("save", handleMongooseError);

export const registerAndLoginSchema = Joi.object({
    email: Joi.string().pattern(emailRegexp).required(),
    password: Joi.string().min(6).required()
});

export const updateSubscriptionSchema = Joi.object({
    email: Joi.string().pattern(emailRegexp).required(),
    subscription: Joi.valid("starter", "pro", "business").required(),
})

export const User = model("user", userSchema);


