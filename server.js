const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

var app = express();

hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine', 'hbs');

app.use((req, res, next) => {
  const now = new Date().toString();
  const log = `${now}:${req.ip}: ${req.method}  ${req.url}`;
  fs.appendFile('server.log', log + '\n', (err) => {
    if (err) { console.log('unable to append to log'); }
  });
  next();
});

app.use((req, res, next) => res.render('maint.hbs'));

hbs.registerHelper('getCurrentYear', () => new Date().getFullYear());
hbs.registerHelper('loud', t => t.toUpperCase());

app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
  res.render('home.hbs', {
    pageTitle: 'Home Page'
  })
});

app.get('/about', (req, res) => {
  res.render('about.hbs', {
    pageTitle: 'About Page'
  });
});

app.get('/bad', (req, res) => {
  res.send({err: 'Something happnend'});
});

app.listen(3000, () => {
  console.log('server listening on port 3000');
});