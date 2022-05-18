import { useState, useEffect } from 'react'
import { useFormik } from 'formik';
import * as yup from 'yup';
import InputMask from 'react-input-mask'; 
import EventsList from '../EventsList/EventsList';
import Loader from '../Loader/Loader';
import axios from 'axios';
import { CSSTransition } from 'react-transition-group';

const AdminDashboardEvents = () => {
  const [events, setEvents] = useState([]);

  const [loading, setLoading] = useState(true);

  const [showEventForm, setShowEventForm] = useState(false);

  const eventsString = JSON.stringify(events);

  const getEvents = () => {
    axios.get("http://localhost:3001/all-events").then(response => {
      if(response.data.type === "success") {
        setEvents(response.data.result);
        setLoading(false);  
      } else {
        setEvents([]);
        setLoading(false);
      }
    });
  }

  useEffect(() => {
    getEvents();
  }, [eventsString]);

  const deleteEvent = (id) => {
    axios.post(
      "http://localhost:3001/delete", 
      {table_name: "events", column_name: "event_id", column_value: id}
    ).then(() => {
      setEvents(events.filter(({event_id}) => event_id !== id));
    });
  }

  if (loading) {
    return <Loader/>
  }

  return (
    <>
      <div className="events-list-wrapper">
        <EventsList eventsToShow={events} deleteRow={deleteEvent}/>
      </div>
      <button className="add-btn" onClick={() => setShowEventForm(true)} >Добавить событие</button>
      <CSSTransition
        in={showEventForm}
        timeout={500}
        classNames="modal"
        unmountOnExit
      >
        <div className="modal">
          <div className="modal__wrapper">
          <AddEventForm changeLoading={setLoading} closeForm={() => setShowEventForm(false)} updateEvents={getEvents}/>
          </div>
        </div>
      </CSSTransition>
    </>
  )
}

const AddEventForm = ({changeLoading, closeForm, updateEvents}) => {
  const formik_event = useFormik({
    initialValues: {
      eventName: '',
      eventDescr: '',
      eventThumb: '',
      eventStart: '',
      eventEnd: ''
    },
    validationSchema: yup.object({
      eventName: yup.string().required('Обязательное поле'),
      eventDescr: yup.string().max('1000', 'Длина текста не должна превышать 1000 символов'),
      eventEnd: yup.string().test(
        'equal',
        'Дата окончания события должна быть больше даты начала',
        function(val) {
          const ref = yup.ref('eventStart');
          return new Date(val.split('-').reverse().join('-')) > new Date(this.resolve(ref).split('-').reverse().join('-'));
        }
      )
    }),
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: () => {
      changeLoading(true);
      const formData = new FormData();
      formData.append("event_name", formik_event.values.eventName);
      formData.append("description", formik_event.values.eventDescr);
      formData.append("thumbnail", formik_event.values.eventThumb);
      formData.append("start_date", formik_event.values.eventStart.split('-').reverse().join('-'));
      formData.append("end_date", formik_event.values.eventEnd.split('-').reverse().join('-'));
  
      axios.post('http://localhost:3001/add-event', formData)
      .then(() => {
        updateEvents();
        closeForm();
      });
    }
  })

  return (
    <form action="#" method="POST" className="add-event__form form" onSubmit={formik_event.handleSubmit}>
      <div className="modal-close" onClick={() => closeForm()}><i className="fa fa-close"></i></div>
      <label className="form__field">
        <span className="form__label">Название:</span> 
        <input className="form__input" type="text" name="eventName" value={formik_event.values.eventName} onChange={formik_event.handleChange} />
        {formik_event.errors.eventName && <span className="form__error">{formik_event.errors.eventName}</span>}
      </label>
      <label className="form__field">
        <span className="form__label">Описание:</span>
        <input className="form__input" type="text" name="eventDescr" value={formik_event.values.eventDescr} onChange={formik_event.handleChange} />
        {formik_event.errors.eventDecsr && <span className="form__error">{formik_event.errors.eventDescr}</span>}
      </label>
      <label className="form__field">
        <span className="form__label">Изображение:</span>
        <input className="form__input" type="file" name="eventThumb" onChange={(e) => formik_event.setFieldValue('eventThumb', e.target.files[0])}/>
      </label>
      <label className="form__field">
        <span className="form__label">Дата начала мероприятия:</span>
        <InputMask
          mask="99-99-9999"
          maskPlaceholder="_"
          value={formik_event.values.eventStart} 
          alwaysShowMask={false}
          onChange={formik_event.handleChange}
        >
          {() => <input className="form__input" type="text" name="eventStart" placeholder="ДД-ММ-ГГГГ" />}
        </InputMask>
      </label>
      <label className="form__field">
        <span className="form__label">Дата завершения мероприятия:</span>
        <InputMask
          mask="99-99-9999"
          maskPlaceholder="_"
          value={formik_event.values.eventEnd} 
          alwaysShowMask={false}
          onChange={formik_event.handleChange}
        >
          {() => <input className="form__input" type="text" name="eventEnd" placeholder="ДД-ММ-ГГГГ" />}
        </InputMask>
        {formik_event.errors.eventEnd && <span className="form__error">{formik_event.errors.eventEnd}</span>}
      </label>
      <button className="form__submit" type="submit" >Отправить</button>
    </form>
  )
}


export default AdminDashboardEvents;