import { Contact } from "../models/contact.js";
import createError from "http-errors";

// GET /contacts
export const getAllContacts = async (req, res) => {
  const contacts = await Contact.find();
  res.status(200).json({
    status: 200,
    message: "Successfully found contacts!",
    data: contacts,
  });
};

// GET /contacts/:id
export const getContactById = async (req, res, next) => {
  const { id } = req.params;
  const contact = await Contact.findById(id);
  if (!contact) {
    return next(createError(404, "Contact not found"));
  }
  res.status(200).json({
    status: 200,
    message: `Successfully found contact with id ${id}!`,
    data: contact,
  });
};

// POST /contacts
export const createContact = async (req, res) => {
  const newContact = await Contact.create(req.body);
  res.status(201).json({
    status: 201,
    message: "Successfully created a contact!",
    data: newContact,
  });
};

// PUT /contacts/:id
export const updateContact = async (req, res, next) => {
  const { id } = req.params;
  const updatedContact = await Contact.findByIdAndUpdate(id, req.body, { new: true });

  if (!updatedContact) {
    throw createError(404, "Contact not found");
  }

  res.status(200).json({
    status: 200,
    message: "Successfully patched a contact!",
    data: updatedContact
  });
};


// DELETE /contacts/:id
export const deleteContact = async (req, res, next) => {
  const { id } = req.params;
  const deletedContact = await Contact.findByIdAndDelete(id);
  if (!deletedContact) {
    return next(createError(404, "Contact not found"));
  }
  res.status(204).send();
};
