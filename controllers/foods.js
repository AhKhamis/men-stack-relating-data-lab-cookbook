const User = require('../models/user.js');
const Recipe = require('../models/recipe.js');

const index = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    res.render('foods/index.ejs', { foods: user.pantry });
  } catch (err) {
    res.redirect('/');
  }
};

const newFood = async (req, res) => {
  try {
    res.render('foods/new.ejs');
  } catch (err) {
    res.redirect('/');
  }
};

const create = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    user.pantry.push(req.body);
    await user.save();

    res.redirect('/');
  } catch (err) {
    console.log(err);
    res.redirect('foods/new');
  }
};

const show = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const food = user.pantry.id(req.params.foodId);

    res.render('foods/show.ejs', { food });
  } catch (err) {
    console.log(err);
    res.redirect('/');
  }
};

const deleteFood = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    user.pantry.pull(req.params.foodId);

    await user.save();

    res.redirect(`/users/${user._id}/foods`);
  } catch (err) {
    console.log(err);
    res.redirect('/');
  }
};

const edit = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const food = user.pantry.id(req.params.foodId);

    res.render('foods/edit.ejs', { food });
  } catch (err) {
    console.log(err);
    res.redirect('/');
  }
};

const update = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const food = user.pantry.id(req.params.foodId);

    food.set(req.body);

    await user.save();

    res.redirect(`/users/${user._id}/foods/${food._id}`);
  } catch (err) {
    console.log(err);
    res.redirect('/');
  }
};

const users = async (req, res) => {
  try {
    const allUsers = await User.find({});

    res.render('users/index.ejs', {
      allUsers,
    });
  } catch (err) {
    console.log(err);
    res.redirect('/');
  }
};

const showUsers = async (req, res) => {
  try {
    const communityUser = await User.findById(req.params.id);

    const recipes = await Recipe.find({
      owner: communityUser._id,
    });

    res.render('users/show.ejs', {
      communityUser,
      recipes,
    });
  } catch (err) {
    console.log(err);
    res.redirect('/users');
  }
};

module.exports = {
  index,
  newFood,
  create,
  show,
  deleteFood,
  edit,
  update,
  users,
  showUsers,
};