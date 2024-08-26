const Joi = require('joi');



module.exports.courseSchema=Joi.object({
    course:Joi.object({
name:Joi.string().required(),
description:Joi.string().required(),
date:Joi.number().required(),
    }).required()
})


module.exports.reviewSchema=Joi.object({
    review:Joi.object({
        rating:Joi.number().required().min(1).max(5),
comment:Joi.string().required(),
    }).required()
})