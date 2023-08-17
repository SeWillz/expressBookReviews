const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
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
  return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
