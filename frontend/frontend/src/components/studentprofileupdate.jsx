import { useState, useEffect } from "react";

export default function StudentProfile() {
  const [form, setForm] = useState({
    name: "",
    studentId: "",
    email: "",
    phone: "",
    department: "",
    year: "",
    address: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // 1. Fetch existing student data from your backend when component loads
  // (Change '1' to the actual logged-in student ID or prop/session variable)
  const currentStudentId = 1; 

  useEffect(() => {
    fetch(`http://localhost:5000/api/students/${currentStudentId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          setForm({
            name: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
            studentId: data.student_id || "",
            email: data.email || "",
            phone: data.contact || "",
            department: data.course || "",
            year: data.duration ? `${data.duration} Year` : "",
            address: data.address || "",
          });
        }
      })
      .catch((err) => console.error("Error fetching student profile:", err));
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
    setMessage("");
  };

  // 2. Update handleSubmit to send a PUT request to your backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    // Split name into first and last name for your database columns
    const nameParts = form.name.split(" ");
    const first_name = nameParts[0] || "";
    const last_name = nameParts.slice(1).join(" ") || "";

    const payload = {
      first_name,
      last_name,
      contact: form.phone,
      course: form.department,
      duration: parseInt(form.year) || 3, // mapping year to duration
      enrollment_date: new Date().toISOString().split('T')[0], // default current date if not tracked
    };

    try {
      const response = await fetch(`http://localhost:5000/api/students/${currentStudentId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage("Profile updated successfully in database!");
      } else {
        setMessage(result.message || "Failed to update profile.");
      }
    } catch (err) {
      console.error("Connection error:", err);
      setMessage("Server connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle =
    "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-700 to-slate-900 p-4 md:p-8">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-2xl bg-white shadow-2xl">

        {/* Header */}
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 p-5">
          <div>
            <h1 className="text-2xl font-bold text-blue-700">
              🎓 AttendEase
            </h1>
            <p className="text-sm text-gray-500">
              Student Attendance Management System
            </p>
          </div>
          <span className="rounded-full bg-blue-50 px-4 py-2 text-sm text-blue-700">
            Student Portal
          </span>
        </header>

        <div className="md:grid md:grid-cols-[240px_1fr]">

          {/* Sidebar */}
          <aside className="bg-slate-900 p-5 text-white md:p-6">
            <p className="mb-6 text-xs font-semibold uppercase tracking-widest text-slate-400">
              Main Menu
            </p>

            <nav className="space-y-3">
              <a href="/" className="block rounded-xl p-3 hover:bg-slate-700">
                ▦ Dashboard
              </a>

              <a href="/attendance" className="block rounded-xl p-3 hover:bg-slate-700">
                ✓ Mark Attendance
              </a>

              <a href="/student-profile" className="block rounded-xl bg-blue-600 p-3 font-semibold">
                ♙ Student Profile Update
              </a>

              <a href="/reports" className="block rounded-xl p-3 hover:bg-slate-700">
                ▤ Reports
              </a>
            </nav>

            <button
              type="button"
              onClick={() => (window.location.href = "/")}
              className="mt-8 w-full rounded-xl bg-slate-700 p-3 hover:bg-slate-600"
            >
              ↪ Logout
            </button>
          </aside>

          {/* Main Content */}
          <main className="bg-gray-50 p-5 md:p-10">
            <h2 className="text-3xl font-bold text-gray-800">
              Student Profile Update
            </h2>

            <p className="mb-8 mt-2 text-gray-500">
              Enter your personal and academic details below.
            </p>

            {/* Profile Icon */}
            <div className="mb-8 flex items-center gap-4 rounded-xl border border-blue-100 bg-blue-50 p-5">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-3xl text-white">
                ♙
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Student Profile
                </h3>
                <p className="text-sm text-gray-500">
                  Personal Information
                </p>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit}>
              <div className="grid gap-5 sm:grid-cols-2">

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Full Name
                  </label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className={inputStyle}
                    placeholder="Enter full name"
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Student ID
                  </label>
                  <input
                    name="studentId"
                    value={form.studentId}
                    onChange={handleChange}
                    className={inputStyle}
                    placeholder="Enter student ID"
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className={inputStyle}
                    placeholder="Enter email address"
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    className={inputStyle}
                    placeholder="Enter phone number"
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Department
                  </label>
                  <select
                    name="department"
                    value={form.department}
                    onChange={handleChange}
                    className={inputStyle}
                    required
                  >
                    <option value="">Select Department</option>
                    <option value="BCA">BCA</option>
                    <option value="BSc Computer Science">
                      BSc Computer Science
                    </option>
                    <option value="BCom">BCom</option>
                    <option value="BBA">BBA</option>
                    <option value="BA">BA</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Academic Year
                  </label>
                  <select
                    name="year"
                    value={form.year}
                    onChange={handleChange}
                    className={inputStyle}
                    required
                  >
                    <option value="">Select Academic Year</option>
                    <option value="First Year">First Year</option>
                    <option value="Second Year">Second Year</option>
                    <option value="Final Year">Final Year</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Address
                  </label>
                  <textarea
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    className={inputStyle}
                    placeholder="Enter your address"
                    rows={3}
                    required
                  />
                </div>
              </div>

              {message && (
                <p className="mt-5 rounded-xl bg-green-50 p-4 text-green-700">
                  ✓ {message}
                </p>
              )}

              <div className="mt-8 flex flex-wrap gap-3 border-t border-gray-200 pt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-xl bg-blue-600 px-7 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? "Saving..." : "Save Changes →"}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setForm({
                      name: "",
                      studentId: "",
                      email: "",
                      phone: "",
                      department: "",
                      year: "",
                      address: "",
                    });
                    setMessage("");
                  }}
                  className="rounded-xl border border-gray-300 bg-white px-7 py-3 font-semibold text-gray-700 hover:bg-gray-100"
                >
                  Clear Form
                </button>
              </div>
            </form>
          </main>
        </div>
      </div>
    </div>
  );
}