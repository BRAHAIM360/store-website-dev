const express = require('express');
const app = express();
const port = process.env.PORT || 3002;
const config = {
  app: {
    defaultLanguageCode: "en",
    isDev: true,
  }
};

app.use(express.static('./static_files'));

app.set('view engine', 'pug');

const defaultLanguageCode = config.app.defaultLanguageCode;

app.get('(/:language([a-z]{2}))?(/*)?', (req, res) => {
  const dictionary = require("../frontend/src/entries/main/entry/dictionary-fallbacks.json")
  res.render('index', {
    UAId: 'UA-88799128-11',
    description: dictionary[req.params.language || defaultLanguageCode]["page description"],
    isDev: config.app.isDev,
    language: req.params.language || defaultLanguageCode,
    title: dictionary[req.params.language || defaultLanguageCode]["page title"],
    keywords: dictionary[req.params.language || defaultLanguageCode]["page keywords"],
    og_image: '/w/png/icon.png',
    entry: 'main',
  })
});

var server = app.listen(port, () => {
  console.log(`fallback server is UP ✅ on port ${port}!`)
  console.log(server.address());
});
