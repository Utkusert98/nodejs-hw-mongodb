const validateBody = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      return res.status(400).json({
        status: 400,
        message: 'Validation error',
        details: error.details.map((d) => d.message)
      });
    }

    req.body = value;
    next();
  };
};

export default validateBody;
