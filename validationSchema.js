const Joi = require('joi');

module.exports.contentSchema = Joi.object({
    content: Joi.object({
      title: Joi.string().required(),
      // image: Joi.string().required(),
      description: Joi.string().required()
    }).required()
  });

  module.exports.reviewSchema = Joi.object({
    review: Joi.object({
      body: Joi.string().required()
    }).required()
  })
