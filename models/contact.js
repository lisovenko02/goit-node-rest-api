import {model, Schema} from "mongoose";
import Joi from "joi";
import handleMongooseError from "../helpers/handleMongooseError.js"

const contactSchema = new Schema (
    {
        name: {
          type: String,
          required: [true, 'Set name for contact'],
        },
        email: {
          type: String,
        },
        phone: {
          type: String,
        },
        favorite: {
          type: Boolean,
          default: false,
        },
        owner: {
          type: Schema.Types.ObjectId,
          ref: 'user',
        }
      }
);

contactSchema.post("save", handleMongooseError);

export const createContactSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.required(),
    phone: Joi.number().required(),
    favorite:Joi.boolean(),
})

export const updateContactSchema = Joi.object({
    name:Joi.string(),
    email:Joi.string().email(),
    phone:Joi.string(),
})

export const updateFavoriteSchema = Joi.object({
    favorite: Joi.boolean().required(),
  });

const Contact = model("contact", contactSchema);

export default Contact;