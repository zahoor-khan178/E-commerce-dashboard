const express = require('express');
const cors = require('cors');
require('dotenv').config();  // Load .env file
require('./db/config');
const User = require('./db/userschema');
const Product = require('./db/product');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());


const allowedOrigin = process.env.ALLOWED_ORIGIN || 'http://localhost:3000';

const corsOptions = {
  origin: allowedOrigin,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));



const jwtKey = process.env.JWT_SECRET || "fallback-secret"; // from .env

// ================= AUTH ROUTES ================= //

app.post('/register', async (req, resp) => {
  try {
    const user = new User(req.body);
    let result = await user.save();
    result = result.toObject();
    delete result.password;

    jwt.sign({ result }, jwtKey, { expiresIn: "1h" }, (err, token) => {
      if (err) {
        resp.status(500).send('Problem in token');
      } else {
        resp.send({ result, auth: token });
      }
    });
  } catch (error) {
    console.log('Error in signup API:', error);
    resp.status(500).send('Internal server error');
  }
});

app.post('/login', async (req, resp) => {
  try {
    if (req.body.email && req.body.password) {
      const user = await User.findOne(req.body).select('-password');
      if (user) {
        jwt.sign({ user }, jwtKey, { expiresIn: "1h" }, (err, token) => {
          if (err) {
            resp.status(500).send('Something went wrong');
          } else {
            resp.send({ user, auth: token });
          }
        });
      } else {
        resp.status(404).send('No user found');
      }
    } else {
      resp.status(400).send('Email and password required');
    }
  } catch (err) {
    console.log('Error in login API:', err);
    resp.status(500).send('Internal server error');
  }
});

// ================= PRODUCT ROUTES ================= //

app.post('/add-product', verifyToken, async (req, resp) => {
  try {
    const newProduct = new Product(req.body);
    const result = await newProduct.save();
    resp.send(result);
  } catch (err) {
    resp.status(500).send('Error adding product');
  }
});

app.get('/product', verifyToken, async (req, resp) => {
  const products = await Product.find();
  if (products.length > 0) {
    resp.send(products);
  } else {
    resp.send({ result: "No record found" });
  }
});

app.delete('/delete/:id', verifyToken, async (req, resp) => {
  const result = await Product.deleteOne({ _id: req.params.id });
  resp.send(result);
});

app.get('/update/:id', verifyToken, async (req, resp) => {
  const result = await Product.findOne({ _id: req.params.id });
  if (result) {
    resp.send(result);
  } else {
    resp.send('No result found');
  }
});

app.put('/update/:id', verifyToken, async (req, resp) => {
  const result = await Product.updateOne(
    { _id: req.params.id },
    { $set: req.body }
  );
  resp.send(result);
});

app.get('/search/:key', verifyToken, async (req, resp) => {
  const result = await Product.find({
    "$or": [
      { name: { $regex: req.params.key, $options: "i" } },
      { price: { $regex: req.params.key, $options: "i" } },
      { category: { $regex: req.params.key, $options: "i" } },
      { company: { $regex: req.params.key, $options: "i" } },
    ]
  });

  if (result) {
    resp.send(result);
  } else {
    resp.send("Error while searching data.");
  }
});

// ================= MIDDLEWARE ================= //

function verifyToken(req, resp, next) {
  let token = req.headers['authorization'];
  if (token) {
    token = token.split(' ')[1];
    jwt.verify(token, jwtKey, (err, valid) => {
      if (err) {
        resp.status(401).send({ message: "Your session has expired. Please login again." });
      } else {
        next();
      }
    });
  } else {
    resp.status(403).send({ message: "Please add token with header" });
  }
}

// ================= SERVER ================= //

// Use PORT from env (for deployment), fallback to 9000 for local dev
const PORT = process.env.PORT || 9000;

// Only listen when running locally, not when importing (Vercel uses exports)
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
}

module.exports = app; // For Vercel
