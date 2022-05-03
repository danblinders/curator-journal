import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import authContext from '../../context';

const ProtectedRoute = ({children}) => {
  const user = useContext(authContext);

  if(!user) {
    return <Navigate to="/login" />;
  }

  return children ? children : <Outlet/>;
}

export default ProtectedRoute;