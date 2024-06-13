"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";

interface AuthProps {
  children: React.ReactNode;
}

interface UserToken {
  email: string;
  firebaseUid: string;
  id: string;
  name: string;
  provider: any;
  role: number;
  token: string;
}

const AuthStore: React.FC<AuthProps> = ({ children }) => {
  const [token, setToken]: any = useState(); // Inicializa el estado con el tipo adecuado
  const [id, setId]: any = useState();
  const [role, setRole]: any = useState();
  useEffect(() => {
    const fetchUserData = async () => {
      const userDataLogin = localStorage.getItem("userDataLogin");

      if (userDataLogin) {
        const userData = JSON.parse(userDataLogin);
        setId(userData.id);
        setToken(userData.token);
        setRole(userData.role);
        console.log("first TOKEN", token);

        const loginObjet = {
          email: userData.email,
          firebaseUid: userData.firebaseUid,
        };

        try {
          const res = await axios.post(
            "https://liquors-project.onrender.com/users/signin",
            loginObjet
          );
          const newToken = res.data;
          setToken(newToken.token);
          console.log("Nuevo token obtenido:", token);

          const response = await axios.get(
            `https://liquors-project.onrender.com/users/${id}`
          );
          const newUserData: any = response.data;

          if (newUserData.role !== role || newUserData.token !== token) {
            console.log("Datos del usuario han cambiado");

            // Actualizar el token en los datos del usuario
            newUserData.token = token;
            localStorage.setItem("userDataLogin", JSON.stringify(newUserData));
          }
        } catch (fetchError) {
          console.error("Error al obtener datos del usuario:", fetchError);
        }
      }
    };

    fetchUserData();
  }, []); // Dependencias vacías para que se ejecute solo una vez al montar el componente

  return <div>{children}</div>;
};

export default AuthStore;
