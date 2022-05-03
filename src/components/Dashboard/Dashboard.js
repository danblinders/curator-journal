import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import authContext from '../../context';

const Dashboard = ({logoutUser}) => {
  const loggedUser = useContext(authContext);

  const signOut = () => {
    sessionStorage.removeItem('user');
    logoutUser(null);
  }
  
  if (loggedUser) {
    return (
      <div className="page">
        <header className="header">
          <div className="container">
            <div className="header__wrapper">
              <div className="header__user">
                <h1 className="header__user-name">{loggedUser.first_name} {loggedUser.last_name}</h1>
                <button className="header__logout" onClick={signOut}>Выйти</button>
              </div>
            </div>
          </div>
        </header>
        <Outlet/>
      </div>
    )
  } else {
    return <Navigate to="/login" replace />
  }
}

export default Dashboard;