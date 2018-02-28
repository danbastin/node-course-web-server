const express = require('express');
const hbs = require('hbs');
const fs = require('fs');
const axios = require('axios');

const port = process.env.PORT || 3000;
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

// app.use((req, res, next) => res.render('maint.hbs'));

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

app.get('/projects', (req, res) => {
  res.render('projects.hbs', {
    pageTitle: 'My Projects'
  });
});

app.get('/bad', (req, res) => {
  var userIP;
  if (req.headers["x-forwarded-for"]) {
    userIP = req.headers["x-forwarded-for"].split(',');
    userIP = userIP[userIP.length-1];
  } else {
    userIP = req.ip;
  }

  const ipUrl = `http://ip-api.com/json/${userIP}`;

  axios.get(ipUrl).then((result) => {
    if (result.data.regionName === 'Colorado') {
      res.send('<h1>FUCK YOU JERRY!!!!!</h1>');
    } else if (result.data.regionName === 'Utah') {
      res.send('<h1>Dan, ure the best bruh</h1>');
    } else if (result.data.regionName === 'Kentucky') {
      res.send('<h1>FUCK YOU HUU!!!!');
    } else {
      res.send(`FUCK YOU BRO FROM ${result.data.regionName}`);
    }
  }).catch((err) => {
    res.send(err);
  });

  
});

app.listen(port, () => {
  console.log(`server listening on port ${port}`);
});