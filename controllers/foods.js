// const express = require('express');
// const router = express.Router();

const User = require('../models/user.js');

// router logic will go here - will be built later on in the lab

const index = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    res.render('foods/index.ejs', { foods: user.foods });
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

module.exports = {
    index,
    newFood,
}