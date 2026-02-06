const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const bcrypt = require('bcryptjs');

function isBookEmpty(book) {
  return Object.keys(book).length === 0;
}

// Register a new user
public_users.post("/register", async (req, res) => {
  // TODO: Get username and password from request body
  const { username, password } = req.body;

  // TODO: Check if username and password are provided
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  // TODO: Check if the username is valid (not already taken)
  if (!isValid(username)) {
    return res.status(409).json({ message: "Username already exists" });
  }

  // TODO: add the new user to the users array with hashed password
  users.push({ username: username, password: bcrypt.hashSync(password, 10) });

  return res.status(201).json({ message: "User registered successfully" });
});

// * example curl command: curl -X POST http://localhost:5000/register -H "Content-Type: application/json" -d "{\"username\":\"user1\",\"password\":\"pass1\"}"

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
  // TODO: Check if the books database is empty
  if (isBookEmpty(books)) {
    // ! Return 404 if no books are available
    return res.status(404).json({ message: "No books available" });
  }

  // TODO: return the book list available in the shop
  return res.status(200).json(books);
});

public_users.get('/books', async function (req, res) {
  // TODO: Check if the books database is empty
  if (isBookEmpty(books)) {
    // ! Return 404 if no books are available
    return res.status(404).json({ message: "No books available" });
  }

  // TODO: return the book list available in the shop
  return res.status(200).json(books);
});

// Get book details based on ISBN(International Standard Book Number)
public_users.get('/isbn/:isbn', async function (req, res) {
  // TODO: Check if the books database is empty
  if (isBookEmpty(books)) {
    // ! Return 404 if no books are available
    return res.status(404).json({ message: "No books available" });
  }

  // TODO: Get book details based on ISBN(International Standard Book Number
  const isbn = req.params.isbn;

  // TODO: Check if the book with the given ISBN exists
  if (books[isbn]) {
    return res.status(200).json(books[isbn]);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }

});

// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
  // TODO: Get book details based on author
  const author = req.params.author;
  const result = [];

  // TODO: Iterate through the books to find books by the given author
  for (let isbn in books) {
    // TODO: Check if the author matches (case-insensitive) and include number of books by that author
    if (books[isbn].author.toLowerCase() === author.toLowerCase()) {
      let bookWithIsbn = { isbn: isbn, ...books[isbn] };
      result.push(bookWithIsbn);
    }
  }

  // TODO: return the book details in the response
  if (result.length > 0) {
    return res.status(200).json(result);
  } else {
    return res.status(404).json({ message: "Author not found" });
  }
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
  // TODO: Check if the books database is empty
  if (isBookEmpty(books)) {
    // ! Return 404 if no books are available
    return res.status(404).json({ message: "No books available" });
  }

  // TODO: Get all books based on title
  const title = req.params.title;
  const result = [];

  // TODO: Iterate through the books to find books with the given title
  for (let isbn in books) {
    if (books[isbn].title.toLowerCase() === title.toLowerCase()) {
      let bookWithIsbn = { isbn: isbn, ...books[isbn] };
      result.push(bookWithIsbn);
    }
  }

  // TODO: return the book details in the response
  if (result.length > 0) {
    return res.status(200).json(result);
  } else {
    return res.status(404).json({ message: "Title not found" });
  }
});

//  Get book review // curl -X GET "http://localhost:3000/review" -o getbookreview
public_users.get('/review/:isbn', async function (req, res) {
  // TODO: Check if the books database is empty
  if (isBookEmpty(books)) {
    // ! Return 404 if no books are available
    return res.status(404).json({ message: "No books available" });
  }

  // TODO: Get book review by ISBN
  const isbn = req.params.isbn;
  if (books[isbn] && books[isbn].reviews && Object.keys(books[isbn].reviews).length > 0) {
    return res.status(200).json(books[isbn].reviews);
  } else {
    return res.status(404).json({ message: "No reviews found for this book." });
  }
})

module.exports.general = public_users;
