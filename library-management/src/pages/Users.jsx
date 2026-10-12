import { useState } from 'react';
import '../App.css';

const emptyUser = {
  name: '',
  email: '',
  phone: ''
};

export default function Users({ users, setUsers }) {
  const [formData, setFormData] = useState(emptyUser);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData(current => ({ ...current, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    setError('');

    const name = formData.name.trim();
    const email = formData.email.trim().toLowerCase();
    const phone = formData.phone.trim();

    if (!name || !email || !phone) {
      setError('Please complete all fields.');
      return;
    }

    const emailExists = users.some(
      user =>
        user.email.toLowerCase() === email &&
        user.id !== editingId
    );

    if (emailExists) {
      setError('A user with this email already exists.');
      return;
    }

    const userData = { name, email, phone };

    if (editingId !== null) {
      setUsers(current =>
        current.map(user =>
          user.id === editingId
            ? { ...user, ...userData }
            : user
        )
      );
    } else {
      setUsers(current => [
        ...current,
        { id: Date.now(), ...userData }
      ]);
    }

    setFormData(emptyUser);
    setEditingId(null);
    setError('');
  }

  function editUser(user) {
    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone
    });
    setEditingId(user.id);
    setError('');
  }

  function deleteUser(id) {
    setUsers(current => current.filter(user => user.id !== id));

    if (editingId === id) {
      setFormData(emptyUser);
      setEditingId(null);
    }
  }

  function cancelEdit() {
    setFormData(emptyUser);
    setEditingId(null);
    setError('');
  }

  return (
    <div className="page">
      <header className="topbar">
        <div>
          <p className="eyebrow">LIBRARY MANAGEMENT</p>
          <h1>User Management</h1>
        </div>
        <div className="admin-label">{users.length} users</div>
      </header>

      <section className="user-form">
        <h2>{editingId !== null ? 'Edit User' : 'Register User'}</h2>

        <form onSubmit={handleSubmit}>
          <label htmlFor="name">Full Name</label>
          <input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter full name"
            required
          />

          <label htmlFor="email">Email Address</label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter email address"
            required
          />

          <label htmlFor="phone">Phone Number</label>
          <input
            id="phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Enter phone number"
            required
          />

          {error && <p className="user-error">{error}</p>}

          <div className="user-form-actions">
            <button type="submit">
              {editingId !== null ? 'Save Changes' : 'Register User'}
            </button>

            {editingId !== null && (
              <button type="button" onClick={cancelEdit}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="user-list">
        <h2>Registered Users</h2>

        {users.length === 0 ? (
          <p>No users registered yet.</p>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>FULL NAME</th>
                  <th>EMAIL</th>
                  <th>PHONE</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.phone}</td>
                    <td>
                      <button type="button" onClick={() => editUser(user)}>
                        Edit
                      </button>{' '}
                      <button type="button" onClick={() => deleteUser(user.id)}>
                        Delete
                      </button>
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
