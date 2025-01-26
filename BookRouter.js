const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authenticateToken = require("./Auth");
const Book = require('./BookSchema')
const User = require('./UserSchema')
const router = express.Router();
const JWT_SECRET = "your_jwt_secret";

// Add a new book
router.post('/add', authenticateToken, async (req, res) => {
  const { title, author, genre } = req.body;
  try {
    const book = new Book({ title, author, genre });
    await book.save();
    res.status(201).json({ message: 'Book added successfully', book });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add book', details: err.message });
  }
});

// Fetch all books
router.get('/show', async (req, res) => {
  try {
    const books = await Book.find();
    res.status(200).json(books);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch books', details: err.message });
  }
});

// Fetch a specific book by ID
router.get('/book/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }
    res.status(200).json(book);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch book', details: err.message });
  }
});

// Update book information
router.put('/update/:id', authenticateToken, async (req, res) => {
  try {
    const updates = req.body;
    const book = await Book.findByIdAndUpdate(req.params.id, updates);
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }
    res.status(200).json({ message: 'Book updated successfully', book });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update book', details: err.message });
  }
});


router.delete('/delete/:id', authenticateToken, async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }
    res.status(200).json({ message: 'Book deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete book', details: err.message });
  }
});

router.post("/borrow", authenticateToken, async (req, res) => {
    const { bookId } = req.body;
  
    try {
      const book = await Book.findById(bookId);
      if (!book || book.isBorrowed) {
        return res.status(400).json({ message: "Book is not available for borrowing" });
      }
  
      book.isBorrowed = true;
      book.borrowedBy = req.user.id;
      await book.save();
  
      res.status(200).json({ message: "Book borrowed successfully", book });
    } catch (err) {
      res.status(500).json({ error: "Failed to borrow book", details: err.message });
    }
  });

  router.post("/return", authenticateToken, async (req, res) => {
    const { bookId } = req.body;
  
    try {
      const book = await Book.findById(bookId);
      if (!book || !book.isBorrowed || book.borrowedBy.toString() !== req.user.id) {
        return res.status(400).json({ message: "You cannot return this book" });
      }
  
      book.isBorrowed = false;
      book.borrowedBy = null;
      await book.save();
  
      res.status(200).json({ message: "Book returned successfully", book });
    } catch (err) {
      res.status(500).json({ error: "Failed to return book", details: err.message });
    }
  });
  
  router.get("/borrowed", authenticateToken, async (req, res) => {
    try {
      const borrowedBooks = await Book.find({ borrowedBy: req.user.id });
      res.status(200).json(borrowedBooks);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch borrowed books", details: err.message });
    }
  });
module.exports = router;
