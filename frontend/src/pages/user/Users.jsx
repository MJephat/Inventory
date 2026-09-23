import { useEffect, useState } from "react";
import {
  Users as UsersIcon,
  Plus,
  RefreshCw,
  Search,
  UserCheck,
  UserX,
} from "lucide-react";

import UserService from "../../services/userService";

export default function Users() {
  const [users, setUsers] = useState([]);

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showModal, setShowModal] =
    useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    try {
      setLoading(true);
      setError("");

      const response =
        await UserService.getUsers();

      setUsers(
        Array.isArray(response)
          ? response
          : response.data ?? []
      );
    } catch (error) {
      console.error(
        "Users error:",
        error
      );

      setError(
        error.response?.data?.detail ||
          "Failed to load users."
      );
    } finally {
      setLoading(false);
    }
  }

  const filteredUsers = users.filter(
    (user) => {
      const searchTerm =
        search.toLowerCase().trim();

      if (!searchTerm) {
        return true;
      }

      return (
        user.username
          ?.toLowerCase()
          .includes(searchTerm) ||
        user.email
          ?.toLowerCase()
          .includes(searchTerm) ||
        user.full_name
          ?.toLowerCase()
          .includes(searchTerm)
      );
    }
  );

  function getInitials(user) {
    if (user.full_name) {
      return user.full_name
        .split(" ")
        .map((name) =>
          name.charAt(0)
        )
        .join("")
        .slice(0, 2)
        .toUpperCase();
    }

    return (
      user.username
        ?.charAt(0)
        ?.toUpperCase() || "U"
    );
  }

  function handleAdd() {
    setShowModal(true);
  }

  function handleCloseModal() {
    setShowModal(false);
  }

  return (
    <div className="users-page">

      {/* Header */}
      <div className="users-header">
        <div>
          <h1>Users</h1>

          <p>
            Manage system users and their access.
          </p>
        </div>

        <button
          className="user-add-button"
          onClick={handleAdd}
        >
          <Plus size={17} />
          Add User
        </button>
      </div>

      {/* Toolbar */}
      <div className="users-toolbar">

        <div className="user-search">
          <Search size={17} />

          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
          />
        </div>

        <div className="user-toolbar-right">

          <span>
            {filteredUsers.length} users
          </span>

          <button
            className="secondary-button"
            onClick={loadUsers}
            disabled={loading}
          >
            <RefreshCw
              size={16}
              className={
                loading ? "spin" : ""
              }
            />

            Refresh
          </button>

        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="products-error">
          {error}
        </div>
      )}

      {/* Table */}
      <div className="users-card">

        {loading ? (
          <div className="products-loading">
            Loading users...
          </div>
        ) : filteredUsers.length === 0 ? (

          <div className="users-empty">
            <UsersIcon size={40} />

            <h3>
              {search
                ? "No users found"
                : "No users yet"}
            </h3>

            <p>
              {search
                ? "Try a different search term."
                : "Create your first system user."}
            </p>

            {!search && (
              <button
                className="user-add-button"
                onClick={handleAdd}
              >
                <Plus size={16} />
                Add User
              </button>
            )}
          </div>

        ) : (

          <div className="table-wrapper">

            <table className="users-table">

              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Created</th>
                </tr>
              </thead>

              <tbody>

                {filteredUsers.map(
                  (user) => (

                    <tr key={user.id}>

                      {/* User */}
                      <td>
                        <div className="user-table-info">

                          <div className="user-table-avatar">
                            {getInitials(user)}
                          </div>

                          <div>

                            <strong>
                              {user.full_name}
                            </strong>

                            <span>
                              @{user.username}
                            </span>

                          </div>

                        </div>
                      </td>

                      {/* Email */}
                      <td>
                        {user.email}
                      </td>

                      {/* Role */}
                      <td>
                        <div className="user-roles">

                          {user.roles?.length ? (

                            user.roles.map(
                              (role) => (

                                <span
                                  key={role.id}
                                  className="user-role-badge"
                                >
                                  {role.name}
                                </span>

                              )
                            )

                          ) : (

                            <span className="no-role">
                              No role
                            </span>

                          )}

                        </div>
                      </td>

                      {/* Status */}
                      <td>

                        {user.is_active ? (

                          <span className="user-status user-status-active">
                            <UserCheck size={13} />
                            Active
                          </span>

                        ) : (

                          <span className="user-status user-status-inactive">
                            <UserX size={13} />
                            Inactive
                          </span>

                        )}

                      </td>

                      {/* Created */}
                      <td>
                        {user.created_at
                          ? new Date(
                              user.created_at
                            ).toLocaleDateString()
                          : "-"}
                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        )}

      </div>

      {/* Add User Modal */}
      {showModal && (
        <UserModal
          onClose={handleCloseModal}
          onSuccess={async () => {
            handleCloseModal();
            await loadUsers();
          }}
        />
      )}

    </div>
  );
}


function UserModal({
  onClose,
  onSuccess,
}) {

  const [form, setForm] = useState({
    username: "",
    email: "",
    full_name: "",
    password: "",
    role: "USER",
  });

  const [submitting, setSubmitting] =
    useState(false);

  const [error, setError] =
    useState("");

  function handleChange(event) {
    const { name, value } =
      event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");

    if (!form.username.trim()) {
      setError(
        "Username is required."
      );
      return;
    }

    if (!form.email.trim()) {
      setError(
        "Email is required."
      );
      return;
    }

    if (!form.full_name.trim()) {
      setError(
        "Full name is required."
      );
      return;
    }

    if (!form.password) {
      setError(
        "Password is required."
      );
      return;
    }

    try {
      setSubmitting(true);

      await UserService.createUser({
        username:
          form.username.trim(),

        email:
          form.email.trim(),

        full_name:
          form.full_name.trim(),

        password:
          form.password,

        role:
          form.role,
      });

      await onSuccess();

    } catch (error) {

      console.error(
        "Create user error:",
        error
      );

      setError(
        error.response?.data?.detail ||
          "Failed to create user."
      );

    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="user-modal-overlay">

      <div className="user-modal">

        <div className="user-modal-header">

          <div>
            <h2>
              Add User
            </h2>

            <p>
              Create a new system user.
            </p>
          </div>

          <button
            className="user-modal-close"
            onClick={onClose}
            disabled={submitting}
          >
            ×
          </button>

        </div>

        <form
          className="user-modal-form"
          onSubmit={handleSubmit}
        >

          {error && (
            <div className="inventory-modal-error">
              {error}
            </div>
          )}

          {/* Username */}
          <div className="form-group">

            <label>
              Username <span>*</span>
            </label>

            <input
              name="username"
              type="text"
              value={form.username}
              onChange={handleChange}
              placeholder="e.g. john"
              disabled={submitting}
              required
            />

          </div>

          {/* Full name */}
          <div className="form-group">

            <label>
              Full Name <span>*</span>
            </label>

            <input
              name="full_name"
              type="text"
              value={form.full_name}
              onChange={handleChange}
              placeholder="e.g. John Doe"
              disabled={submitting}
              required
            />

          </div>

          {/* Email */}
          <div className="form-group">

            <label>
              Email <span>*</span>
            </label>

            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="john@example.com"
              disabled={submitting}
              required
            />

          </div>

          {/* Password */}
          <div className="form-group">

            <label>
              Password <span>*</span>
            </label>

            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter password"
              disabled={submitting}
              required
            />

          </div>

          {/* Role */}
          <div className="form-group">

            <label>
              Role <span>*</span>
            </label>

            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              disabled={submitting}
            >
              <option value="USER">
                USER
              </option>

              <option value="ADMIN">
                ADMIN
              </option>
            </select>

          </div>

          {/* Actions */}
          <div className="user-modal-actions">

            <button
              type="button"
              className="modal-cancel-button"
              onClick={onClose}
              disabled={submitting}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="modal-submit-button"
              disabled={submitting}
            >
              {submitting
                ? "Creating..."
                : "Create User"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}