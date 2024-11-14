import React, { useState, useEffect } from 'react';
import './Usermanagement.css';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState({ name: '', password: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [message, setMessage] = useState(''); // State to hold success message

  useEffect(() => {
    // Fetch existing users from the backend when the component mounts
    const fetchUsers = async () => {
      const response = await fetch('http://localhost:5000/users');
      if (response.ok) {
        const data = await response.json();
        setUsers(data); // Assuming the response returns an array of users
      }
    };
    fetchUsers();
  }, []);

  const handleInputChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
  
    // Check if required fields are filled
    if (!user.name || !user.password) {
      setMessage('Please fill in all fields.');
      return;
    }
  
    try {
      const response = await fetch('http://localhost:5000/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
      });
  
      if (response.ok) {
        const newUser = await response.json();
        setUsers([...users, newUser]); // Add new user to the list
        setUser({ name: '', password: '' }); // Clear input fields
        setMessage('User added successfully');
        
        // Hide success message after 3 seconds
        setTimeout(() => {
          setMessage('');
        }, 3000);
      } else {
        setMessage('Error adding user');
      }
    } catch (error) {
      setMessage('Error adding user: ' + error.message);
    }
  };
  

  const deleteUser = async (id) => {
    const response = await fetch(`http://localhost:5000/users/${id}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      setUsers(users.filter(user => user.id !== id)); // Assuming each user has a unique ID
      setMessage('User deleted successfully');
    } else {
      setMessage('Error deleting user');
    }
  };

  const editUser = (index) => {
    const userToEdit = users[index];
    setUser({ name: userToEdit.name, password: '' });
    setIsEditing(true);
    setCurrentUserId(userToEdit.id); 
  };
  
  const handleUpdateUser = async (e) => {
    e.preventDefault();
  
    // Check if required fields are filled
    if (!user.name || !user.password) {
      setMessage('Please fill in all fields.');
      return;
    }
  
    try {
      const response = await fetch(`http://localhost:5000/users/${currentUserId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
      });
  
      if (response.ok) {
        const updatedUser = await response.json();
        
        // Update user in the list
        setUsers(users.map(u => (u.id === currentUserId ? { ...u, ...updatedUser } : u)));
        
        // Clear the form and reset states
        setUser({ name: '', password: '' });
        setIsEditing(false);
        setCurrentUserId(null);
        setMessage('User updated successfully');
  
        // Hide success message after 3 seconds
        setTimeout(() => {
          setMessage('');
        }, 3000);
      } else {
        const errorData = await response.json();
        setMessage(errorData.message || 'Error updating user');
      }
    } catch (error) {
      setMessage('Error updating user: ' + error.message);
    }
  };
  

  return (
    <div className="user-management">
      <h2>User Management</h2>

      {message && <p className="success-message">{message}</p>} {/* Display success message */}

      <form onSubmit={isEditing ? handleUpdateUser : handleAddUser}>
        <input
          type="text"
          name="name"
          placeholder="User Name"
          value={user.name}
          onChange={handleInputChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="User Password"
          value={user.password}
          onChange={handleInputChange}
          required
        />
        <button type="submit">{isEditing ? 'Update User' : 'Add User'}</button>
      </form>

      <h3>Current Users</h3>
      <ul>
        {users.map((u, index) => (
          <li key={u.id}>
            {u.name} ({u.password ? '' : 'Password'}){' '}
            <button className="edit-button" onClick={() => editUser(index)}>Edit</button>
            <button className="delete-button" onClick={() => deleteUser(u.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserManagement;