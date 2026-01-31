import { useEffect, useState } from "react";

function ManageCourses() {
  const [courses, setCourses] = useState([]);
  const [teacher, setTeachers] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
  const fetchCourses = async () => {
    try {
      const token = localStorage.getItem("access");

      if (!token) {
        alert("No token found. Please login again.");
        return;
      }

      const response = await fetch(
        "http://127.0.0.1:8000/api/courses/admin/courses",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 401) {
        alert("Unauthorized - Admin access required");
        return;
      }

      const data = await response.json();
      setCourses(data);
    } catch (error) {
      console.error("Error loading courses:", error);
      alert("Failed to load courses");
    }
  };

  fetchCourses();
}, []);



  useEffect(() => {
  const token = localStorage.getItem("access");
  if (!token) return;

  fetch("http://127.0.0.1:8000/api/users/admin/users/", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => res.json())
    .then((data) => {
      const onlyTeachers = data.filter((u) => u.role === "teacher");
      setTeachers(onlyTeachers);
    })
    .catch(() => {});
}, []);

  const handleDelete = async (courseId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this course?"
    );

    if (!confirmDelete) return;

    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/courses/admin/courses/${courseId}/delete`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access")}`,
          },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Delete failed");
        return;
      }

      setCourses(courses.filter((c) => c.id !== courseId));
      alert("Course deleted successfully");
    } catch {
      alert("Server error");
    }
  };

  const handleAssignTeacher = async (courseId, teacherId) => {
  if (!teacherId) return;

  try {
    const res = await fetch(
      `http://127.0.0.1:8000/api/courses/admin/courses/${courseId}/assign-teacher`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ teacher_id: teacherId }),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Failed to assign teacher");
      return;
    }

    // Update UI
    setCourses(
      courses.map((c) =>
        c.id === courseId
          ? {
              ...c,
              instructor:
                teacher.find((t) => teacher.id === Number(teacherId))?.username ||
                c.instructor,
            }
          : c
      )
    );

    alert("Teacher assigned successfully");
  } catch {
    alert("Server error");
  }
};

  return (
    <div className="page">
      <h1>Manage Courses</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {!error && (
        <table border="1" cellPadding="10">
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Instructor</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr key={course.id}>
                <td>{course.id}</td>
                <td>{course.title}</td>
                <td>
  <div>
    <div>{course.instructor || "Not assigned"}</div>

    <select
      defaultValue=""
      onChange={(e) =>
        handleAssignTeacher(course.id, e.target.value)
      }
    >
      <option value="">Assign teacher</option>
      {teacher.map((t) => (
        <option key={t.id} value={t.id}>
          {teacher.username}
        </option>
      ))}
    </select>
  </div>
</td>
                <td>
                  <button onClick={() => handleDelete(course.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default ManageCourses;