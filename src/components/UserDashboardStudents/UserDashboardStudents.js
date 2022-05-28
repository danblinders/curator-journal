import { useState, useEffect, useContext } from 'react';
import authContext from '../../context';
import axios from 'axios';
import moment from 'moment';
import Loader from '../Loader/Loader';
import {SlideDown} from 'react-slidedown';
import InputMask from 'react-input-mask';
import 'react-slidedown/lib/slidedown.css';

const UserDashboardStudents = () => {
  const loggedUser = useContext(authContext);
  const [students, setStudents] = useState([]);
  const [parents, setParents] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([axios.get('https://curator-journal-backend.onrender.com/curator-students', { params: { id: loggedUser.curator_id } } ), axios.get("https://curator-journal-backend.onrender.com/all-parents")])
    .then(responses => {
      if(responses[0].data.type === "success" && responses[1].data.type === "success") {
        setStudents(responses[0].data.result);
        setParents(responses[1].data.result);
        setLoading(false);
      }
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
  const [showStudentAddress, setShowStudentAddress] = useState(false);
  const [showStudentPhone, setShowStudentPhone] = useState(false);
  const [showStudentEmail, setShowStudentEmail] = useState(false);
  const [showStudentAddInfo, setShowStudentAddInfo] = useState(false);
  const {student_id, first_name, second_name, last_name, birth_date, address, email, phone, is_in_dorm, is_leader, additional_info} = studentInfo;
  const [studentInfoMutable, setStudentInfoMutable] = useState({address, email, phone, additional_info});
  const formattedBirthDate = moment.utc(birth_date).format('DD/MM/YYYY');
  const [updatableStudentInfo, setUpdatableStudentInfo] = useState({address, phone, email, additional_info});

  const updateValue = (table, col, val, check_col, check_val) => {
    axios.post('https://curator-journal-backend.onrender.com/update ', {table_name: table, table_col: col, table_val: val, table_check_col: check_col, table_check_val: check_val}).then(response => {
      if(response.data.type === 'success') {
        setStudentInfoMutable(state => {
          const newObj = {...state};
          newObj[`${col}`] = val;
          return newObj;
        });
      }
    });
  }

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
        <h4 className="list__subtitle-secondary subtitle_secondary" >{id + 1}. {first_name} {second_name} {last_name} {is_leader === 1 ? <span className="list__label list__label_gold">Староста группы</span> : null}</h4>
        <button className="details-btn push-left" onClick={() => setShowStudentInfo((state) => !state)}>{showStudentInfo ? 'Свернуть' : 'Подробнее'}</button>
      </div>
      <SlideDown>
        {
          showStudentInfo &&
          <div className="list__fields list__fields_cols list__fields_student_info">
            <div className="list__field list__field_column">
              <div className="list__field">Дата рождения: <span>{formattedBirthDate}</span></div>
              <div className="list__field">Адрес: <span>{studentInfoMutable.address}</span>
              <button className="update-btn" onClick={() => setShowStudentAddress(state => !state)} >{showStudentAddress ? 'Свернуть' : 'Изменить адрес'}</button></div>
              <SlideDown>
                {showStudentAddress &&
                  <>
                    <input className="form__input form__input_small" type="text" value={updatableStudentInfo.address} onChange={(e) => setUpdatableStudentInfo(state => ({...state, address: e.target.value}))} />
                    <button className="update-btn" type="button" onClick={() => updateValue('students', 'address', updatableStudentInfo.address, 'student_id', student_id)} >Изменить адрес</button>
                  </>
                }
              </SlideDown>
              <div className="list__field">Email: <span>{studentInfoMutable.email ? studentInfoMutable.email : '-' }</span> <button className="update-btn" onClick={() => setShowStudentEmail(state => !state)} >{showStudentEmail ? 'Свернуть' : 'Изменить email'}</button></div>
              <SlideDown>
                {showStudentEmail &&
                  <>
                    <input className="form__input form__input_small" type="text" value={updatableStudentInfo.email} onChange={(e) => setUpdatableStudentInfo(state => ({...state, email: e.target.value}))} />
                    <button className="update-btn" type="button" onClick={() => updateValue('students', 'email', updatableStudentInfo.email, 'student_id', student_id)} >Изменить email</button>
                  </>
                }
              </SlideDown>
              <div className="list__field">Телефон: <span>{studentInfoMutable.phone ? studentInfoMutable.phone : '-' }</span><button className="update-btn" onClick={() => setShowStudentPhone(state => !state)} >{showStudentPhone ? 'Свернуть' : 'Изменить телефон'}</button></div>
              <SlideDown>
                {showStudentPhone &&
                  <>
                    <InputMask
                      mask="+7(999)999-99-99"
                      maskPlaceholder="_"
                      value={updatableStudentInfo.phone} 
                      alwaysShowMask={false}
                      onChange={(e) => setUpdatableStudentInfo(state => ({...state, phone: e.target.value}))}
                    >
                      {() => <input className="form__input form__input_small" name="phone" placeholder="+7(111)111-11-11" type="text"/>}
                    </InputMask>
                    <button className="update-btn" type="button" onClick={() => updateValue('students', 'phone', updatableStudentInfo.phone, 'student_id', student_id)} >Изменить телефон</button>
                  </>
                }
              </SlideDown>
              <div className="list__field">Живет в общежитии: <span>{is_in_dorm === 1 ? 'да' : 'нет'}</span></div>
              <div className="list__field">Дополнительная информация:<button className="update-btn" onClick={() => setShowStudentAddInfo(state => !state)} >{showStudentAddInfo ? 'Свернуть' : 'Изменить доп.информацию'}</button></div>
              <div className="list__field"><span>{studentInfoMutable.additional_info}</span></div>
              <SlideDown>
                {showStudentAddInfo &&
                  <>
                    <input className="form__input form__input_small" type="text" value={updatableStudentInfo.additional_info} onChange={(e) => setUpdatableStudentInfo(state => ({...state, additional_info: e.target.value}))} />
                    <button className="update-btn" type="button" onClick={() => updateValue('students', 'additional_info', updatableStudentInfo.additional_info, 'student_id', student_id)} >Изменить доп.информацию</button>
                  </>
                }
              </SlideDown>
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