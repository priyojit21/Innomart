import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

export default function CustomerProtectedRoute({ children }) {
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem("role")
    if (role !== "Customer") {
      navigate("/login");
    }
    
  }, [navigate]);
  return children;
}