import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import DatePicker, {DateObject} from 'react-multi-date-picker';
import authContext from '../../context';
import axios from 'axios';
import { CSSTransition } from 'react-transition-group';
import Loader from '../Loader/Loader';
import {SlideDown} from 'react-slidedown';
import 'react-slidedown/lib/slidedown.css';

const UserDashboardManagement = () => {
  const loggedUser = useContext(authContext);
  const [studentStats, setStudentStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('https://curator-journal-backend.onrender.com/curator-students-management', { params: { id: loggedUser.curator_id } } )
    .then(response => {
      if(response.data.type === 'success') {
        setStudentStats(response.data.result);
        setLoading(false);
      }
    });
  }, [loggedUser.curator_id]);

  if (loading) {
    return <Loader/>
  }

  const groupedStudentsItems = studentStats?.groups?.map((group, id) => {
    const studentItems = studentStats?.students?.filter(item => item.group_id === group.group_id).map((student, studentId) => {
      const studentData = studentStats?.stats?.filter(stat => stat.student_id === student.student_id);

      return (
        <StudentManagementItem
          key={`management-list-item-${student.student_id}`}
          id={studentId}
          studentInfo={student}
          studentStat={studentData}
         />
      );
    });
    return (
      <GroupItem key={group.group_id} group={group} id={id} >
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

const StudentManagementItem = ({id, studentInfo, studentStat}) => {
  const startDate = new DateObject();
  const endDate = new DateObject().add(1, 'days');
  const navigate = useNavigate();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateErr, setDateError] = useState(false);
  const [dateValues, setDateValues] = useState([startDate, endDate]);

  const weekDays = ["ВС", "ПН", "ВТ", "СР", "ЧТ", "ПТ", "СБ"];
  const months = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];

  const createReport = () => {
    if(!dateValues[0] || !dateValues[1]) {
      setDateError(true);
      return;
    } else {
      navigate(`${studentInfo.student_id}?start_date=${dateValues[0]?.format('YYYY-MM-DD')}&end_date=${dateValues[1]?.format('YYYY-MM-DD')}`);
    }
  }


  if(!studentStat || studentStat.length <= 0) {
    return (
      <li className="list__sublist-item">
          <h4 className="list__subtitle_secondary subtitle_secondary">{id + 1}. {studentInfo.first_name} {studentInfo.second_name} {studentInfo.last_name}</h4>
          <div className="list__fields">
            <div className="list__field">Данных за последние 7 дней нет</div>
            <button className="details-btn push-left" onClick={() => setShowDatePicker(true)} >Сформировать отчет</button>
          </div>
          <CSSTransition
            in={showDatePicker}
            timeout={500}
            classNames="modal"
            unmountOnExit
          >
            <div className="modal">
              <div className="modal__wrapper modal__wrapper_small">
                <button className="modal-close" onClick={() => setShowDatePicker(false)} ><i className="fa fa-close"></i></button>
                <h2 className="datepicker__title">Введите даты для отчета</h2>
                <div className="datepicker__content">
                  {dateErr && <span className="form__error">Введите обе даты</span> }
                  <DatePicker inputClass="form__input" calendarPosition="bottom-left" fixMainPosition={true} range value={dateValues} onChange={setDateValues} weekDays={weekDays} months={months} />
                  <button className="add-btn" onClick={createReport}>Создать отчет</button>
                </div>
              </div>
            </div>
          </CSSTransition>
      </li>
    );
  }

  const studentMarks = studentStat.map(stat => +stat.mark);
  const studentMarksAverage = studentMarks.length > 0 ? studentMarks.reduce((sum, item) => sum + item, 0) / studentMarks.length : 'Оценок за последние 7 дней нет';
  const studentPassed = studentStat.filter(data => data.attendance === 'п').length;
  const studentMissed = studentStat?.filter(data => data.attendance === 'н' || data.attendance === 'б').length;

  return (
    <li key={`management-list-item-${studentInfo.student_id}`} className="list__sublist-item">
      <h4 className="list__subtitle_secondary subtitle_secondary">{id + 1}. {studentInfo.first_name} {studentInfo.second_name} {studentInfo.last_name}</h4>
      <div className="list__fields">
        <div className="list__field">Средний балл по всем предметам: <span>{studentMarksAverage}</span></div>
        <div className="list__field">Количество посещенных занятий: <span>{studentPassed}</span></div>
        <div className="list__field">Количество пропущенных занятий: <span>{studentMissed}</span></div>
        <button className="details-btn push-left" onClick={() => setShowDatePicker(true)} >Сформировать отчет</button>
      </div>
      <CSSTransition
        in={showDatePicker}
        timeout={500}
        classNames="modal"
        unmountOnExit
      >
        <div className="modal">
          <div className="modal__wrapper modal__wrapper_small">
            <button className="modal-close" onClick={() => setShowDatePicker(false)} ><i className="fa fa-close"></i></button>
            <h2 className="datepicker__title">Введите даты для отчета</h2>
            <div className="datepicker__content">
              {dateErr && <span className="form__error">Введите обе даты</span> }
              <DatePicker inputClass="form__input" calendarPosition="bottom-left" fixMainPosition={true} range value={dateValues} onChange={setDateValues} weekDays={weekDays} months={months} />
              <button className="add-btn" onClick={createReport}>Создать отчет</button>
            </div>
          </div>
        </div>
      </CSSTransition>
    </li>
  );
}

export default UserDashboardManagement;

const GroupItem = ({group, id, children}) => {
  const [showGroupStudents, setShowGroupStudents] = useState(false);

  return (
    <li className="list__item">
      <div className="list__item-wrapper">
        {/* <div className="list__main-field">{id + 1}</div> */}
        <h3 className="list__subtitle subtitle">{group.group_name}</h3>
        <button className="details-btn push-left" onClick={() => setShowGroupStudents((state) => !state)}>{showGroupStudents ? 'Свернуть' : 'Подробнее'}</button>
      </div>
      <SlideDown>
        {showGroupStudents && <ul className="list__sublist">{children}</ul>}
      </SlideDown>
    </li>
  );
}