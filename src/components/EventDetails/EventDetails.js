import {useState, useEffect, useContext} from 'react';
import authContext from '../../context';
import { useParams } from 'react-router-dom'
import moment from 'moment';
import axios from 'axios';

const EventDetails = () => {
  const {id} = useParams();

  const loggedUser = useContext(authContext);

  const [eventInfo, setEventInfo] = useState(null);

  const eventsString = JSON.stringify(eventInfo);

  const updateEventInfo = () => {
    axios.get("http://localhost:3001/curator-event", {params: {event_id: id, curator_id: loggedUser.curator_id}}).then(response => {
      setEventInfo(response.data);
    });
  }

  useEffect(() => {
    updateEventInfo();
  }, [eventsString, id, loggedUser.curator_id]);

  let eventParticipantsByGroup = null;

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
      const studentsWithNoRoles = eventParticipantsByGroup[key].students.filter(elem => elem.role === null);
      const studentsWithRoles = eventParticipantsByGroup[key].students.filter(elem => elem.role !== null);

      participantsItems.push(<EventParticipantsItem key={key} updateEventData={updateEventInfo} event_id={id} group={eventParticipantsByGroup[key].name} group_id={key} studentsWithNoRoles={studentsWithNoRoles} studentsWithRoles={studentsWithRoles} />)
      // const studentItems = eventParticipantsByGroup[key].students.filter(elem => elem.role !== null).map(student => {
      //   return (
      //     <li key={`group-${key}-participant-${student.student_id}`}>
      //       <span>{student.first_name} {student.last_name} - </span>
      //       <span>{student.role}</span>
      //     </li>
      //   )
      // })
      // participantsItems.push(
      //   <div key={`group-${key}`}>
      //     <h2>Группа {eventParticipantsByGroup[key].name}</h2>
      //     <ul>
      //       {studentItems}
      //     </ul>
      //     <form action="add__participant form">
      //       <label className="form__field">
      //         <span className="form__label">Студент:</span>
      //         <input className="form__input" name="student" type="text"/>
      //         .input
      //       </label>
      //       <label className="from_field">
      //         <span className="form__label">Роль:</span>
      //         <input className="form__input" name="role" type="text"/>
      //       </label>
      //       <button className="form__submit" type="submit">Добавить участника</button>
      //     </form>
      //   </div>
      // )
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
          <div className="event-cell" data-event-id={event_id}>{event_id}</div>
          <div className="event-cell" data-event-name={event_name}>{event_name}</div>
          <div className="event-cell" data-event-descr={description}>{description}</div>
          <div className="event-cell"><img src={thumbSrc ? thumbSrc : null} alt={event_name} /></div>
          <div className="event-cell" data-event-start={start_date}>{formattedStartDate}</div>
          <div className="event-cell" data-event-end={end_date}>{formattedEndDate}</div>
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
  const [studentSearch, setStudentSearch] = useState('');
  const [studentWithNoRoleName, setStudentWithNoRoleName] = useState(studentsWithNoRoles[0].student_id);
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
      <form className="add__participant form" onSubmit={addParticipant}>
        <label className="form__field">
          <span className="form__label">Студент:</span>
          <input className="form__input" name="student" value={studentsWithNoRoles.filter(elem => elem.student_id === studentWithNoRoleName)[0]?.first_name + ' ' + studentsWithNoRoles.filter(elem => elem.student_id === studentWithNoRoleName)[0]?.last_name} onChange={(e) => setStudentWithNoRoleName(e.target.value) } type="text"/>
          <div className="participant-filter">
            <input type="text" value={studentSearch} onChange={(e) => setStudentSearch(e.target.value)} className="participant-filter__search"/>
            <ul className="participant-filter__list">
              {studentsWithNoRolesItems}
            </ul>
          </div>
        </label>
        <label className="from_field">
          <span className="form__label">Роль:</span>
          <input className="form__input" name="role" type="text" value={studentWithNoRoleRole} onChange={(e) => {
            setStudentWithNoRoleRole(e.target.value);
          }}/>
        </label>
        <button className="form__submit" type="submit">Добавить участника</button>
      </form>
    </div>
  )
}

export default EventDetails