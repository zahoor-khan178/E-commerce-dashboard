const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
require('dotenv').config();  // Load .env file
require('./db/config');
const User = require('./db/userschema');
const Product = require('./db/product');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());


app.use(cors({
  origin: [process.env.FRONTEND_URL, 'http://localhost:3000'].filter(Boolean),
  allowedHeaders: ['Content-Type', 'Authorization'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));




const jwtKey = process.env.JWT_SECRET || "fallback-secret"; // from .env

// ================= AUTH ROUTES ================= //


//  signup API 

app.post('/register', async (req, resp) => {
  try {
    // Extract name, email & password from request body
    const { name, email, password } = req.body;

    // Check if email already exists
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return resp
        .status(400)
        .send({ message: "Email already exists, please use a different email." });
    }



    // Create new user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = new User({
      name,
      email,
      password: hashedPassword
    });
    let result = await user.save();
    result = result.toObject();
    delete result.password;

    // Sign JWT
    jwt.sign({ result }, jwtKey, { expiresIn: "1h" }, (err, token) => {
      if (err) {
        resp.status(500).send("Problem in token");
      } else {
        resp.send({ result, auth: token });
      }
    });
  } catch (error) {
    console.log("Error in signup API:", error);
    resp.status(500).send("Internal server error");
  }
});


// login API

app.post('/login', async (req, resp) => {

  try {

    const { email, password } = req.body;

    // Find user by email
    const existingUser = await User.findOne({ email });

    // Check if user exists
    if (!existingUser) {
      return resp.status(400).send({
        message: "Incorrect Email or Password."
      });
    }

    // Compare entered password with hashed password
    const isMatch = await bcrypt.compare(
      password,
      existingUser.password
    );

    // If password does not match
    if (!isMatch) {
      return resp.status(400).send({
        message: "Incorrect Email or Password."
      });
    }

    // Remove password from response
    let result = existingUser.toObject();
    delete result.password;

    // Generate JWT
    jwt.sign(
      { result },
      jwtKey,
      { expiresIn: "1h" },
      (err, token) => {

        if (err) {
          resp.status(500).send({
            message: "Problem in token"
          });

        } else {

          resp.send({
            result,
            auth: token
          });
        }
      }
    );

  } catch (error) {

    console.log(error);

    resp.status(500).send({
      message: "Internal Server Error"
    });
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
  app.listen(PORT, () => console.log(` Server running on port ${PORT}`));
}

module.exports = app; // For Vercel
