import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx"
import { auth } from "../firebase/auth.js";
import { signOut } from "firebase/auth";
import Button from "./Button.jsx";

function Header(){
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const handleLogout = async() =>{
        try {
            await signOut(auth);
            navigate('/login')
        } catch (error) {
            console.error('Error signing out:', error)
        }
    }
    return(
       <header className="bg-white shadow-sm">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-3">
          <h1 className="text-xl font-bold text-gray-900">My To-Do App</h1>
          <div className="flex items-center space-x-4">
            <p className="text-sm text-gray-600 hidden sm:block">{currentUser?.email}</p>
            <Button onClick={handleLogout} className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-600">
              Logout
            </Button>
          </div>
        </div>
      </div>
    </header>
    )
}
export default Header;
