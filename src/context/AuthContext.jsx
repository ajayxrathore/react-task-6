import { createContext, useContext, useState, useEffect } from "react";
import { onAuthStateChanged,setPersistence, browserLocalPersistence } from "firebase/auth";
import { auth } from "../firebase/auth.js";

const AuthContext = createContext();

export function AuthProvider({children}) {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        setPersistence(auth, browserLocalPersistence).then(()=>{
      const unsubscribe = onAuthStateChanged(auth, (user)=>{
        setCurrentUser(user);
        setLoading(false)
      });
      return unsubscribe;
      }).catch((error) => {
        console.log('Persistence failed:', error);
      })
    }, [])
    const value = { currentUser , loading};
    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    return useContext(AuthContext);
}
