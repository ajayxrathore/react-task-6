import  { useState } from "react";
import { auth } from "../firebase/auth.js";
import { useNavigate } from "react-router-dom";
import Input from "../components/Input.jsx";
import Button from "../components/Button.jsx";
import { signInWithEmailAndPassword } from "firebase/auth";
function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const handleSubmit = async(e) => {
    e.preventDefault();
    setError('')
    try {
        const loggedinUser = await signInWithEmailAndPassword(auth, email, password)
        console.log('User logged in successfully:', loggedinUser.user)
        navigate('/todo')
    } catch (error) {
        setError(error.message)
        console.error('Error logging in:', error)
    }

  };
  return (
    <>
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-center">Login</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
            label='Email Address'
            id='email'
            type='email'
            name='email'
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            />
            <Input
            label='Password'
            id='password'
            type='password'
            name='password'
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            />
            {error && <p className="text-sm text-red-600">{error}</p>}
            <div>
               <Button
            type='submit'
            >
                Login
                </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Login;
