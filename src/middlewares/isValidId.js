import mongoose from "mongoose";

const isValidId = (req,res,next) =>{
    const { contactId } = req.params;

    if(!mongoose.Types.ObjectId.isValid(contactId)) {
        return req.status(400).json({ message: `${contactId} is not a valid id`});
    }
    next();
}

export default isValidId;