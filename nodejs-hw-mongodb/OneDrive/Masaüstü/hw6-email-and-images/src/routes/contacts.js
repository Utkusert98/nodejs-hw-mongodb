import express from 'express';
import {
  getContactsController,
  getContactByIdController,
  createContactController,
  updateContactController,
  deleteContactController,
} from '../controllers/contacts.js';
import { validateBody } from '../middlewares/validateBody.js';
import { isValidId } from '../middlewares/isValidId.js';
import {
  createContactSchema,
  updateContactSchema,
} from '../validation/contactsSchemas.js';

import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { authenticate } from '../middlewares/authenticate.js';
// import { authorize } from '../middlewares/authorize.js';
import { upload } from '../middlewares/upload.js';
// import * as contactsController from '../controllers/contacts.js';
import { ROLES } from '../constant/index.js';
import { checkRoles } from '../middlewares/checkRoles.js';
// import mongoose from 'mongoose';
// import createError from 'http-errors';

const router = express.Router();
router.use(authenticate);

router.get(
  '/',
  checkRoles(ROLES.ADMIN, ROLES.MODERATOR),
  isValidId,
  ctrlWrapper(getContactsController)
);

router.get(
  '/:contactId',
  checkRoles(ROLES.ADMIN, ROLES.MODERATOR),
  isValidId,
  ctrlWrapper(getContactByIdController)
);

// router.post('/', ctrlWrapper(createContactController));
router.post(
  '/',
  checkRoles(ROLES.ADMIN, ROLES.MODERATOR, ROLES.USER),
  isValidId,
  upload.single('photo'),
  validateBody(createContactSchema),
  ctrlWrapper(createContactController)
);
router.put(
  '/:contactId',
  checkRoles(ROLES.ADMIN, ROLES.MODERATOR),
  isValidId,
  upload.single('photo'),
  validateBody(updateContactSchema),
  ctrlWrapper(updateContactController)
);

// router.patch('/:contactId', ctrlWrapper(updateContactController));
router.patch(
  '/:contactId',
  checkRoles(ROLES.ADMIN, ROLES.MODERATOR),
  upload.single('photo'),
  isValidId,
  validateBody(updateContactSchema),
  ctrlWrapper(updateContactController)
);

// router.delete('/:contactId', ctrlWrapper(deleteContactController));
router.delete(
  '/:contactId',
  checkRoles(ROLES.ADMIN, ROLES.MODERATOR),
  isValidId,
  ctrlWrapper(deleteContactController)
);

export default router;
