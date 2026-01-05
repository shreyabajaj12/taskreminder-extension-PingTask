import React, { useState } from "react";
import { supabase } from "../supabase-client";

const Login = () => {
  const [info, setInfo] = useState({
    email: "",
    password: ""
  });

  // false = Sign Up, true = Sign In
  const [login, setLogin] = useState(false);

  // Error states
  const [ema, setEma] = useState(false);       // email error
  const [pass, setPass] = useState(false);     // password error
  const [userExists, setUserExists] = useState(false);
  const [ep, setEp] = useState(false);         // auth error

  // Email validation
  const validateEmail = (email) =>
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      .test(email);

  const handleChange = (e) => {
    setInfo({ ...info, [e.target.name]: e.target.value });
  };

  const auth = async () => {
    // Reset errors
    setEma(false);
    setPass(false);
    setUserExists(false);
    setEp(false);

    // Empty checks
    if (!info.email || !info.password) {
      if (!info.email) setEma(true);
      if (!info.password) setPass(true);
      return;
    }

    // Password length
    if (info.password.length < 6) {
      setPass(true);
      return;
    }

    // Email format
    if (!validateEmail(info.email)) {
      setEma(true);
      return;
    }

    // SIGN UP
    if (!login) {
      const { error } = await supabase.auth.signUp({
        email: info.email,
        password: info.password
      });

      if (error) {
        setUserExists(true);
        return;
      }
    }
    // SIGN IN
    else {
      const { error } = await supabase.auth.signInWithPassword({
        email: info.email,
        password: info.password
      });

      if (error) {
        setEp(true);
        return;
      }
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="bg-black text-gray-300 w-80 h-96 p-4">

        <h2 className="text-center text-lg mb-4">
          {login ? "Sign In" : "Sign Up"}
        </h2>

        {/* EMAIL */}
        <div className="mb-3">
          <label className="text-sm">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            name="email"
            type="email"
            value={info.email}
            onChange={handleChange}
            className="w-full p-2 mt-1 rounded text-gray-200"
            placeholder="Enter email"
          />

          <p className="text-[11px] text-red-500 mt-1">
            {ema && "Invalid or empty email"}
            {userExists && !login && "User already exists"}
            {ep && login && "Invalid email or password"}
          </p>
        </div>

        {/* PASSWORD */}
        <div className="mb-3">
          <label className="text-sm">
            Password <span className="text-red-500">*</span>
          </label>
          <input
            name="password"
            type="password"
            value={info.password}
            onChange={handleChange}
            className="w-full p-2 mt-1 rounded text-gray-200"
            placeholder="Enter password"
          />

          <p className="text-[11px] text-red-500 mt-1">
            {pass && "Password must be at least 6 characters"}
            {ep && login && "Invalid email or password"}
          </p>
        </div>

        {/* TOGGLE */}
        <div className="text-sm mt-2">
          {login ? "Create new account?" : "Already have an account?"}
          <span
            className="text-blue-400 cursor-pointer ml-1"
            onClick={() => {
              setLogin(!login);
              setInfo({ email: "", password: "" });
              setEma(false);
              setPass(false);
              setUserExists(false);
              setEp(false);
            }}
          >
            {login ? "Sign Up" : "Sign In"}
          </span>
        </div>

        {/* SUBMIT */}
        <button
          onClick={auth}
          className="cursor-pointer w-full bg-gray-200 text-black rounded mt-4 h-8"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default Login;
