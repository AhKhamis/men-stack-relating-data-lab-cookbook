/* eslint-disable prefer-destructuring */
require('dotenv').config();
require('./config/databse');

const express = require('express');

const app = express();

// Middleware
const session = require('express-session');
const MongoStore = require('connect-mongo').MongoStore;
const methodOverride = require('method-override');
const morgan = require('morgan');
const isSignedIn = require('./middleware/isSignedIn');
const addUserToViews = require('./middleware/addUserToViews');

// CONTROLLERS
const authCtrl = require('./controllers/authCtrl');

const foodsController = require('./controllers/foods');

// Set the port from environment variable or default to 3000
const port = process.env.PORT ? process.env.PORT : '5000';

// Middleware to parse URL-encoded data from forms
app.use(express.urlencoded({ extended: false }));
// Middleware for using HTTP verbs such as PUT or DELETE
app.use(methodOverride('_method'));
// Morgan for logging HTTP requests
app.use(morgan('dev'));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }),
  })
);

app.use(addUserToViews);

// PUBLIC ROUTES
app.get('/', async (req, res) => {
  if(req.session.user){
   res.redirect(`users/${req.session.user._id}/foods`)
  }else{
    res.render('index.ejs');
  }
});

//Auth
app.get('/auth/sign-up', authCtrl.signup);
app.post('/auth/sign-up', authCtrl.register);
app.get('/auth/sign-in', authCtrl.signin);
app.post('/auth/sign-in', authCtrl.login);

// Customer middleware
app.use(isSignedIn);

// PRIVATE ROUTES
app.get('/auth/sign-out', authCtrl.signout);

app.get('/protected', async (req, res) => {
  res.send(`You are logged in as ${req.session.user.username}`);
});

// Applications
app.get('/users/:id/foods', foodsController.index);
app.get('/users/:id/foods/new', foodsController.newFood);
app.post('/users/:id/foods', foodsController.create);
app.get('/users/:id/foods/:foodId', foodsController.show);
app.delete('/users/:id/foods/:foodId', foodsController.deleteFood);
app.get('/users/:id/foods/:foodId/edit', foodsController.edit);
app.put('/users/:id/foods/:foodId', foodsController.update);

app.listen(port, () => {
  console.log(`The express app is ready on port ${port}!`);
});
