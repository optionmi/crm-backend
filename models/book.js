const db = require('../config/db');

class Book {
  constructor(book) {
    this.title = book.title;
    this.author = book.author;
    this.publication_year = book.publication_year;
  }

  static create(newBook, result) {
    db.query('INSERT INTO books SET ?', newBook, (err, res) => {
      if (err) {
        console.error('Error creating book: ', err);
        result(err, null);
        return;
      }
      console.log('Created book: ', { id: res.insertId, ...newBook });
      result(null, { id: res.insertId, ...newBook });
    });
  }

  static getAll(result) {
    db.query('SELECT * FROM books', (err, res) => {
      if (err) {
        console.error('Error retrieving books: ', err);
        result(err, null);
        return;
      }
      console.log('Books: ', res);
      result(null, res);
    });
  }

  static updateById(bookId, updatedBook, result) {
    db.query(
      'UPDATE books SET title = ?, author = ?, publisher_id = ? WHERE id = ?',
      [updatedBook.title, updatedBook.author, updatedBook.publication_year, bookId],
      (err, res) => {
        if (err) {
          console.error('Error updating book: ', err);
          result(err, null);
          return;
        }
        if (res.affectedRows === 0) {
          // Book not found with the given ID
          result({ kind: 'not_found' }, null);
          return;
        }
        console.log('Updated book: ', { id: bookId, ...updatedBook });
        result(null, { id: bookId, ...updatedBook });
      }
    );
  }

  static remove(bookId, result) {
    db.query('DELETE FROM books WHERE id = ?', bookId, (err, res) => {
      if (err) {
        console.error('Error deleting book: ', err);
        result(err, null);
        return;
      }
      if (res.affectedRows === 0) {
        // Book not found with the given ID
        result({ kind: 'not_found' }, null);
        return;
      }
      console.log('Deleted book with id: ', bookId);
      result(null, res);
    });
  }

  static findById(bookId, result) {
    db.query('SELECT * FROM books WHERE id = ?', bookId, (err, res) => {
      if (err) {
        console.error('Error retrieving book: ', err);
        result(err, null);
        return;
      }
      if (res.length === 0) {
        // Book not found with the given ID
        result({ kind: 'not_found' }, null);
        return;
      }
      console.log('Book with id: ', bookId, res[0]);
      result(null, res[0]);
    });
  }

}

module.exports = Book;
