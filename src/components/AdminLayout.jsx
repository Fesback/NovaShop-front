import React, { useEffect, useState } from 'react';
import AdminSidebar from '../components/AdminSidebar'; 
import { Outlet, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import "../styles/AdminPanel.css"

function AdminLayout() {

    const [nombre, setNombre] = useState("");
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const decoded = jwtDecode(token);
                const correo = decoded.sub || "admin@correo.com";
                const nombreExtraido = correo.split("@")[0]; // saca la parte antes del @
                const nombreFormateado = nombreExtraido.charAt(0).toUpperCase() + nombreExtraido.slice(1); 
                setNombre(decoded.nombre || nombreFormateado);
            } catch (error) {
                console.error("Token inválido", error);
                navigate("/login");
            }
        } else {
            navigate("/login");
        }
    }, [navigate]);

    return (
        <div className="admin-dashboard">
            <AdminSidebar 
            nombre={nombre}
            sidebarCollapsed={sidebarCollapsed}
            setSidebarCollapsed={setSidebarCollapsed}
            />
            <main className="admin-main-content">
                <header className="admin-top-header">
                    <div className="header-left">
                        <h2>Panel de Administración</h2>
                    </div>
                    <div className="header-right">
                        <div className="admin-info">
                            <div className="admin-avatar">{nombre.charAt(0)}</div>
                            <div className="admin-details">
                                <span className="admin-name">Admin {nombre}</span>
                                <span className="admin-role">Administrador</span>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="admin-content-wrapper">
                    <Outlet context={{ nombre }} />
                </div>
            </main>
        </div>
    );
}

export default AdminLayout;