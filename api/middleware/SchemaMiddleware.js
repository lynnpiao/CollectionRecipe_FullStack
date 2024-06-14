const Joi = require('joi');

// Validation For create Recipe
// Joi validation schema 
const recipeSchema = Joi.object({
    title: Joi.string().max(100).required(),
    type: Joi.string().max(100).required(),
    description: Joi.string().max(255).allow(null, ''),
    duration: Joi.number().integer().positive().max(1440).allow(null),
    photoUrl: Joi.string().max(255).pattern(/^(https?:\/\/|\.\/assets\/img\/).*\.(jpg|jpeg|png)$/).allow(null, '')
});

// Middleware for validating request data
const validateRecipe = (req, res, next) => {
    const { error } = recipeSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ msg: error.details[0].message });
    }
    next();
}


// Validation For Update Recipe
// Joi validation schema 
const partialRecipeSchema = Joi.object({
    description: Joi.string().max(255).allow(null, ''),
    duration: Joi.number().integer().positive().max(1440).allow(null),
    photoUrl: Joi.string().max(255).pattern(/^(https?:\/\/|\.\/assets\/img\/).*\.(jpg|jpeg|png)$/).allow(null, '')
});

// Middleware for validating request data
const validatePartialRecipe = (req, res, next) => {
    const { error } = partialRecipeSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ msg: error.details[0].message });
    }
    next();
}

module.exports = {
    validateRecipe,
    validatePartialRecipe
};
