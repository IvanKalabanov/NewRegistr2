import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext(null); // Явно инициализируем null

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  
  // Загрузка данных при монтировании
  useEffect(() => {
    const storedUsers = localStorage.getItem('users');
    const storedUser = localStorage.getItem('currentUser');
    
    if (storedUsers) setUsers(JSON.parse(storedUsers));
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  // Сохранение данных при изменении
  useEffect(() => {
    localStorage.setItem('users', JSON.stringify(users));
    if (user) localStorage.setItem('currentUser', JSON.stringify(user));
  }, [users, user]);

  const registr = (userData) => {
    const newUser = { ...userData, id: Date.now().toString() };
    setUsers(prev => [...prev, newUser]);
    setUser(newUser);
    return newUser;
  };

  const login = (userData) => {
    setUser(userData);
    return userData;
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, users, registr, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};