/*
 * Custom component for the login page
 */
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { User, logIn, selectUser, logOut } from "../../store/User";
import "./Login.css";

const Login: React.FC = () => {
  const dispatch = useDispatch();
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const currentUser: User = useSelector(selectUser);

  // Function to handle the login button
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    dispatch(
      logIn({
        username: username,
        password: password,
      })
    );
  };

  React.useEffect(() => {
    // If the user is logged in, redirect to dashboard
    if (currentUser.status === "logged-in") {
      window.location.href = "/dashboard";
    }
    // Set status from failed to logged-out after a set amount of time
    else if (currentUser.status === "failed") {
      setTimeout(() => {
        dispatch(logOut());
      }, 5000);
    }
  }, [currentUser]);

  return (
    <div className="page">
      <form className="login-container" onSubmit={handleSubmit}>
        <h1 className="logo">Kite</h1>
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          name="username"
          onChange={(e) => setUsername(e.target.value)}
        />
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          name="password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" className="button">
          Login
        </button>
      </form>
      {currentUser.status === "failed" && (
        <div className="alert">
          <p>Incorrect username or password!</p>
        </div>
      )}
    </div>
  );
};

export default Login;
