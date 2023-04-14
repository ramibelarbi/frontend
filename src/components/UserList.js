import React from 'react';

function UserList({ users }) {
  return (
    <div>
      {users.map((user) => (
        <div key={user.id}>
          <h2>{user.firstname}</h2>
          <p>Email: {user.email}</p>
        </div>
      ))}
    </div>
  );
}

export default UserList;
