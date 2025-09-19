import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

function ProtectedRoute({children}) {
    const { currentUser , loading} = useAuth();
    if(loading){
        return (<div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="flex flex-col items-center">
        {/* <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div> */}
        <p className="mt-4 text-gray-700 text-lg font-semibold animate-pulse">Loading...</p>
      </div>
    </div>)
    }
    if(!currentUser){
        return <Navigate to="/login" />;
    }
    return children;
}
export default ProtectedRoute;
