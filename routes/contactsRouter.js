import express from "express";
import {
  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  updateContact,
  updateStatusContact,
} from "../controllers/contactsControllers.js";
import validateBody from "../helpers/validateBody.js";
import {createContactSchema, updateContactSchema, updateFavoriteSchema } from "../models/contact.js";
import isValidId from "../helpers/isValidId.js";

const contactsRouter = express.Router();

contactsRouter.get("/", getAllContacts);

contactsRouter.get("/:id", getOneContact);

contactsRouter.delete("/:id", deleteContact);

contactsRouter.post("/", validateBody(createContactSchema),createContact);

contactsRouter.put("/:id", isValidId,validateBody(updateContactSchema), updateContact);

contactsRouter.patch("/:id/favorite", isValidId,validateBody(updateFavoriteSchema), updateStatusContact)

export default contactsRouter;