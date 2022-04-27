import { useContext, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import authContext from '../../context';


const Home = () => {
  const loggedUser = useContext(authContext);

  if (loggedUser) {
    return (
      <div className="homepage">User {loggedUser.id} is called {loggedUser.name} {loggedUser.surname}</div>
    )
  } else {
    return <Navigate to="/login" />
  }
}

export default Home