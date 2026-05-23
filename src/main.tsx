import { createRoot } from 'react-dom/client'
import { AuthProvider } from "@/context/AuthContext";
import { AdminAuthProvider } from './context/AdminAuthContext.tsx';
import App from './App.tsx'
import './index.css'

createRoot(document.getElementById("root")!).render(

    <AuthProvider>
        <AdminAuthProvider>
            <App />
        </AdminAuthProvider>
    </AuthProvider>
);
