const Books = require('../../models/publishers/books');
const Publishers = require('../../models/Publishers/publisher');

// Function to create a new book (accessible to publishers)
const createBook = async (req, res) => {
  const { title, author, board, standard, subject, price } = req.body;
  const { user } = req;

  try {
    // Check if the user is an admin or publisher
    if (user.user_type !== 'admin' && user.user_type !== 'publisher') {
      return res.status(403).json({ message: 'Permission denied' });
    }

    let publisherId;

    if (user.user_type === 'publisher') {
      // If the user is a publisher, use their own publisher ID
      const publisher = await Publishers.findOne({ where: { user_id: user.id } });
      if (!publisher) {
        return res.status(404).json({ message: 'Publisher not found' });
      }
      publisherId = publisher.id;
    } else {
      // If the user is an admin, set the publisher ID to null (or a default value)
      publisherId = null; // Set to null or a default value as needed
    }

    // Create the book
    const book = await Books.create({
      title,
      author,
      board,
      standard,
      subject,
      price,
      publisher_id: publisherId,
    });

    res.status(201).json(book);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};

// Function to fetch all books (accessible to all users)
const getAllBooks = async (req, res) => {
  try {
    const books = await Books.findAll();

    if (books.length > 0) {
      return res.status(200).json(books);
    } else {
      return res.status(404).json({ message: 'No books found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};

// Function to fetch a book by ID (accessible to all users)
const getBookById = async (req, res) => {
  const { id } = req.params;

  try {
    const book = await Books.findByPk(id);

    if (book) {
      return res.status(200).json(book);
    } else {
      return res.status(404).json({ message: 'Book not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};

// Function to update a book (accessible to publishers)
const updateBook = async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;

  try {
    // Check if the user is an admin or publisher
    if (req.user.user_type !== 'admin' && req.user.user_type !== 'publisher') {
      return res.status(403).json({ message: 'Permission denied' });
    }

    // Find the book by ID and update it
    const [updatedRows] = await Books.update(updatedData, {
      where: { id },
    });

    if (updatedRows > 0) {
      return res.status(200).json({ message: 'Book data updated successfully' });
    } else {
      return res.status(404).json({ message: 'Book not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};

module.exports = { createBook, getAllBooks, getBookById, updateBook };