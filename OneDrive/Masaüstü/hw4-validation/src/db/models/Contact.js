import { Schema, model } from 'mongoose';

const contactSchema = new Schema(
  {
    name: { type: String, required: true, minlength: 3, maxlength: 20, trim: true },
    phoneNumber: { type: String, required: true, minlength: 3, maxlength: 20, trim: true },
    email: { type: String, minlength: 3, maxlength: 20, lowercase: true, trim: true },
    isFavourite: { type: Boolean, default: false },
    contactType: {
      type: String,
      enum: ['work', 'home', 'personal'],
      default: 'personal',
      required: true
    }
  },
  { timestamps: true, versionKey: false }
);

const ContactCollection = model('contacts', contactSchema);
export default ContactCollection;
