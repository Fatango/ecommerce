const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Product = require('./models/product');

const app = express();

// EJS Kurulum
app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

// Static dosyaları
app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect('mongodb://localhost:27017/ecommerce', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
  .then(() => console.log('You are in the MongoDB'))
  .catch(err => console.log('There is an error'))


// Routes
app.get('/', (req, res) => {
  Product.find()
    .then(products => {
      res.render('base', {
        prods: products
      });
    })
    .catch(err => console.log('Something gone wrong!'))
});

app.get('/add-product', (req, res) => {
  res.render('add-product');
});

app.post('/add-product', (req, res) => {
  const title = req.body.title;
  const description = req.body.description;
  const imageUrl = req.body.imageUrl;
  const product = new Product({
    title: title,
    description: description,
    imageUrl: imageUrl
  });
  product
    .save()
    .then(result => {
      // console.log(result);
      res.json(result);
      console.log('Succesfully posted the product!');
      res.redirect('/');      
    })
    .catch(err => {
      res.json({
        message: err
      });
      console.log('Something gone wrong');
    });
});

app.post('/', (req, res) => {
  const prodId = req.body.productId
  Product.findByIdAndRemove(prodId)
    .then(() => {
      console.log('Kart Silindi.');
      res.redirect('/');
    })
    .catch(err => console.log(err));
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
})