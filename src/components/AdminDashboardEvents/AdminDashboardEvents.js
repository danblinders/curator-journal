import { useState, useEffect } from 'react'
import EventsList from '../EventsList/EventsList';
import axios from 'axios';

const AdminDashboardEvents = () => {
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
      <div className="add-event-block">
        <AddEventForm updateEvents={setEvents}/>
      </div>
    </>
  )
}

const AddEventForm = ({updateEvents}) => {
  const [eventName, setEventName] = useState(''),
        [eventDescr, setEventDescr] = useState(''),
        [eventThumb, setEventThumb] = useState(''),
        [eventStart, setEventStart] = useState(''),
        [eventEnd, setEventEnd] = useState('');

  const convertImageFileToObj = (fileObj) => {
    const imageObj = {};

    for (const key in fileObj) {
      const value = fileObj[key];
      const notFunction = typeof value !== "function";
      notFunction && (imageObj[key] = value);
    }

    setEventThumb(imageObj);
  }

  const addEvent = (e) => {
    e.preventDefault();
    axios.post('http://localhost:3001/add-event', 
              {event_name: eventName, description: eventDescr, thumbnail: JSON.stringify(eventThumb), start_date: eventStart, end_date: eventEnd}
    ).then(() => {
      updateEvents([]);
    });
  }

  return (
    <div className="add-event">
      <form action="#" method="POST" className="add-event__form form" onSubmit={addEvent}>
        {/* {error ? <span className="form__error">{error}</span>: null} */}
        <label className="form__field">
          <span className="form__label">Название:</span> 
          <input className="form__input" type="text" name="event_name" value={eventName} onChange={(e) => setEventName(e.target.value)} required />
        </label>
        <label className="form__field">
          <span className="form__label">Описание:</span>
          <input className="form__input" type="text" name="description" value={eventDescr} onChange={(e) => setEventDescr(e.target.value)} required />
        </label>
        <label className="form__field">
          <span className="form__label">Изображение:</span>
          <input className="form__input" type="file" name="thumb" onChange={(e) => convertImageFileToObj(e.target.files[0])} required />
        </label>
        <label className="form__field">
          <span className="form__label">Дата начала мероприятия:</span>
          <input className="form__input" type="text" name="start" value={eventStart} onChange={(e) => setEventStart(e.target.value)} required />
        </label>
        <label className="form__field">
          <span className="form__label">Дата завершения мероприятия:</span>
          <input className="form__input" type="text" name="end" value={eventEnd} onChange={(e) => setEventEnd(e.target.value)} required />
        </label>
        <button className="form__submit" type="submit" >Отправить</button>
      </form>
    </div>
  )
}


export default AdminDashboardEvents;