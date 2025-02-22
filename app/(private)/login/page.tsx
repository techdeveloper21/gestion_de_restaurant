"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { setUser } from "@/redux/slices/authSlice";
import { useDispatch } from "react-redux";

import "./login.css";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const dispatch = useDispatch();

  const handleLogin = async () => {
    if (username === "admin" && password === "1234") {
      const user = { username, role: "admin" };

      dispatch(setUser(user));
      document.cookie = `token=validToken; path=/;`;
      localStorage.setItem("user", JSON.stringify(user));

      router.push("/admin");
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="container login-container">
        <div className="login-form-presnetation">
            <div className="login-from-inputs">
                <div className="login-title">
                    <h2>Admin Login</h2>
                </div>
                <div className="login-inputs">
                    <div className="form-groupe">
                        <input className="input-group-text" type="text" placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
                    </div>
                    <div className="form-groupe">
                        <input className="input-group-text" type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <div className="form-groupe">
                        <button className="btn btn-success btn-login" onClick={handleLogin}>
                            <i className="fa-solid fa-check"></i>
                            Login
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
}
