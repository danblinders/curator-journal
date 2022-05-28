import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import axios from 'axios';
import Loader from '../Loader/Loader';
import {SlideDown} from 'react-slidedown';
import 'react-slidedown/lib/slidedown.css';

const UserDashboardEvents = () => {
  const [events, setEvents] = useState(null);
  const [loading, setLoading] = useState(true);
  const eventsString = JSON.stringify(events);

  useEffect(() => {
    axios.get("https://curator-journal-backend.onrender.com/all-events").then(response => {
      if(response.data.type === "success") {
        setEvents(response.data.result);
        setLoading(false);
      } else {
        setEvents(null);
        setLoading(false)
      }
    });
  }, [eventsString]);

  if(loading) {
    return <Loader/>
  }

  return (
    <>
      <div className="events-list-wrapper">
        { events ? <UserAttendanceList eventsToShow={events} /> : null }
      </div>
    </>
  )
}

const UserAttendanceList = ({eventsToShow}) => {

  if (eventsToShow.length <= 0) {
    return <div>Нет событий</div>
  }

  const eventsItems = eventsToShow?.map((eventInfo, id) => {
    return (
      <EventListItem key={eventInfo.event_id} eventObj={eventInfo} id={id} />
    )
  });

  return (
    <ul className="list">
      {eventsItems}
    </ul>
  )
}

export default UserDashboardEvents;

const EventListItem = ({eventObj, id}) => {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const {event_id, event_name, description, thumbnail, start_date, end_date} = eventObj;
  const formattedStartDate = moment.utc(start_date).format('DD/MM/YYYY');
  const formattedEndDate = moment.utc(end_date).format('DD/MM/YYYY');
  
  let thumbExt;

  switch(thumbnail[0]) {
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

  const thumbSrc = `data:image/${thumbExt};base64,${thumbnail}`;

  return (
    <li className="list__item">
      <div className="list__item-wrapper">
        <h3 className="list__subtitle subtitle">{id + 1}. {event_name}</h3>
        <button className="details-btn push-left" onClick={() => setShowDropdown((state) => !state)}>{showDropdown ? 'Свернуть' : 'Подробнее'}</button>
      </div>
      <SlideDown>
        {
          showDropdown &&
          <div className="list__fields list__fields_cols">
            <div className="list__field_image">
              <img src={thumbSrc} alt={event_name}/>
            </div>
            <div className="list__field_column">
              <div className="list__field list__field_column">
                Описание:
                <span>{description}</span>
              </div>
              <div className="list__field">Даты: <span>{formattedStartDate} - {formattedEndDate}</span> </div>
              <button onClick={() => navigate(`${event_id}`)} className="details-btn" >Данные об участниках</button>
            </div>
          </div>
        }
      </SlideDown>
    </li>
  );
};
