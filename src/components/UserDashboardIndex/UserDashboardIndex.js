import { useContext } from 'react';
import authContext from '../../context';

const UserDashboardIndex = () => {
  const user = useContext(authContext);
  return <div className="test">test</div>
}

export default UserDashboardIndex;