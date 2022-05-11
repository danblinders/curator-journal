import './App.scss';
import { useState } from 'react';
import authContext from '../../context';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Dashboard from '../Dashboard/Dashboard';
import Login from '../Login/Login';
import ProtectedRoute from '../ProtectedRoute/ProtectedRoute';
import AdminDashboard from '../AdminDashboard/AdminDashboard';
import AdminDashboardIndex from '../AdminDashboardIndex/AdminDashboardIndex';
import AdminDashboardEvents from '../AdminDashboardEvents/AdminDashboardEvents';
import AdminDashboardStudents from '../AdminDashboardStudents/AdminDashboardStudents';
import AdminDashboardCurators from '../AdminDashboardCurators/AdminDashboardCurators';
import UserDashboard from '../UserDashboard/UserDashboard';
import UserDashboardIndex from '../UserDashboardIndex/UserDashboardIndex';
import UserDashboardEvents from '../UserDashboardEvents/UserDashboardEvents';
import UserDashboardStudents from '../UserDashboardStudents/UserDashboardStudents';
import UserDashboardManagement from '../UserDashboardManagement/UserDashboardManagement';
import StudentManagementDetails from '../StudentManagementDetails/StudentManagementDetails';
import EventDetails from '../EventDetails/EventDetails';

function App() {
  const [user, setUser] = useState(sessionStorage.getItem('user') ? JSON.parse(sessionStorage.getItem('user')) : null);
  return (
    <Router>
      <authContext.Provider value={user}>
        <div className="app">
          <Routes>
            <Route path="/" element={<ProtectedRoute><Dashboard logoutUser={setUser} /></ProtectedRoute>}>
              <Route path="admin" element={<AdminDashboard/>}>
                <Route index element={<AdminDashboardIndex/>}/>
                <Route path="students" element={<AdminDashboardStudents/>}/>
                <Route path="curators" element={<AdminDashboardCurators/>}/>
                <Route path="events" element={<AdminDashboardEvents/>}/>
              </Route>
              <Route path="user/:id" element={<UserDashboard/>}>
                <Route index element={<UserDashboardIndex/>}/>
                <Route path="students" element={<UserDashboardStudents/>}/>
                <Route path="management" element={<UserDashboardManagement/>}/>
                <Route path="management/:id" element={<StudentManagementDetails/>}/>
                <Route path="events" element={<UserDashboardEvents/>}/>
                <Route path="events/:id" element={<EventDetails/>}/>
              </Route>
            </Route>
            <Route path="/login" element={<Login loginUser={setUser} />} />
          </Routes>
        </div>
      </authContext.Provider>
    </Router>
  );
}

export default App;