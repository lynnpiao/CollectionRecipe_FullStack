const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
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



// read all
const getRecipes = async (req, res) => {
    try {
        const response = await prisma.recipe.findMany()
        res.status(200).json(response)
    } catch (error) {
        res.status(500).json({ msg: error.message })
    }
}

// read one
const getRecipeById = async (req, res) => {
    try {
        const response = await prisma.recipe.findUnique({
            where: {
                id: parseInt(req.params.id),
            },
        })
        if (response) {
            res.status(200).json(response);
        } else {
            res.status(404).json({ msg: 'Recipe not found' });
        }
    } catch (error) {
        res.status(500).json({ msg: error.message })
    }
}


// create 
const createRecipe = async (req, res) => {
    const { title, type, description, duration, photoUrl } = req.body
    try {
        const recipe = await prisma.recipe.create({
            data: {
                title: title,
                type: type,
                description: description || null,
                duration: parseInt(duration) || null,
                photoUrl: photoUrl || null,
                createdAt: new Date(),
                updatedAt: new Date()
            },
        })
        res.status(201).json(recipe)
    } catch (error) {
        res.status(400).json({ msg: error.message })
    }
}


//update 
const updateRecipe = async (req, res) => {
    const {description, duration, photoUrl } = req.body
    try {
        const recipe = await prisma.recipe.update({
            where: {
                id: parseInt(req.params.id),
            },
            data: {
                description: description || null,
                duration: duration || null,
                photoUrl: photoUrl || null,
                updatedAt: new Date()
            },
        })
        res.status(200).json(recipe)
    } catch (error) {
        res.status(500).json({ msg: error.message })
    }
}


// delete
const deleteRecipe = async (req, res) => {
    try {
        const recipe = await prisma.recipe.delete({
            where: {
                id: parseInt(req.params.id),
            },
        })
        res.status(200).json(recipe); 
    } catch (error) {
        res.status(500).json({ msg: error.message })
    }
}

module.exports = {
    getRecipes,
    getRecipeById,
    createRecipe: [validateRecipe, createRecipe], // Apply validation middleware
    updateRecipe: [validatePartialRecipe, updateRecipe], // Apply validation middleware
    deleteRecipe
};