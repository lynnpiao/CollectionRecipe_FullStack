const express = require('express');
const RecipeController = require('../controller/RecipeController.js');

const getRecipes = RecipeController.getRecipes;
const getRecipeById = RecipeController.getRecipeById;
const createRecipe = RecipeController.createRecipe;
const updateRecipe = RecipeController.updateRecipe;
const deleteRecipe = RecipeController.deleteRecipe;


const router = express.Router()

router.get('/recipes', getRecipes)
router.get('/recipes/:id', getRecipeById)
router.post('/recipes', createRecipe)
router.put('/recipes/:id', updateRecipe)
router.delete('/recipes/:id', deleteRecipe)

module.exports = router;