import {useState, useEffect, useContext} from 'react';
import authContext from '../../context';
import { useParams } from 'react-router-dom'
import moment from 'moment';
import axios from 'axios';
import Loader from '../Loader/Loader';
import { CSSTransition } from 'react-transition-group';

const EventDetails = () => {
  const {id} = useParams();

  const loggedUser = useContext(authContext);

  const [eventInfo, setEventInfo] = useState(null);

  const [loading, setLoading] = useState(true);

  const eventsString = JSON.stringify(eventInfo);

  const updateEventInfo = () => {
    axios.get("http://localhost:3001/curator-event", {params: {event_id: id, curator_id: loggedUser.curator_id}}).then(response => {
      setEventInfo(response.data);
      setLoading(false);
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

    // console.log(eventParticipantsByGroup);
  
    for(let key in eventParticipantsByGroup) {
      const studentsWithRoles = eventParticipantsByGroup[key].students.filter(elem => elem.role !== null && +elem.event_id === +eventInfo.details[0].event_id);
      
      const studentsWithNoRoles = eventParticipantsByGroup[key].students.filter(studentItem => {
        return !studentsWithRoles.some(studentWithRole => studentWithRole.student_id === studentItem.student_id);
      });

      participantsItems.push(<EventParticipantsItem key={key} updateEventData={updateEventInfo} event_id={id} group={eventParticipantsByGroup[key].name} group_id={key} studentsWithNoRoles={studentsWithNoRoles} studentsWithRoles={studentsWithRoles} />)
    }

    const {event_id, event_name, description, thumbnail, start_date, end_date} = eventInfo.details[0];

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
          <div className="event__item"><img src={thumbSrc ? thumbSrc : null} alt={event_name} /></div>
          <div className="event__item" data-event-name={event_name}>{event_name}</div>
          <div className="event__item" data-event-descr={description}>{description}</div>
          <div className="event__item" data-event-start={start_date} data-event-end={end_date}>
            {`${formattedStartDate} - ${formattedEndDate}`}
          </div>
        </div>
        <div className="event__participants">
          {participantsItems}
        </div>
      </div>
    )

  }

  return <div className="no-data">Нет данных</div>

}

const EventParticipantsItem = ({updateEventData, event_id, group, group_id, studentsWithNoRoles, studentsWithRoles}) => {
  const [showParticipantForm, setShowParticipantForm] = useState(false);
  const [studentSearch, setStudentSearch] = useState('');
  const [studentWithNoRoleName, setStudentWithNoRoleName] = useState(studentsWithNoRoles[0]?.student_id || '');
  const [studentWithNoRoleRole, setStudentWithNoRoleRole] = useState('');

  const addParticipant = (e) => {
    e.preventDefault();
    axios.post("http://localhost:3001/add-participant", {event_id, student_id: studentWithNoRoleName, role: studentWithNoRoleRole}).then(response => {
      if(response.data.type === 'success') {
        updateEventData();
      }
    });
  }
  
  const studentsWithNoRolesItems = studentsWithNoRoles.filter(item => `${item.first_name} ${item.last_name}`.toLowerCase().includes(studentSearch.toLowerCase())).map(studentWithNoRole => {
    return (
      <li key={`participant-filter-${studentWithNoRole.student_id}`} onClick={() => setStudentWithNoRoleName(studentWithNoRole.student_id)}>
        <span>{studentWithNoRole.first_name} {studentWithNoRole.last_name}</span>
      </li>
    )
  })

  const studentItems = studentsWithRoles.map(student => {
    return (
      <li key={`group-${group}-participant-${student.student_id}`}>
        <span>{student.first_name} {student.last_name} - </span>
        <span>{student.role}</span>
      </li>
    )
  })
  return (
    <div key={`group-${group_id}`}>
      <h2>Группа {group}</h2>
      <ul>
        {studentItems}
      </ul>
      {studentsWithNoRoles.length > 0 && <button className="add-btn" onClick={() => setShowParticipantForm(true)} >Добавить участника</button> }
      <CSSTransition
        in={showParticipantForm}
        timeout={500}
        classNames="modal"
        unmountOnExit
      >
        <div className="modal">
          <div className="modal__wrapper">
            <form className="add__participant form" onSubmit={addParticipant}>
              <div className="modal-close" onClick={() => setShowParticipantForm(false)}><i className="fa fa-close"></i></div>
              <label className="form__field">
                <span className="form__label">Студент:</span>
                <input className="form__input" readOnly name="student" value={studentsWithNoRoles.filter(elem => elem.student_id === studentWithNoRoleName)[0]?.first_name + ' ' + studentsWithNoRoles.filter(elem => elem.student_id === studentWithNoRoleName)[0]?.last_name} onChange={(e) => setStudentWithNoRoleName(e.target.value)} type="text"/>
                <div className="form__filter">
                  <input type="text" value={studentSearch} placeholder="Фильтр" onChange={(e) => setStudentSearch(e.target.value)} className="form__input form__filter-search"/>
                  <ul className="form__filter-list">
                    {studentsWithNoRolesItems}
                  </ul>
                </div>
              </label>
              <label className="form__field">
                <span className="form__label">Роль:</span>
                <input className="form__input" name="role" type="text" value={studentWithNoRoleRole} onChange={(e) => {
                  setStudentWithNoRoleRole(e.target.value);
                }}/>
              </label>
              <button className="form__submit" type="submit">Добавить участника</button>
            </form>
          </div>
        </div>
      </CSSTransition>
    </div>
  )
}

export default EventDetails;