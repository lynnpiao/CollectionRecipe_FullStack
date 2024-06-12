const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const RecipeRoute = require('./routes/RecipeRoute.js')


// express init
const app = express();
const port = 8000;

// express config
app.use(cors());
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(morgan("dev"));

//requests 
app.use(RecipeRoute);


app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
})

module.exports = app;


