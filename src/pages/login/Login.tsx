import React from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { logIn, selectUser } from "../../types/UserSlice";
import "./Login.css";

// Component for the login page
const Login: React.FC = () => {
  const dispatch = useAppDispatch();

  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const currentUser = useAppSelector(selectUser);

  // Function to handle the login button
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    dispatch(logIn(username));
    console.log(currentUser);
  };

  return (
    <div className="page">
      <form className="login-container" onSubmit={handleSubmit}>
        <h1 className="logo">Kite</h1>
        <label htmlFor="username">Username:</label>
        <input type="text" name="username" onChange={(e) => setUsername(e.target.value)} />
        <label htmlFor="password">Password:</label>
        <input type="password" name="password" onChange={(e) => setPassword(e.target.value)}/>
        <button type="submit" className="button">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
