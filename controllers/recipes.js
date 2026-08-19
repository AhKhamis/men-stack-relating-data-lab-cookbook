const express = require('express');
const router = express.Router();

const User = require('../models/user.js');
const Recipe = require('../models/recipe.js');
const Ingredient = require('../models/ingredient.js');

router.get('/', async (req, res) => {
  try {
    const recipes = await Recipe.find({
      owner: req.session.user._id,
    });

    res.render('recipes/index.ejs', { recipes });
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
});

router.get('/new', async (req, res) => {
  try {
    const ingredients = await Ingredient.find({});

    res.render('recipes/new.ejs', { ingredients });
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
});

router.get('/:recipeId', async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.recipeId)
      .populate('ingredients');

    let backLink = '/recipes';
    let backText = 'Back to Recipes';

    if (req.query.fromUser) {
      backLink = `/users/${req.query.fromUser}`;
      backText = 'Back to User Recipes';
    }

    res.render('recipes/show.ejs', {
      recipe,
      backLink,
      backText,
    });
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
});

router.post('/', async (req, res) => {
  try {
    const newRecipe = new Recipe(req.body);
    newRecipe.owner = req.session.user._id;

    await newRecipe.save();

    res.redirect('/recipes');
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
});

router.delete('/:recipeId', async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.recipeId);

    await recipe.deleteOne();

    res.redirect('/recipes');
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
});

router.get('/:recipeId/edit', async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.recipeId);

    res.render('recipes/edit.ejs', { recipe });
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
});

router.put('/:recipeId', async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.recipeId);

    recipe.set(req.body);

    await recipe.save();

    res.redirect(`/recipes/${recipe._id}`);
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
});

module.exports = router;