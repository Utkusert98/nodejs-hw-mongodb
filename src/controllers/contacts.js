import createError from 'http-errors';
import contactsService from '../services/contacts.js';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';

// GET /contacts — sayfalama ile
async function getContacts(req, res, next) {
  try {
    const { page, perPage } = parsePaginationParams(req.query);
    const { sortBy, sortOrder } = parseSortParams(req.query);
    const filter = parseFilterParams(req.query);

    const userId = req.user?._id;
    const totalItems = await contactsService.countContacts({ userId, filter });
    const contacts = await contactsService.getAllContacts({
      userId,
      skip: (page - 1) * perPage,
      limit: perPage,
      sortBy,
      sortOrder,
      filter,
    });

    res.json({
      status: 'success',
      data: {
        contacts,
        page,
        perPage,
        totalItems,
        totalPages: Math.ceil(totalItems / perPage),
      },
    });
  } catch (error) {
    next(error);
  }
}

async function getContactById(req, res, next) {
  try {
    const { contactId } = req.params;
    const userId = req.user?._id;
    const contact = await contactsService.getContactById(contactId, userId);

    if (!contact) {
      throw createError(404, 'Contact not found');
    }

    res.json({ status: 'success', data: contact });
  } catch (error) {
    next(error);
  }
}

async function createContact(req, res, next) {
  try {
    const userId = req.user?._id;
    const contact = await contactsService.createContact({ ...req.body, userId });
    res.status(201).json({ status: 'success', data: contact });
  } catch (error) {
    next(error);
  }
}

async function updateContact(req, res, next) {
  try {
    const { contactId } = req.params;
    const userId = req.user?._id;
    const updated = await contactsService.updateContact(contactId, req.body, userId);

    if (!updated) {
      throw createError(404, 'Contact not found');
    }

    res.json({ status: 'success', data: updated });
  } catch (error) {
    next(error);
  }
}

async function deleteContact(req, res, next) {
  try {
    const { contactId } = req.params;
    const userId = req.user?._id;
    const deleted = await contactsService.deleteContact(contactId, userId);

    if (!deleted) {
      throw createError(404, 'Contact not found');
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
