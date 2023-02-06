const Joi = require('joi');
module.exports.verifyCampSchema = Joi.object({
    campground: Joi.object({
        title: Joi.string().required(),
        price: Joi.number().min(0).required(),
        description: Joi.string().required(),
        location: Joi.string().required(),
        image: Joi.string().required()
    }).required()
});

module.exports.verifyReviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().min(1).max(5).integer().required(),
        body: Joi.string().required()
    })

})
