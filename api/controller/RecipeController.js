const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const {validatePartialRecipe, validateRecipe} = require('../middleware/SchemaMiddleware')

// read all
const getRecipes = async (req, res) => {
    try {
        const response = await prisma.recipe.findMany()

        if (response.length===0){
            return res.status(404).json({ msg: 'No Recipe found' })
        }

        res.status(200).json(response)
    } catch (error) {
        res.status(500).json({ msg: error.message })
    }
}

// read one
const getRecipeById = async (req, res) => {
    const id = req.params.id;
    const idInt = parseInt(id);

    
    if (isNaN(idInt) || !Number.isInteger(idInt)) {
        return res.status(400).json({ error: 'Invalid recipe ID' });
    }

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

    // not allow update information with all attributes are null
    if ((description == null || description === '') && 
        (duration == null || duration === '') && 
        (photoUrl == null || photoUrl === '')){
        return res.status(400).json({ error: 'At least one attribute is available' });
    } 

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

    const id = req.params.id;
    const idInt = parseInt(id);

    if (isNaN(idInt) || !Number.isInteger(idInt)) {
        return res.status(400).json({ error: 'Invalid recipe ID' });
    }

    try {
        const recipe = await prisma.recipe.delete({
            where: {
                id: idInt,
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