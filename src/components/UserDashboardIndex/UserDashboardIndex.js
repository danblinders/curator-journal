import { useState, useEffect, useMemo, useContext } from 'react';
import authContext from '../../context';
import axios from 'axios';
import Loader from '../Loader/Loader';
import { useNavigate } from 'react-router-dom';

const UserDashboardIndex = () => {
  const user = useContext(authContext);
  const [userInfo, setUserInfo] = useState(null);
  const [latetsEvents, setLatestEvents] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const userInfoString = useMemo(() => JSON.stringify(userInfo), [userInfo]);
  const latestEventsString = useMemo(() => JSON.stringify(latetsEvents), [latetsEvents]);

  useEffect(() => {
    Promise.all([axios.get('https://curator-backend.onrender.com/all-curator-info', {params: {curator_id: user.curator_id}}), axios.get("https://curator-backend.onrender.com/all-events")]).then(responses => {
      setLoading(false);
      if(responses[0].data.type === 'success') {
        setUserInfo(responses[0].data.result);
      } else {
        setUserInfo(null);
      }

      if(responses[1].data.type === 'success') {
        const latetsEventsList = responses[1].data.result.filter(item => new Date(item.start_date) >= new Date()); 
        setLatestEvents(latetsEventsList);
      } else {
        setLatestEvents(null);
      }
    });
  }, [userInfoString, user.curator_id, latestEventsString]);

  if (loading) {
    return <Loader/>;
  }

  console.log(userInfo.stats);
 
  return (
    <>
      {userInfo ? 
        <div className="info-block" >
          <div className="info-block__item info-block__item_medium">
            {userInfo?.groups?.length} групп
          </div>
          <div className="info-block__item info-block__item_medium">
            {userInfo?.students?.length} студентов
          </div>
          <div className="info-block__item info-block__item_big">
            Средний балл за последние 7 дней: {userInfo?.stats?.length > 0 ? ((userInfo.stats.reduce((sum, item) => +sum + +item.mark, 0) / userInfo.stats.length).toFixed(2)) : '-'}
          </div>
        </div>
        : <div className="test">Данные отсутствуют</div>
      }
      <h2 className="title">Ближайшие события</h2>
      {
        latetsEvents ?
        <div className="latest-events">
          {latetsEvents.map(latEvent => {
                let thumbExt;
  
                switch(latEvent.thumbnail[0]) {
                  case '/':
                    thumbExt = 'jpg';
                    break;
                  case 'i':
                    thumbExt = 'png';
                    break;
                  case 'U':
                    thumbExt = 'webp';
                    break;
                  case 'P':
                    thumbExt = 'svg';
                    break;
                  default:
                    thumbExt = null;
                    break;
                }
              
                const thumbSrc = `data:image/${thumbExt};base64,${latEvent.thumbnail}`

                return (
                  <div key={`latest-event-${latEvent.event_id}`} className="latest-events__item" onClick={() => navigate(`events/${latEvent.event_id}`) }>
                    <div className="latest-events__thumb">
                      <img src={thumbSrc} alt={latEvent.event_name} />
                    </div>
                    <div className="latest-events__info">
                      <h3 className="latest-events__title">{latEvent.event_name}</h3>
                      <button className="details-btn" onClick={() => navigate(`events/${latEvent.event_id}`) }>Подробнее</button>
                    </div>
                  </div>
                )
          })}
        </div> 
        : <div className="test">В ближайшее будущее не предвидится никаких событий</div>
      }
    </>


  )
}

export default UserDashboardIndex;