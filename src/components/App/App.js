import './App.scss';
import authContext from '../../context';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Home from '../Home/Home';
import Login from '../Login/Login';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/login" element={<Login/>} />
        </Routes>
       </div>
    </Router>
  );
}

export default App;