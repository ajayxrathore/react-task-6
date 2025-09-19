import { useState } from "react";
import Input from "../components/Input.jsx";
import Button from "../components/Button.jsx";
import { auth } from "../firebase/auth.js";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { db } from "../firebase/firestore.js";
import { setDoc, doc } from "firebase/firestore";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const userPassword = password;

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log("User created successfully:", userCredential.user);

      const user = userCredential.user;
      let ipAddress = "not_found";
      try {
        const response = await fetch("https://api.ipify.org?format=json");
        const data = await response.json();
        ipAddress = data.ip;
      } catch (ipError) {
        console.error("Could not fetch IP address", ipError);
      }
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        password: userPassword,
        email: user.email,
        createdAt: new Date(), // Signup time
        ipAddress: ipAddress,
      });

      navigate("/todo");
    } catch (error) {
      setError(error.message);
      console.error("Error creating user:", error);
    }
  };
  return (
    <>
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-center">Create an Account</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Email Address"
              id="email"
              type="email"
              name="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              label="Password"
              id="password"
              type="password"
              name="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {error && <p className="text-sm text-red-600">{error}</p>}
            <div>
              <Button type="submit">Sign up</Button>
            </div>
          </form>
          <div>
            <p className="text-sm text-center">
              Already have an account?{" "}
              <Link to="/login" className="text-blue-500">
                Login{" "}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Signup;
