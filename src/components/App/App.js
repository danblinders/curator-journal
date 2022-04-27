import './App.scss';
import { useState } from 'react';
import authContext from '../../context';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Home from '../Home/Home';
import Login from '../Login/Login';

function App() {
  const [loginInfo, setLoginInfo] = useState(null);
  return (
    <Router>
      <authContext.Provider value={loginInfo}>
        <div className="App">
          <Routes>
            <Route path="/" element={<Home/>} />
            <Route path="/login" element={<Login changeLoginInfo={setLoginInfo} />} />
          </Routes>
        </div>
      </authContext.Provider>
    </Router>
  );
}

export default App;