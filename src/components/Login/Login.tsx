import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "../../state";
import { useNavigate } from "react-router-dom";
import '../Register/Register.css'

const Login = () => {

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [alertmsg, setAlertmsg] = useState<string>("")
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleOnSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if( email === "" || password === ""){
        setAlertmsg("Fill in all the ceredentials")
    }else{
        const userData = { email, password };
    
        try {
          const response = await fetch(`https://invoice-generator-server-nmky.onrender.com/login`, { 
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
          });
          if (response.status === 200) {
            const user = await response.json();
            dispatch(setUser(user._id));
            setEmail("");
            setPassword("")
            navigate("/invoice");
          }
    
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
        Login
      </button>
      <p className="alert">{alertmsg}</p>
      <p className="alert mssg">Does not have an account? <a href="/">Create account</a></p>
    </div>
  )
}

export default Login
