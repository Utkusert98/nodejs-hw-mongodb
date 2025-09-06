import mongoose from 'mongoose';

const isValidId = (req, res, next) => {
  const { contactId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(contactId)) {
    return res.status(400).json({
      status: 400,
      message: `${contactId} is not a valid id`
    });
  }
  next();
};

export default isValidId;
