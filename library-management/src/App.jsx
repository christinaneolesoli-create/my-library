
import { useEffect, useState } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Books from './pages/books.jsx';
import Transactions from './pages/Transactions.jsx';
import Users from './pages/Users.jsx';

const initialBooks = [
  { id: 1, title: 'Things Fall Apart', author: 'Chinua Achebe', genre: 'Fiction', isbn: '978001', totalQuantity: 5, availableQuantity: 5 },
  { id: 2, title: 'Introduction to Programming', author: 'John Smith', genre: 'Technology', isbn: '978002', totalQuantity: 1, availableQuantity: 1 },
  { id: 3, title: 'Computer Networks', author: 'Andrew Tanenbaum', genre: 'Technology', isbn: '978003', totalQuantity: 3, availableQuantity: 3 },
  { id: 4, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', genre: 'Classic', isbn: '978004', totalQuantity: 0, availableQuantity: 0 }
];

function App() {
  const [books, setBooks] = useState(() => {
    try {
      const savedBooks = localStorage.getItem('libraryBooks');
      const loadedBooks = savedBooks ? JSON.parse(savedBooks) : initialBooks;

      return loadedBooks.map(book => ({
        ...book,
        totalQuantity: book.totalQuantity ?? book.quantity ?? 0,
        availableQuantity: book.availableQuantity ?? book.quantity ?? 0
      }));
    } catch {
      return initialBooks;
    }
  });

  const [transactions, setTransactions] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('libraryTransactions')) || [];
    } catch {
      return [];
    }
  });
  const [users, setUsers] = useState(() => {
  try {
    return JSON.parse(localStorage.getItem('libraryUsers')) || [];
  } catch {
    return [];
  }
});

  useEffect(() => {
    localStorage.setItem('libraryBooks', JSON.stringify(books));
  }, [books]);

  useEffect(() => {
    localStorage.setItem('libraryTransactions', JSON.stringify(transactions));
  }, [transactions]);
  useEffect(() => {
    localStorage.setItem('libraryUsers', JSON.stringify(users));
  }, [users]);

  const totalTitles = books.length;
  const totalCopies = books.reduce((sum, book) => sum + book.availableQuantity, 0);
  const lowStock = books.filter(book => book.availableQuantity < 2).length;

  return (
    <BrowserRouter>
      <div className="app">
        <aside className="sidebar">
          <h2>BookNest</h2>
          <p className="side-label">MAIN MENU</p>
          <Link className="nav-item" to="/">Dashboard</Link>
          <Link className="nav-item" to="/books">Book Management</Link>
          <Link className="nav-item" to="/transactions">Transactions</Link>
          <Link className="nav-item" to="/users">User Management</Link>
          <div className="sidebar-bottom">Library Management System</div>
        </aside>

        <main className="main-content">
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <header className="topbar">
                    <div>
                      <p className="eyebrow">LIBRARY MANAGEMENT</p>
                      <h1>Dashboard</h1>
                    </div>
                    <div className="admin-label">Administrator</div>
                  </header>

                  <section className="welcome">
                    <div>
                      <h2>Welcome to your library</h2>
                      <p>Manage your books and keep track of your inventory.</p>
                    </div>
                    <span className="book-icon">▤</span>
                  </section>

                  <section className="stats">
                    <article className="stat-card">
                      <span className="stat-icon">▤</span>
                      <p>Total Book Titles</p>
                      <h2>{totalTitles}</h2>
                    </article>
                    <article className="stat-card">
                      <span className="stat-icon">▥</span>
                      <p>Available Copies</p>
                      <h2>{totalCopies}</h2>
                    </article>
                    <article className="stat-card">
                      <span className="stat-icon warning">!</span>
                      <p>Low Stock Titles</p>
                      <h2>{lowStock}</h2>
                    </article>
                  </section>

                  <section className="inventory">
                    <div className="section-heading">
                      <div>
                        <h2>Book Inventory</h2>
                        <p>Overview of books currently registered in the system.</p>
                      </div>
                      <span className="book-count">{totalTitles} titles</span>
                    </div>

                    <div className="table-wrapper">
                      <table>
                        <thead>
                          <tr>
                            <th>BOOK TITLE</th>
                            <th>AUTHOR</th>
                            <th>GENRE</th>
                            <th>ISBN</th>
                            <th>AVAILABLE</th>
                            <th>STATUS</th>
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
                            </tr>
                          ))}
                          {books.length === 0 && (
                            <tr>
                              <td colSpan="6" className="empty-state">
                                No books have been added yet.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                    <p className="stock-note">Low stock means fewer than 2 copies available.</p>
                  </section>
                </>
              }
            />

            <Route
              path="/books"
              element={<Books books={books} setBooks={setBooks} />}
            />

            <Route
              path="/transactions"
              element={
                <Transactions
                  books={books}
                  setBooks={setBooks}
                  transactions={transactions}
                  setTransactions={setTransactions}
                />
              }
            />
            <Route
              path="/users"
              element={
                <Users
                  users={users}
                  setUsers={setUsers}
                />
              }
            />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
