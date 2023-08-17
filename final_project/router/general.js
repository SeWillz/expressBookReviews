const express = require('express');
const axios = require('axios'); // Import Axios library
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// axios promis
const axiosGet = async (url) => {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    throw error;
  }
};

public_users.post("/register", async (req, res) => {
  try {
    const username = req.body.username;
    const password = req.body.password;

    // Check if both username and password are provided
    if (!username || !password) {
      return res.status(400).json({ message: "Both username and password are required" });
    }

    // Check if the username already exists
    if (isValid(username)) {
      return res.status(409).json({ message: "Username already exists" });
    }

    // Register the new user
    users.push({ "username": username, "password": password });
    return res.status(200).json({ message: "User successfully registered. Now you can login" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Get the book list available in the shop
public_users.get('/', async (req, res) => {
  try {
    const availableBooks = JSON.stringify(books, null, 2);
    return res.status(200).send(availableBooks);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async (req, res) => {
  try {
    const isbn = req.params.isbn;
    const bookDetails = await axiosGet(`http://localhost:5000/books/${isbn}`);
    return res.status(200).json(bookDetails);
  } catch (error) {
    return res.status(404).json({ message: "Book not found" });
  }
});

// Get book details based on author
public_users.get('/author/:author', async (req, res) => {
  try {
    const author = req.params.author;
    const booksByAuthor = await axiosGet(`http://localhost:5000/books?author=${author}`);
    return res.status(200).json(booksByAuthor);
  } catch (error) {
    return res.status(404).json({ message: "No books found by this author" });
  }
});

// Get all books based on title
public_users.get('/title/:title', async (req, res) => {
  try {
    const title = req.params.title;
    const booksWithTitle = await axiosGet(`http://localhost:5000/books?title=${title}`);
    return res.status(200).json(booksWithTitle);
  } catch (error) {
    return res.status(404).json({ message: "No books found with this title" });
  }
});

// Get book review
public_users.get('/review/:isbn', async (req, res) => {
  try {
    const isbn = req.params.isbn;
    const bookReviews = await axiosGet(`http://localhost:5000/reviews/${isbn}`);
    return res.status(200).json(bookReviews);
  } catch (error) {
    return res.status(404).json({ message: "Book not found" });
  }
});

module.exports.general = public_users;
