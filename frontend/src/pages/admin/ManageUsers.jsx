function ManageUsers() {
  const users = [
    { id: 1, username: "student1", role: "student" },
    { id: 2, username: "teacher1", role: "teacher" },
    { id: 3, username: "admin", role: "admin" },
  ];

  return (
    <div className="page">
      <h1>Manage Users</h1>

      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.username}</td>
              <td>{user.role}</td>
              <td>
                <button>Edit</button>{" "}
                <button>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ManageUsers;