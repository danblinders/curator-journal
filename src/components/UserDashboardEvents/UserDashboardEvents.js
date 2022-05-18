import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import axios from 'axios';
import Loader from '../Loader/Loader';

const UserDashboardEvents = () => {
  const [events, setEvents] = useState(null);
  const [loading, setLoading] = useState(true);
  const eventsString = JSON.stringify(events);

  useEffect(() => {
    axios.get("http://localhost:3001/all-events").then(response => {
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
  const navigate = useNavigate();

  const eventsItems = eventsToShow?.map(({event_id, event_name, start_date, end_date}) => {
    const formattedStartDate = moment.utc(start_date).format('DD/MM/YYYY');
    const formattedEndDate = moment.utc(start_date).format('DD/MM/YYYY');

    return (
      <tr className="table__row" key={`event-${event_id}`}>
        <td className="table__cell" data-event-name={event_name}>{event_name}</td>
        <td className="table__cell" data-event-start={start_date}>{formattedStartDate}</td>
        <td className="table__cell" data-event-end={end_date}>{formattedEndDate}</td>
        <td className="table__cell" data-event-end={end_date}>
          <button onClick={() => navigate(`${event_id}`)} className="details-btn" >Подробнее</button>
        </td>
      </tr>
    )
  });

  if (eventsItems.length <= 0) {
    return <div>Нет событий</div>
  }

  return (
    <table className="table">
      <tbody>
        {eventsItems}
      </tbody>
    </table>
  )
}

export default UserDashboardEvents;