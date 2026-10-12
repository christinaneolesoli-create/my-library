
import { useState } from 'react';
import '../App.css';

export default function Transactions({ books, setBooks, transactions, setTransactions }) {
  const [borrower, setBorrower] = useState('');
  const [bookId, setBookId] = useState('');

  const availableBooks = books.filter(book => book.availableQuantity > 0);

  function borrowBook(e) {
    e.preventDefault();

    if (!borrower.trim() || !bookId) {
      alert('Enter the borrower name and select a book.');
      return;
    }

    const selectedBook = books.find(book => book.id === Number(bookId));

    if (!selectedBook || selectedBook.availableQuantity < 1) {
      alert('This book is not available.');
      return;
    }

    const transaction = {
      id: Date.now(),
      bookId: selectedBook.id,
      bookTitle: selectedBook.title,
      borrower: borrower.trim(),
      borrowDate: new Date().toLocaleDateString(),
      returnDate: '',
      status: 'Borrowed'
    };

    setBooks(currentBooks =>
      currentBooks.map(book =>
        book.id === selectedBook.id
          ? { ...book, availableQuantity: book.availableQuantity - 1 }
          : book
      )
    );

    setTransactions(currentTransactions => [
      transaction,
      ...currentTransactions
    ]);

    setBorrower('');
    setBookId('');
  }

  function returnBook(transaction) {
    if (transaction.status === 'Returned') return;

    setBooks(currentBooks =>
      currentBooks.map(book =>
        book.id === transaction.bookId
          ? {
              ...book,
              availableQuantity: Math.min(
                book.totalQuantity,
                book.availableQuantity + 1
              )
            }
          : book
      )
    );

    setTransactions(currentTransactions =>
      currentTransactions.map(item =>
        item.id === transaction.id
          ? {
              ...item,
              status: 'Returned',
              returnDate: new Date().toLocaleDateString()
            }
          : item
      )
    );
  }

  return (
    <div className="page">
      <h1>Transactions</h1>
      <p>Borrow books and manage returned books.</p>

      <section className="transaction-form">
        <h2>Borrow a Book</h2>

        <form onSubmit={borrowBook}>
          <label>Borrower Name</label>
          <input
            type="text"
            value={borrower}
            onChange={e => setBorrower(e.target.value)}
            placeholder="Enter borrower's name"
            required
          />

          <label>Select Book</label>
          <select
            value={bookId}
            onChange={e => setBookId(e.target.value)}
            required
          >
            <option value="">Choose a book</option>
            {availableBooks.map(book => (
              <option key={book.id} value={book.id}>
                {book.title} ({book.availableQuantity} available)
              </option>
            ))}
          </select>

          <button type="submit" disabled={availableBooks.length === 0}>
            Borrow Book
          </button>

          {availableBooks.length === 0 && (
            <p>No books are currently available to borrow.</p>
          )}
        </form>
      </section>

      <section className="transaction-history">
        <h2>Transaction History</h2>

        {transactions.length === 0 ? (
          <p>No transactions recorded yet.</p>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Book</th>
                  <th>Borrower</th>
                  <th>Borrow Date</th>
                  <th>Return Date</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map(transaction => (
                  <tr key={transaction.id}>
                    <td>{transaction.bookTitle}</td>
                    <td>{transaction.borrower}</td>
                    <td>{transaction.borrowDate}</td>
                    <td>{transaction.returnDate || '-'}</td>
                    <td>{transaction.status}</td>
                    <td>
                      {transaction.status === 'Borrowed' ? (
                        <button onClick={() => returnBook(transaction)}>
                          Return Book
                        </button>
                      ) : (
                        'Completed'
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
