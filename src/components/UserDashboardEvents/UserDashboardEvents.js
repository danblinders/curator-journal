import { useState, useEffect } from 'react'
import EventsList from '../EventsList/EventsList';
import axios from 'axios';

const UserDashboardEvents = () => {
  const [events, setEvents] = useState([]);

  const eventsString = JSON.stringify(events);

  useEffect(() => {
    axios.get("http://localhost:3001/all-events").then(response => {
      setEvents(response.data);
    });
  }, [eventsString]);

  const deleteEvent = (id) => {
    axios.post(
      "http://localhost:3001/delete", 
      {table_name: "events", column_name: "event_id", column_value: id}
    ).then(() => {
      setEvents(events.filter(({event_id}) => event_id !== id));
    });
  }

  return (
    <>
      <div className="events-list-wrapper">
        <EventsList eventsToShow={events} deleteRow={deleteEvent}/>
      </div>
    </>
  )
}

export default UserDashboardEvents;