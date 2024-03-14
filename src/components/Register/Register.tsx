import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './Register.css'


const Register: React.FC = () => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [alertmsg, setAlertmsg] = useState<string>("")
  const navigate = useNavigate();

  const handleOnSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if(name === "" || email === "" || password === ""){
        setAlertmsg("Fill in all the ceredentials")
    }else{
        const userData = { name, email, password };
    
        try {
          const response = await fetch(`https://invoice-generator-server-nmky.onrender.com/register`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
          });
          console.log(response)
          if (response.status === 201) {
            setEmail("");
            setName("");
            setPassword("")
            navigate("/login");
          }
    
          if(response.status === 403){ setAlertmsg("User Already Exists")}
          if (response.status === 400 || response.status === 500) {
            const responseData = await response.json();
            alert(responseData);
          }
        } catch (error) {
            console.log(error)
        }
    }
};

  return (
    <div className="registerForm">
      <label className="label" htmlFor="name">
        Name
      </label>
      <input
        type="text"
        className="name input"
        id="name"
        placeholder="Enter Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

      <label htmlFor="email" className="label">
        Email
      </label>
      <input
        type="text"
        className="email input"
        id="email"
        placeholder="Enter Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <label htmlFor="password" className="label">
        Password
      </label>
      <input
        type="password"
        className="password input"
        id="password"
        placeholder="Enter Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <button className="btn" type="submit" onClick={handleOnSubmit}>
        Register
      </button>
      <p className="alert">{alertmsg}</p>
      <p className="alert mssg">Already have an account? <a href="/login">Login</a></p>
    </div>
  );
  }

export default Register;
