import ContactCollection from '../db/models/Contact.js';

async function getAllContacts() {
  return await ContactCollection.find({});
}

async function getContactById(contactId) {
  return await ContactCollection.findById(contactId);
}
async function createContact(contactData) {
  return await ContactCollection.create(contactData);
}
async function updateContact(contactId, updateData) {
  return await ContactCollection.findByIdAndUpdate(contactId, updateData, { new: true });
}
async function deleteContact(contactId) {
  return await ContactCollection.findByIdAndDelete(contactId)
}
export default {
  getAllContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
};
