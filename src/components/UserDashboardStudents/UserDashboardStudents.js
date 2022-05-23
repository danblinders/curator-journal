import { useState, useEffect, useContext } from 'react';
import authContext from '../../context';
import axios from 'axios';
import moment from 'moment';
import Loader from '../Loader/Loader';
import {SlideDown} from 'react-slidedown';
import 'react-slidedown/lib/slidedown.css';

const UserDashboardStudents = () => {
  const loggedUser = useContext(authContext);
  const [students, setStudents] = useState([]);
  const [parents, setParents] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([axios.get('http://localhost:3001/curator-students', { params: { id: loggedUser.curator_id } } ), axios.get("http://localhost:3001/all-parents")])
    .then(responses => {
      setStudents(responses[0].data);
      if(responses[1].data.type === "success") {
        setParents(responses[1].data.result);
      }
      setLoading(false);
    });
  }, [loggedUser.curator_id]);

  if (loading) {
    return <Loader/>
  }

  const groupedStudentsItems = students.groups?.map((group, id) => {
    const studentItems = students.items.filter(item => item.group_id === group.group_id).map((student, studentId) => {
      const studentParents = parents?.filter(parent => parent.student_id === student.student_id)
      return (
        <StudentItem parents={studentParents} key={student.student_id} studentInfo={student} id={studentId} />
      );
    });
    return (
      <GroupItem key={group.group_id} group={group} id={id}>
        {studentItems}
      </GroupItem>
    )
  });

  return (
    <ul className="list">
      {groupedStudentsItems}
    </ul>
  )
}

export default UserDashboardStudents;

const GroupItem = ({group, children}) => {
  const [showGroupStudents, setShowGroupStudents] = useState(false);

  return (
    <li className="list__item">
      <div className="list__item-wrapper">
        <h3 className="list__subtitle subtitle">{group.group_name}</h3>
        <button className="details-btn push-left" onClick={() => setShowGroupStudents((state) => !state)}>{showGroupStudents ? 'Свернуть' : 'Подробнее'}</button>
      </div>
      <SlideDown>
        {showGroupStudents && 
          <>
            <div>Список студентов:</div>
            <ul className="list__sublist">
              {children}
            </ul>
          </>
        }
      </SlideDown>
    </li>
  );
}

const StudentItem =  ({studentInfo, parents, id}) => {
  const [showStudentInfo, setShowStudentInfo] = useState(false);
  const {first_name, second_name, last_name, birth_date, address, email, phone, group_id, is_in_dorm, is_leader, additional_info} = studentInfo;
  const formattedBirthDate = moment.utc(birth_date).format('DD/MM/YYYY');

  const parentsItems = parents ? (parents.length > 0 ? parents.map((item, parentId) => {
    return (
      <li key={`student-${studentInfo.student_id}-parent-${item.parent_id}`} className="list__sublist-item">
        <div className="list__item-wrapper">
          <h4 className="list__subtitle_secondary subtitle_secondary">{parentId + 1}. {item.first_name} {item.second_name} {item.last_name}</h4>
          <div className="list__label">{item.role}</div>
        </div>
        <div className="list__fields">
          <div className="list__field">Телефон: <span>{item.phone ? item.phone : '-'}</span></div>
          <div className="list__field">Email: <span>{item.email ? item.email : '-'}</span></div>
        </div>
      </li>
    )
  }) :
  <li className="list__sublist-item">У студента отсутствуют официальные представители</li>
  ) 
  : <li className="list__sublist-item"></li>; 

  return (
    <li className="list__sublist-item">
      <div className="list__item-wrapper">
        <h4 className="list__subtitle-secondary subtitle_secondary" >{id + 1}. {first_name} {second_name} {last_name}</h4>
        <button className="details-btn push-left" onClick={() => setShowStudentInfo((state) => !state)}>{showStudentInfo ? 'Свернуть' : 'Подробнее'}</button>
      </div>
      <SlideDown>
        {
          showStudentInfo &&
          <div className="list__fields list__fields_cols list__fields_student_info">
            <div className="list__field list__field_column">
              <div className="list__field">Дата рождения: <span>{formattedBirthDate}</span></div>
              <div className="list__field">Адрес: <span>{address}</span></div>
              <div className="list__field">Email: <span>{email ? email : '-' }</span></div>
              <div className="list__field">Телефон: <span>{phone ? phone : '-' }</span></div>
              <div className="list__field">Группа: <span>{group_id}</span></div>
              <div className="list__field">Живет в общежитии: <span>{is_in_dorm === 1 ? 'да' : 'нет'}</span></div>
              {is_leader === 1 ? <div className="list__field">Староста группы</div> : null}
              <div className="list__field list__field_column">Дополнительная информация: <span>{additional_info}</span></div>
            </div>
            <div className="list__field list__field_group">
              <div className="list__subtitle subtitle__secondary subtitle_with_margin">Представители студента: </div>
              <ul className="list__sublist">
                {parentsItems}
              </ul>
            </div>
          </div>
        }
      </SlideDown>
  </li>
  );
};