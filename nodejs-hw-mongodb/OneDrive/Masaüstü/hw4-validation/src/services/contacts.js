import ContactCollection from '../db/models/Contact.js';

async function getAllContacts({
  skip = 0,
  limit = 10,
  sortBy = '_id',
  sortOrder = 'asc',
  filter = {}
} = {}) {
  const order = sortOrder === 'desc' ? -1 : 1;

  return ContactCollection.find(filter)
    .sort({ [sortBy]: order })
    .skip(skip)
    .limit(limit);
}

async function countContacts(filter = {}) {
  return ContactCollection.countDocuments(filter);
}

async function getContactById(contactId) {
  return ContactCollection.findById(contactId);
}

async function createContact(contactData) {
  return ContactCollection.create(contactData);
}

async function updateContact(contactId, updateData) {
  return ContactCollection.findByIdAndUpdate(contactId, updateData, {
    new: true,
    runValidators: true
  });
}

async function deleteContact(contactId) {
  return ContactCollection.findByIdAndDelete(contactId);
}

export default {
  getAllContacts,
  countContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact
};
