import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { RouterProvider } from 'react-router-dom'
import { createBrowserRouter } from 'react-router-dom'
import Signup from './pages/Signup.jsx'
import Login from './pages/Login.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import Todo from './pages/Todo.jsx'
const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children:[
            {
                index: true,
                element: <Signup />,
            },
            {
                path: '/login',
                element: <Login />,
            },
            {
                path:'/todo',
                element: <ProtectedRoute>
                    <Todo/>
                </ProtectedRoute>

            }
        ]
    }
])

createRoot(document.getElementById('root')).render(

    <AuthProvider>
    <RouterProvider router={router}/>
    </AuthProvider>
 
)
