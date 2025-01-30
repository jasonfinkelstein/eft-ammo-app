const express = require('express');
const logger = require('morgan');
const path = require('path');

const app = express();


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const indexRouter = require('./routes/ammoRouter');

app.use('/', indexRouter);

const PORT = 3000;
app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));