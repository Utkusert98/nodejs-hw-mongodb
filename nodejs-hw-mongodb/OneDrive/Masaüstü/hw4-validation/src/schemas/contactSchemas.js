import Joi from 'joi';

const str = Joi.string().min(3).max(20);

export const createContactSchema = Joi.object({
  name: str.required(),
  phoneNumber: str.required(),
  email: Joi.string().email().min(3).max(20),
  isFavourite: Joi.boolean(),
  contactType: Joi.string().valid('work', 'home', 'personal')
});

export const updateContactSchema = Joi.object({
  name: str,
  phoneNumber: str,
  email: Joi.string().email().min(3).max(20),
  isFavourite: Joi.boolean(),
  contactType: Joi.string().valid('work', 'home', 'personal')
}).min(1);
