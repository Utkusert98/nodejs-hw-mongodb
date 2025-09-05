import createError from 'http-errors';
import contactsService from '../services/contacts.js';

async function getContacts(req, res, next) {
  try {
    const contacts = await contactsService.getAllContacts();
    res.status(200).json({
      message: "Successfully found contacts!",
      data: contacts,
    });
  } catch (error) {
    next(error);
  }
}
async function getContactById(req, res, next) { 
    try {
        const { contactId } = req.params;

        const contact = await contactsService.getContactById(contactId);

        if(!contact){
          throw createError(404, "Contact not found");
        }
        res.status(200).json({
            status:200,
            message: 'Successfully found contact!',
            data: contact,
        })
    } catch (error) {
        next(error);
    }
}
async function createContact(req,res,next){
  try {
    const newContact = await contactsService.createContact(req.body);
    res.status(201).json({
      message: "Successfully created a contact!",
		  data: newContact
    })
  } catch (error) {
    next(error);
  }
}

async function updateContact (req, res, next) {
   try {
    const { contactId } = req.params;
   const contact = await contactsService.updateContact(contactId, req.body);

    if(!contact){
      throw createError(404, "Contact not found")
    }
    res.status(200).json({
      message: "Successfully patched a contact!",
	    data:contact
    })
  } catch (error) {
    next(error)
  }
}
async function deleteContact(req, res, next) {
  
  try {
    const { contactId } = req.params;
    const deletedContact = await contactsService.deleteContact(contactId);

    if (!deletedContact) {
      throw createError(404, "Contact not found");
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
}
export default {
  getContacts,
  getContactById,
  createContact, 
  updateContact,
  deleteContact
};