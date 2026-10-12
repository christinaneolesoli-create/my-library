
import { useState } from 'react';

const emptyBook = {
  title: '',
  author: '',
  genre: '',
  isbn: '',
  quantity: ''
};

function Books({ books, setBooks }) {
  const [form, setForm] = useState(emptyBook);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(currentForm => ({ ...currentForm, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();

    const title = form.title.trim();
    const author = form.author.trim();
    const genre = form.genre.trim();
    const isbn = form.isbn.trim();
    const quantity = Number(form.quantity);

    if (!title || !author || !genre || !isbn) {
      setError('Please fill in every field.');
      return;
    }

    if (!Number.isInteger(quantity) || quantity < 0) {
      setError('Quantity must be a whole number of zero or more.');
      return;
    }

    if (books.some(book => book.isbn.toLowerCase() === isbn.toLowerCase() && book.id !== editingId)) {
      setError('A book with this ISBN already exists.');
      return;
    }

    const bookData = {
      title,
      author,
      genre,
      isbn,
      totalQuantity: quantity,
      availableQuantity: editingId !== null
        ? Math.min(
            books.find(book => book.id === editingId)?.availableQuantity ?? quantity,
            quantity
          )
        : quantity
    };

    if (editingId !== null) {
      setBooks(currentBooks => currentBooks.map(book =>
        book.id === editingId ? { ...book, ...bookData } : book
      ));
    } else {
      setBooks(currentBooks => [...currentBooks, { id: Date.now(), ...bookData }]);
    }

    resetForm();
  }

  function resetForm() {
    setForm(emptyBook);
    setEditingId(null);
    setError('');
  }

  function editBook(book) {
    setForm({
      title: book.title,
      author: book.author,
      genre: book.genre,
      isbn: book.isbn,
      quantity: book.totalQuantity ?? book.quantity
    });
    setEditingId(book.id);
    setError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function deleteBook(id) {
    const confirmed = window.confirm('Are you sure you want to delete this book?');

    if (confirmed) {
      setBooks(currentBooks => currentBooks.filter(book => book.id !== id));

      if (editingId === id) {
        resetForm();
      }
    }
  }

  return (
    <div className="books-page">
      <div className="books-heading">
        <div>
          <p className="eyebrow">LIBRARY MANAGEMENT</p>
          <h1>Book Management</h1>
          <p className="page-description">
            Add, update and manage your library inventory.
          </p>
        </div>
        <span className="book-count">{books.length} titles</span>
      </div>

      <section className="book-form-card">
        <h2>{editingId !== null ? 'Edit Book' : 'Add New Book'}</h2>
        <p className="form-description">
          Enter the book details below.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <label>
              Book Title
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Enter book title"
                required
              />
            </label>

            <label>
              Author
              <input
                name="author"
                value={form.author}
                onChange={handleChange}
                placeholder="Enter author name"
                required
              />
            </label>

            <label>
              Genre
              <input
                name="genre"
                value={form.genre}
                onChange={handleChange}
                placeholder="e.g. Fiction, Technology"
                required
              />
            </label>

            <label>
              ISBN
              <input
                name="isbn"
                value={form.isbn}
                onChange={handleChange}
                placeholder="Enter unique ISBN"
                required
              />
            </label>

            <label>
              Initial Quantity
              <input
                name="quantity"
                type="number"
                min="0"
                step="1"
                value={form.quantity}
                onChange={handleChange}
                required
              />
            </label>
          </div>

          {error && <p className="form-error">{error}</p>}

          <div className="form-actions">
            <button type="submit" className="primary-button">
              {editingId !== null ? 'Save Changes' : 'Add Book'}
            </button>

            {editingId !== null && (
              <button type="button" className="secondary-button" onClick={resetForm}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="inventory">
        <div className="section-heading">
          <div>
            <h2>All Books</h2>
            <p>Manage the books registered in your library.</p>
          </div>
          <span className="book-count">{books.length} titles</span>
        </div>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>TITLE</th>
                <th>AUTHOR</th>
                <th>GENRE</th>
                <th>ISBN</th>
                <th>QUANTITY</th>
                <th>STATUS</th>
                <th>ACTIONS</th>
              </tr>
            </thead>

            <tbody>
              {books.map(book => (
                <tr key={book.id}>
                  <td className="book-title">{book.title}</td>
                  <td>{book.author}</td>
                  <td>{book.genre}</td>
                  <td>{book.isbn}</td>
                  <td>{book.availableQuantity}</td>
                  <td>
                    <span className={`status ${book.availableQuantity < 2 ? 'low' : 'available'}`}>
                        {book.availableQuantity < 2 ? 'Low stock' : 'Available'}
                    </span>
                    </td>

                  <td>
                    <div className="action-buttons">
                      <button className="edit-button" onClick={() => editBook(book)}>
                        Edit
                      </button>
                      <button className="delete-button" onClick={() => deleteBook(book.id)}>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {books.length === 0 && (
                <tr>
                  <td colSpan="7" className="empty-state">
                    No books found. Add your first book above.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default Books;
