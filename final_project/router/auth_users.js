
const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();
const bcrypt = require('bcryptjs');

let users = [];

const isValid = (username)=>{ 
  return !users.some((user)=> user.username === username);
}

const authenticatedUser = (username,password)=>{ //returns boolean
  return users.some((user)=> user.username === username && bcrypt.compareSync(password, user.password));
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  // TODO: Get username and password from request body
  const { username, password } = req.body;

  // TODO: Check if username and password are provided
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  // TODO: Check if the user exists and the password matches
  if (!authenticatedUser(username, password)) {
    return res.status(401).json({ message: "Invalid username or password" });
  }

  // TODO: Generate a JWT token for the authenticated user
  const token = jwt.sign({ username }, "secret_key", { expiresIn: "1h" });

  // TODO: Store the username in session
  req.session.username = username;
  req.session.token = token;
  return res.status(200).json({ message: "Login successful", token });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  // TODO: Get the ISBN from the request parameters
  const isbn = req.params.isbn;
  const review = req.body.review;

  // TODO: User from cookies/session (Assuming username is stored in session after login)
  const username = req.session.username;
  if (!username) {
    return res.status(403).json({ message: "Unauthorized access" });
  }

  // TODO: Check if the book exists
  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  // TODO: Add the review to the book
  books[isbn].reviews[username] = review;

  return res.status(200).json({ message: "Review added successfully" });
});

// example curl command include cookies:
// curl -X PUT http://localhost:5000/customer/auth/review/1 -H "Content-Type: application/json" -d "{\"review\":\"This is a great book!\"}" --cookie "connect.sid"

// Delete a book review
regd_users.delete("/auth/review/:isbn", async (req, res) => {
  // TODO: Get the ISBN from the request parameters
  const isbn = req.params.isbn;

  // TODO: User from cookies/session (Assuming username is stored in session after login)
  const username = req.session.username;
  if (!username) {
    return res.status(403).json({ message: "Unauthorized access" });
  }

  // TODO: Check if the book exists
  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  // TODO: Delete the review from the book
  delete books[isbn].reviews[username];

  return res.status(200).json({ message: "Review deleted successfully" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
