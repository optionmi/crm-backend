const Book = require('../models/book');

exports.createBook = (req, res) => {
  if (!req.body) {
    res.status(400).send({ message: 'Content cannot be empty!' });
    return;
  }

  const newBook = new Book({
    title: req.body.title,
    author: req.body.author,
    publisher_id: req.body.publisher_id, // Assuming you have a publisher ID
    // Add more fields as needed
  });

  Book.create(newBook, (err, data) => {
    if (err) {
      res.status(500).send({
        message: err.message || 'Error creating book.',
      });
    } else {
      res.status(201).send(data);
    }
  });
};

exports.updateBook = (req, res) => {
  if (!req.body) {
    res.status(400).send({ message: 'Content cannot be empty!' });
    return;
  }

  const bookId = req.params.id;
  const updatedBook = {
    title: req.body.title,
    author: req.body.author,
    publisher_id: req.body.publisher_id,
    // Add more fields as needed
  };

  Book.updateById(bookId, updatedBook, (err, data) => {
    if (err) {
      if (err.kind === 'not_found') {
        res.status(404).send({
          message: `Book with id ${bookId} not found.`,
        });
      } else {
        res.status(500).send({
          message: `Error updating book with id ${bookId}`,
        });
      }
    } else {
      res.status(200).send(data);
    }
  });
};

exports.deleteBook = (req, res) => {
  const bookId = req.params.id;

  Book.remove(bookId, (err, data) => {
    if (err) {
      if (err.kind === 'not_found') {
        res.status(404).send({
          message: `Book with id ${bookId} not found.`,
        });
      } else {
        res.status(500).send({
          message: `Could not delete book with id ${bookId}`,
        });
      }
    } else {
      res.status(204).send();
    }
  });
};

exports.getAllBooks = (req, res) => {
  Book.getAll((err, data) => {
    if (err) {
      res.status(500).send({
        message: err.message || 'Error retrieving books.',
      });
    } else {
      res.status(200).send(data);
    }
  });
};

exports.viewBook = (req, res) => {
  const bookId = req.params.id;

  Book.findById(bookId, (err, data) => {
    if (err) {
      if (err.kind === 'not_found') {
        res.status(404).send({
          message: `Book with id ${bookId} not found.`,
        });
      } else {
        res.status(500).send({
          message: `Error retrieving book with id ${bookId}`,
        });
      }
    } else {
      res.status(200).send(data);
    }
  });
};
