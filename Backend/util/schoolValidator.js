import Joi from 'joi';

export const validateAddSchool = (req) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(255).required(),
    address: Joi.string().min(5).max(400).required(),
    latitude: Joi.number().required(),
    longitude: Joi.number().required()
  });

  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message
    });
  }
  
};
