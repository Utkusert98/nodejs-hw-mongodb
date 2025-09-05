import express from "express";
import {
  getAllContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
} from "../controllers/contactsController.js";
import { ctrlWrapper } from "../middlewares/ctrlWrapper.js";
import { validateBody } from "../middlewares/validateBody.js";
import { updateContactSchema } from "../schemas/contactSchema.js";

const router = express.Router();

router.get("/", ctrlWrapper(getAllContacts));
router.get("/:id", ctrlWrapper(getContactById));
router.post("/", ctrlWrapper(createContact));
router.patch("/:id", validateBody(updateContactSchema), ctrlWrapper(updateContact));
router.delete("/:id", ctrlWrapper(deleteContact));

export default router;
