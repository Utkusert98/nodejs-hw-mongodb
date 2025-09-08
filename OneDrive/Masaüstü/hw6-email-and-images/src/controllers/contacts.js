import Contact from '../db/models/contacts.js';
import {
  getAllContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
} from '../services/contacts.js';
import { ROLES, CLOUDINARY } from '../constant/index.js';
import * as contactServices from '../services/contacts.js';
import { uploadToCloudinary } from '../services/cloudinary.js';
import { env } from '../utils/env.js';
import saveFileToCloudinary from '../utils/saveFileToCloudinary.js';
import saveFileToUploadDir from '../utils/saveFileToUploadDir.js';

// import createHttpError from 'http-errors';

// export const getContactsController = async (req, res, next) => {
//   try {
//     const {
//       page = 1,
//       perPage = 10,
//       sortBy = 'name',
//       sortOrder = 'asc',
//       type,
//       isFavorite,
//     } = req.query;

//     const data = await getAllContacts({
//       page: parseInt(page),
//       perPage: parseInt(perPage),
//       sortBy,
//       sortOrder,
//       type,
//       isFavorite,
//     });
//     res.status(200).json({
//       status: 200,
//       message: 'Successfully found contacts',
//       data,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// export const getContactByIdController = async (req, res, next) => {
//   const { contactId } = req.params;

//   try {
//     const contact = await getContactById(contactId);
//     if (!contact) {
//       next(createHttpError(404, 'Contact not found'));
//     }
//     res.status(200).json({
//       status: 200,
//       message: `Successfully found contact with id ${contactId}!`,
//       data: contact,
//     });
//   } catch (error) {
//     console.error('Error fetching contact by ID:', error);
//     res.status(500).json({ message: 'Internal Server Error' });
//     next(error);
//   }
// };

// export const createContactController = async (req, res, next) => {
//   const contactData = req.body;
//   console.log('Creating contact with data:', contactData);

//   try {
//     const result = await createContact(contactData);
//     const { name, email, phone, favorite } = req.body;

//     const newContact = await Contact.create({
//       name,
//       email,
//       phone,
//       favorite,
//       userId: req.user._id, // buraya dikkat
//     });

//     res.status(201).json(newContact);
//     if (!result) {
//       return next(createHttpError(400, 'Failed to create contact'));
//     }
//     res.status(201).json({
//       status: 201,
//       message: 'Contact created successfully',
//       data: result,
//     });
//   } catch (error) {
//     console.error('Error creating contact:', error.message);
//     next(createHttpError(400, 'Contact creation failed'));
//   }
//   console.log('REQ BODY:', req.body);
// };
// export const updateContactController = async (req, res, next) => {
//   const { contactId } = req.params;

//   try {
//     const pContact = await updateContact(contactId, req.body);
//     if (!pContact) {
//       next(createHttpError(404, 'Contact not found'));
//     }
//     res.status(200).json({
//       status: 200,
//       message: `Successfully updated contact with id ${contactId}!`,
//       data: pContact,
//     });
//   } catch (error) {
//     console.error('Error updating contact:', error);
//     res.status(500).json({ message: 'Internal Server Error' });
//     next(error);
//   }
// };
// export const deleteContactController = async (req, res, next) => {
//   const { contactId } = req.params;
//   await deleteContact(contactId);
//   try {
//     return res.status(204).json({
//       status: 204,
//       message: `Successfully deleted contact with id ${contactId}!`,
//     });
//   } catch (error) {
//     console.error('Error deleting contact:', error);
//     res.status(500).json({ message: 'Internal Server Error' });
//     next(error);
//   }
// };
export const getContactsController = async (req, res, next) => {
  try {
    if (req.user.role !== ROLES.ADMIN) {
      return res.status(403).json({
        success: false,
        message: 'bu işlemi yapmamya yetkiniz yoktur.',
      });
    }
    const userId = req.user._id;
    const contacts = await getAllContacts(userId);

    res.status(200).json({
      status: 200,
      message: 'Successfully found contacts!',
      data: contacts,
    });
  } catch (error) {
    next(error);
  }
};

export const getContactByIdController = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const userId = req.user._id;
    const contact = await getContactById(contactId, userId);

    if (!contact) {
      return res.status(404).json({
        message: 'Contact not found',
      });
    }

    res.status(200).json({
      status: 200,
      message: `Successfully found contact with id ${contactId}!`,
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};

export const createContactController = async (req, res, next) => {
  try {
    let photoUrl = null;
    if (req.file) {
      photoUrl = await uploadToCloudinary(req.file.buffer);
    }
    const newContact = await Contact.create({
      ...req.body,
      userId: req.user._id,
      photo: photoUrl,
    });
    res.status(201).json({
      status: 201,
      message: 'Successfully created a contact!',
      data: newContact,
    });

    const userId = req.user._id;
    const contact = await createContact(req.body, userId);

    res.status(201).json({
      status: 201,
      message: 'Successfully created a contact!',
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};

export const updateContactController = async (req, res, next) => {
  try {
    let photoUrl = undefined;

    if (req.file) {
      photoUrl = await uploadToCloudinary(req.file.buffer);
    }

    const updatedContact = await contactServices.updateContact(
      req.params.contactId,
      { ...req.body, ...(photoUrl ? { photo: photoUrl } : {}) },
      req.user
    );

    res.json({
      status: 200,
      message: 'Contact updated successfully',
      data: updatedContact,
    });
    const { contactId } = req.params;
    const userId = req.user._id;
    const contact = await updateContact(contactId, req.body, userId);

    if (!contact) {
      return res.status(404).json({
        message: 'Contact not found',
      });
    }

    res.status(200).json({
      status: 200,
      message: 'Successfully patched a contact!',
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteContactController = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const userId = req.user._id;
    const contact = await deleteContact(contactId, userId);

    if (!contact) {
      return res.status(404).json({
        message: 'Contact not found',
      });
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const uploadPhotoController = async (req, res, next) => {
  try {
    const file = req.file;
    if (!file) {
      return res
        .status(400)
        .json({ success: false, message: 'No file uploaded' });
    }
    let photoUrl;
    const ENABLE_CLOUDINARY = env(CLOUDINARY.ENABLE_CLOUDINARY);
    if (ENABLE_CLOUDINARY === 'true') {
      photoUrl = await uploadToCloudinary(file.buffer);
    } else {
      const fileNAme = await saveFileToUploadDir(file);
      photoUrl = `/uploads/${fileNAme}`;
    }
    res.status(200).json({
      success: true,
      message: 'File uploaded successfully',
      data: {
        photoUrl,
      },
    });
  } catch (error) {
    next(error);
  }
};
