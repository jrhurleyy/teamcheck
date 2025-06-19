import React, { useState } from "react";
import "./LoginModal.css";

const LoginModal = ({ users, onLogin, isOpen }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Check if username exists in users data
    const user = users.find(
      (u) =>
        u.name.toLowerCase() === username.toLowerCase() ||
        u.email?.toLowerCase() === username.toLowerCase()
    );

    if (!user) {
      setError("Username not found. Please check your username.");
      setIsLoading(false);
      return;
    }

    // Simulate authentication delay
    setTimeout(() => {
      if (password.length > 0) {
        // Any password is accepted (dummy authentication)
        onLogin(user);
      } else {
        setError("Please enter a password.");
      }
      setIsLoading(false);
    }, 500);
  };

  if (!isOpen) return null;

  return (
    <div className="login-modal-overlay">
      <div className="login-modal">
        <div className="login-header">
          <h2>TeamCheck Login</h2>
          <p>Please sign in to view team status</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              required
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              disabled={isLoading}
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="login-button" disabled={isLoading}>
            {isLoading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;
