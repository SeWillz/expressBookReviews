const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
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
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  let availableBooks = JSON.stringify(books, null, 2);
  return res.status(200).send(availableBooks);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn; // Get the ISBN from request parameters

  if (books.hasOwnProperty(isbn)) {
    const bookDetails = books[isbn];
    return res.status(200).json(bookDetails);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
})
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author; // Get the author from request parameters
  const booksByAuthor = {};

  for (const isbn in books) {
    if (books.hasOwnProperty(isbn) && books[isbn].author === author) {
      booksByAuthor[isbn] = books[isbn];
    }
  }

  if (Object.keys(booksByAuthor).length > 0) {
    return res.status(200).json(booksByAuthor);
  } else {
    return res.status(404).json({ message: "No books found by this author" });
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title; // Get the title from request parameters
  const booksWithTitle = {};

  for (const isbn in books) {
    if (books.hasOwnProperty(isbn) && books[isbn].title === title) {
      booksWithTitle[isbn] = books[isbn];
    }
  }

  if (Object.keys(booksWithTitle).length > 0) {
    return res.status(200).json(booksWithTitle);
  } else {
    return res.status(404).json({ message: "No books found with this title" });
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn; // Get the ISBN from request parameters

  if (books.hasOwnProperty(isbn)) {
    const bookReviews = books[isbn].reviews;
    return res.status(200).json(bookReviews);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

module.exports.general = public_users;
