import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Registr from './Registr'
import PersonalCabinet from './PersonalCabinet';
import Authorization from './authorization';
import ProjectManagement  from './ProjectManagement'
import { AuthProvider } from './AuthContext';


function App() {
  return(
    <Router>
      <AuthProvider>
        <Routes>
          <Route path='/proj' element={<ProjectManagement />} />
          <Route path="/registr" element={<Registr />} />
          <Route path="/auth" element={<Authorization />} />
          <Route path='/cabinet' element={<PersonalCabinet />} />
        </Routes>
      </AuthProvider>
    </Router>
    
  )
}


export default App