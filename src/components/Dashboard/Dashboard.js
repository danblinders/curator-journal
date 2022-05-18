import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import authContext from '../../context';

const Dashboard = ({logoutUser}) => {
  const loggedUser = useContext(authContext);
  
  if (loggedUser) {
    return (
      <div className="page">
        <Outlet/>
      </div>
    )
  } else {
    return <Navigate to="/login" replace />
  }
}

export default Dashboard;