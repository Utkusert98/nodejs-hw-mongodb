import Contact from '../db/models/contacts.js';
// // import { isValidObjectId } from 'mongoose';
// import createHttpError from 'http-errors';

// export const getAllContacts = async ({
//   page = 1,
//   perPage = 10,
//   sortBy = 'name',
//   sortOrder = 'asc',
//   type,
//   isFavorite,
//   userId,
//   req,
//   res,
//   next,
// }) => {
//   const skip = (page - 1) * perPage;

//   const filter = {};
//   if (type) {
//     filter.contactType = type;
//   }
//   if (isFavorite !== undefined) {
//     filter.isFavorite = isFavorite === 'true';
//   }

//   const totalItems = await Contact.countDocuments();
//   const sortOptions = { [sortBy]: sortOrder === 'desc' ? 1 : -1 };

//   const contacts = await Contact.find({ userId: req.user._id })
//     .skip(skip)
//     .limit(perPage)
//     .sort(sortOptions);

//   const totalPages = Math.ceil(totalItems / perPage);

//   return {
//     data: contacts,
//     page,
//     perPage,
//     totalItems,
//     totalPages,
//     hasPreviousPage: page > 1,
//     hasNextPage: page < totalPages,
//   };
// };

// export const getContactById = async (req, res, next) => {
//   // if (!isValidObjectId(contactId)) {
//   //   return createHttpError(400, `Invalid contact id`);
//   // }
//   try {
//     const { contactId } = req.params;
//     const contact = await Contact.findOne({
//       _id: contactId,
//       userId: req.user._id,
//     });
//     console.log('Contact found:', contact);
//     if (!contact) {
//       console.log(`Contact with ID ${contactId} not found`);
//       throw new createHttpError(404, `Contact with ID ${contactId} not found`);
//       // console.log('Contact retrived successfully:', contact);
//     }
//     res.json(contact);
//   } catch (error) {
//     next(error);
//   }
// };

// export const createContact = async (contactData, userId) => {
//   try {
//     const result = await Contact.create(...contactData, userId);
//     // if (!result) {
//     //   return null;
//     // }
//     console.log('Contact created successfully:', result);

//     return result;
//   } catch (error) {
//     console.error('Error creating contact:', error.message);
//     return error;
//   }
// };

// export const updateContact = async (req, res, next) => {
//   // if (!isValidObjectId(contactId)) return null;
//   try {
//     const { contactId } = req.params;
//     const result = await Contact.findOneAndUpdate(
//       {
//         _id: contactId,
//         userId: req.user._id,
//       },
//       req.body,
//       { new: true },
//       { runValidators: false }
//     );
//     if (!result) {
//       console.log(`Contact with ID ${contactId} not found for update`);
//       throw new createHttpError(404, `Contact with ID ${contactId} not found`);
//     }
//     res.json(result);
//   } catch (error) {
//     next(error);
//   }
// };

// export const deleteContact = async (res, req, next) => {
//   // if (!isValidObjectId(contactId)) {
//   //   return createHttpError(400, `Invalid contact id`);
//   // }
//   try {
//     const { contactId } = req.params;
//     const contact = await Contact.findOneAndDelete({
//       _id: contactId,
//       userId: req.user._id,
//     });
//     if (!contact) {
//       console.log(`Contact with ID ${contactId} not found for deletion`);
//       throw new createHttpError(404, `Contact with ID ${contactId} not found`);
//       // return null;
//     }
//     console.log('Contact deleted successfully:', contact);
//     res.status(204).json();
//   } catch (error) {
//     next(error);
//   }
// };

export const getAllContacts = async (userId) => {
  const contacts = await Contact.find({ userId });
  return contacts;
};

export const getContactById = async (contactId, userId) => {
  const contact = await Contact.findOne({
    _id: contactId,
    userId,
  });
  return contact;
};

export const createContact = async (contactData, userId) => {
  const contact = await Contact.create({
    ...contactData,
    userId,
  });
  return contact;
};

export const updateContact = async (contactId, updateData, userId) => {
  const contact = await Contact.findOneAndUpdate(
    { _id: contactId, userId },
    updateData,
    { new: true }
  );
  return contact;
};

export const deleteContact = async (contactId, userId) => {
  const contact = await Contact.findOneAndDelete({
    _id: contactId,
    userId,
  });
  return contact;
};
