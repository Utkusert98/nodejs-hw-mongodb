import Joi from 'joi';

export const createContactSchema = Joi.object({
  name: Joi.string().min(3).max(20).required().messages({
    'string.base': 'Username should be a string',
    'string.min': 'Username should have at least {#limit} characters',
    'string.max': 'Username should have at most {#limit} characters',
    'any.required': 'Username is required',
  }),
  phoneNumber: Joi.string()
    .pattern(/^[0-9]+$/)
    .min(7)
    .max(15)
    .required()
    .messages({
      'string.base': 'The phone number must be a type of text',
      'string.empty': 'Phone number cannot be empty',
      'string.pattern.base':
        'The phone number may only include numeric characters',
      'string.min': 'The phone number must be at least 7 digits long',
      'string.max': 'The phone number must not exceed 15 digits in length',
      'any.required': 'Phone number is a required field',
    }),
  email: Joi.string().email().required().messages({
    'string.email': 'Please input a correct email address',
    'any.required': 'Email is required',
  }),
  isFavourite: Joi.boolean().optional().messages({
    'boolean.base': 'Value should be a boolean (true or false)',
  }),
  contactType: Joi.string()
    .valid('work', 'home', 'personal')
    .required()
    .messages({
      'any.only':
        'The contact type must be one of the following: work, home, or personal',
      'any.required': 'The contact type field is mandatory',
    }),
});

export const updateContactSchema = Joi.object({
  name: Joi.string().min(3).max(20).messages({
    'string.base': 'Username should be a string',
    'string.min': 'Username should have at least {#limit} characters',
    'string.max': 'Username should have at most {#limit} characters',
  }),
  phoneNumber: Joi.string()
    .pattern(/^[0-9]+$/)
    .min(7)
    .max(15)
    .messages({
      'string.base': 'The phone number must be a type of text',
      'string.empty': 'Phone number cannot be empty',
      'string.pattern.base':
        'The phone number may only include numeric characters',
      'string.min': 'The phone number must be at least 7 digits long',
      'string.max': 'The phone number must not exceed 15 digits in length',
    }),
  email: Joi.string().email().messages({
    'string.email': 'Please input a correct email address',
  }),
  isFavourite: Joi.boolean().messages({
    'boolean.base': 'Value should be a boolean (true or false)',
  }),
  contactType: Joi.string().valid('work', 'home', 'personal').messages({
    'any.only':
      'The contact type must be one of the following: work, home, or personal',
  }),
});
