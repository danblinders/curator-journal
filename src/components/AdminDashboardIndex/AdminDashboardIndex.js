import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import Loader from '../Loader/Loader';

const AdminDashboardIndex = () => {
  const [adminInfo, setAdminInfo] = useState(null);

  const [loading, setLoading] = useState(true);

  const adminInfoString = useMemo(() => JSON.stringify(adminInfo), [adminInfo]);

  useEffect(() => {
    axios.get('http://localhost:3001/all').then(response => {
      if(response.data.type === 'success') {
        setAdminInfo(response.data.result);
        setLoading(false);
      } else {
        setAdminInfo(null);
        setLoading(false);
      }
    });
  }, [adminInfoString]);

  if (loading) {
    return <Loader/>
  }

  if (!adminInfo) {
    return <div className="test">Данные отсутствуют</div>
  }
 
  return (
    <div className="info-block" >
      <div className="info-block__item info-block__item_medium">
        {adminInfo.curators?.length} кураторов
      </div>
      <div className="info-block__item info-block__item_medium">
        {adminInfo.students?.length} студентов
      </div>
      <div className="info-block__item info-block__item_big">
        {adminInfo.events?.length} событий
      </div>
    </div>
  )
}

export default AdminDashboardIndex