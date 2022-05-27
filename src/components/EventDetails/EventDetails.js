import {useState, useEffect, useContext} from 'react';
import authContext from '../../context';
import { useParams } from 'react-router-dom'
import moment from 'moment';
import axios from 'axios';
import Loader from '../Loader/Loader';
import { CSSTransition } from 'react-transition-group';
import {SlideDown} from 'react-slidedown';
import 'react-slidedown/lib/slidedown.css';
import { useFormik } from 'formik';
import * as yup from 'yup';

const EventDetails = () => {
  const {id} = useParams();

  const loggedUser = useContext(authContext);

  const [eventInfo, setEventInfo] = useState(null);

  const [loading, setLoading] = useState(true);

  const eventsString = JSON.stringify(eventInfo);

  const updateEventInfo = () => {
    axios.get("http://localhost:3001/curator-event", {params: {event_id: id, curator_id: loggedUser.curator_id}}).then(response => {
      if(response.data.type === 'success') {
        setEventInfo(response.data.result);
        setLoading(false);
      }
    });
  }

  useEffect(() => {
    updateEventInfo();
  }, [eventsString, id, loggedUser.curator_id]);

  let eventParticipantsByGroup = null;

  if(loading) {
    return <Loader/>
  }

  if (eventInfo) {
    eventParticipantsByGroup = {};

    eventInfo.attendance?.forEach(item => {
      if(!eventParticipantsByGroup[item.group_id]) {
        eventParticipantsByGroup[item.group_id] = {
          name: item.group_name,
          students: []
        }
      }
      eventParticipantsByGroup[item.group_id].students.push(item);
    });
  
    const participantsItems = [];
  
    for(let key in eventParticipantsByGroup) {
      const studentsWithRoles = eventParticipantsByGroup[key].students.filter(elem => elem.role !== null && +elem.event_id === +eventInfo.details[0].event_id);
      
      const studentsWithNoRoles = eventParticipantsByGroup[key].students.filter(studentItem => {
        return !studentsWithRoles.some(studentWithRole => studentWithRole.student_id === studentItem.student_id);
      });

      participantsItems.push(<EventParticipantsItem key={key} changeLoading={setLoading} updateEventData={updateEventInfo} event_id={id} group={eventParticipantsByGroup[key].name} group_id={key} studentsWithNoRoles={studentsWithNoRoles} studentsWithRoles={studentsWithRoles} />)
    }

    const {event_name, description, thumbnail, start_date, end_date} = eventInfo.details[0];

    const formattedStartDate = moment.utc(start_date).format('DD/MM/YYYY');
    const formattedEndDate = moment.utc(start_date).format('DD/MM/YYYY');
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
  
    const thumbSrc = `data:image/${thumbExt};base64,${thumbnail}`
    
  
    return (
      <div className="event">
        <div className="event__info">
          <div className="event__thumb"><img src={thumbSrc ? thumbSrc : null} alt={event_name} /></div>
          <h2 className="event__title title" data-event-name={event_name}>{event_name}</h2>
          <div className="event__descr" data-event-descr={description}>{description}</div>
          <div className="event__dates" data-event-start={start_date} data-event-end={end_date}>
            Даты проведения: {`${formattedStartDate} - ${formattedEndDate}`}
          </div>
        </div>
        <div className="event__participants">
          <ul className="list">
            {participantsItems}
          </ul>
        </div>
      </div>
    )

  }

  return <div className="no-data">Нет данных</div>

}

const EventParticipantsItem = ({changeLoading, updateEventData, event_id, group, group_id, studentsWithNoRoles, studentsWithRoles}) => {
  const [showParticipantFilter, setShowParticipantFilter] = useState(false)
  const [showParticipantForm, setShowParticipantForm] = useState(false);
  const [showParticipantsList, setShowParticipantsList] = useState(false);
  const [studentSearch, setStudentSearch] = useState('');

  const studentsWithNoRolesItems = studentsWithNoRoles.filter(item => `${item.first_name} ${item.last_name}`.toLowerCase().includes(studentSearch.toLowerCase())).map(studentWithNoRole => {
    return (
      <li key={`participant-filter-${studentWithNoRole.student_id}`} className="form__filter-item" onClick={() => formik_participants.setFieldValue('participantName', studentWithNoRole.student_id)}>
        <span>{studentWithNoRole.first_name} {studentWithNoRole.last_name}</span>
      </li>
    )
  })

  const studentItems = studentsWithRoles.length > 0 ? studentsWithRoles.map(student => {
    return (
      <li key={`group-${group}-participant-${student.student_id}`} className="list__sublist-item">
        <h4 className="list__subtitle_secondary subtitle_secondary">{student.first_name} {student.second_name} {student.last_name}</h4>
        <div className="list__field list__field_columns">Роль: <span>{student.role}</span></div>
      </li>
    )
  }) : <li className="list__sublist-item">От этой группы нет участников</li>

  const formik_participants = useFormik({
    initialValues: {
      participantName: studentsWithNoRoles[0]?.student_id,
      participantRole: ''
    },
    validationSchema:
      yup.object({
        participantRole: yup.string().required("Обязательное поле").max(1000, 'Значение не должно превышать 1000 символов')
      }),
      validateOnChange: false,
      validateOnBlur: false,
      onSubmit: () => {
        changeLoading();
        axios.post("http://localhost:3001/add-participant", {event_id, student_id: formik_participants.values.participantName, role: formik_participants.values.participantRole}).then(response => {
          if(response.data.type === 'success') {
            setShowParticipantForm(false);
            updateEventData();
          }
        });
      }
  })

  return (
    <li key={`group-${group_id}`} className="list__item">
      <div className="list__item-wrapper">
        <h3 className="list__subtitle subtitle">Группа {group}</h3>
        <button className="details-btn push-left" onClick={() => setShowParticipantsList((state) => !state)}>{showParticipantsList ? 'Свернуть' : 'Показать'}</button>
        {studentsWithNoRoles.length > 0 && <button className="add-btn" onClick={() => setShowParticipantForm(true)} >Добавить участника</button> }
      </div>
      <CSSTransition
          in={showParticipantForm}
          timeout={500}
          classNames="modal"
          unmountOnExit
        >
          <div className="modal">
            <div className="modal__wrapper modal__wrapper_medium">
              <form className="add__participant form" onSubmit={formik_participants.handleSubmit}>
                <div className="modal-close" onClick={() => setShowParticipantForm(false)}><i className="fa fa-close"></i></div>
                <h2 className="form__title title">Новый участник</h2>
                <div className="form__field">
                  <div className="form__group">
                    <div className="list__field form__show-box">Новый участник: <span>{studentsWithNoRoles.filter(elem => elem.student_id === formik_participants.values.participantName)[0]?.first_name + ' ' + studentsWithNoRoles.filter(elem => elem.student_id === formik_participants.values.participantName)[0]?.last_name}</span></div>
                    <button type="button" className="add-btn" onClick={() => setShowParticipantFilter((state) => !state)}>{showParticipantFilter ? 'Свернуть' : 'Выбрать'}</button>
                  </div>
                  <input className="form__input form__input_hidden" readOnly name="participantName" value={studentsWithNoRoles.filter(elem => elem.student_id === formik_participants.values.participantName)[0]?.first_name + ' ' + studentsWithNoRoles.filter(elem => elem.student_id === formik_participants.values.participantName)[0]?.last_name} onChange={(e) => formik_participants.setFieldValue('participantName', e.target.value)} type="text"/>
                  <div className="form__filter">
                    <SlideDown>
                      {showParticipantFilter &&
                        <div className="form__filter-search">
                          <div className="list__subtitle_secondary subtitle_secondary">Выберите нового участника:</div>
                          <div className="form__filter-search-wrapper">
                            <input type="text" value={studentSearch} placeholder="Фильтр" onChange={(e) => setStudentSearch(e.target.value)} className="form__input form__input_filter"/>
                          </div>
                          <div className="list__subtitle_secondary subtitle_secondary">Студенты для выборки:</div>
                          <ul className="form__filter-list">
                            {studentsWithNoRolesItems}
                          </ul>
                        </div>
                      }
                    </SlideDown>
                  </div>
                </div>
                <label className="form__field">
                  <span className="form__label">Роль:</span>
                  <input className="form__input" name="participantRole" type="text" value={formik_participants.values.participantRole} onChange={formik_participants.handleChange}/>
                  {formik_participants.errors.participantRole && <span className="form__error">{formik_participants.errors.participantRole}</span> }
                </label>
                <button className="form__submit" type="submit">Добавить участника</button>
              </form>
            </div>
          </div>
        </CSSTransition>
        <SlideDown>
          {
            showParticipantsList &&
            <ul className="list__sublist">
              {studentItems}
            </ul>
          }
        </SlideDown>
    </li>
  )
}

export default EventDetails;