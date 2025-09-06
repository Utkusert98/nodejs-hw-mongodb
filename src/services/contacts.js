import ContactCollection from '../db/models/Contact.js';

export async function getAllContacts({ userId, skip = 0, limit = 10, sortBy = '_id', sortOrder = 'asc', filter = {} } = {}) {
  return ContactCollection.find({ ...filter, userId })
    .sort({ [sortBy]: sortOrder })
    .skip(skip)
    .limit(limit);
}

export async function countContacts({ userId, filter = {} } = {}) {
  return ContactCollection.countDocuments({ ...filter, userId });
}

export async function getContactById(contactId, userId) {
  return ContactCollection.findOne({ _id: contactId, userId });
}

export async function createContact(data) {
  return ContactCollection.create(data);
}

export async function updateContact(contactId, updateData, userId) {
  return ContactCollection.findOneAndUpdate({ _id: contactId, userId }, updateData, { new: true });
}

export async function deleteContact(contactId, userId) {
  return ContactCollection.findOneAndDelete({ _id: contactId, userId });
}

export default {
  getAllContacts,
  countContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
};
