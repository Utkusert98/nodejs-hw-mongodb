import ContactCollection from '../db/models/Contact.js';

async function getAllContacts() {
  return await ContactCollection.find({});
}

async function getContactById(contactId) {
  return await ContactCollection.findById(contactId);
}

export default {
  getAllContacts,
  getContactById,
};
