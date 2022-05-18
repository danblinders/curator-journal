import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import DatePicker, {DateObject} from 'react-multi-date-picker';
import authContext from '../../context';
import axios from 'axios';
import { CSSTransition } from 'react-transition-group';
import Loader from '../Loader/Loader';

const UserDashboardManagement = () => {
  const loggedUser = useContext(authContext);
  const [studentStats, setStudentStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:3001/curator-students-management', { params: { id: loggedUser.curator_id } } )
    .then(response => {
      setLoading(false);
      setStudentStats(response.data);
    });
  }, [loggedUser.curator_id]);

  if (loading) {
    return <Loader/>
  }

  const groupedStudentsItems = studentStats?.groups?.map(group => {
    const studentItems = studentStats?.students?.filter(item => item.group_id === group.group_id).map(student => {
      const studentData = studentStats?.stats?.filter(stat => stat.student_id === student.student_id);
      const studentMarks = studentData?.map(stat => +stat.mark);
      const studentMarksAverage = studentMarks?.reduce((sum, item) => sum + item, 0) / studentMarks.length;
      const studentPassed = studentData?.filter(data => data.attendance === 'п').length;
      const studentMissed = studentData?.filter(data => data.attendance === 'н' || data.attendance === 'б').length;
      return (
        <StudentManagementItem
          key={`management-list-item-${student.student_id}`} 
          studentInfo={student}
          studentMarksAverage={studentMarksAverage}
          studentPassed={studentPassed}
          studentMissed={studentMissed}
         />
      );
    });
    return (
      <table key={`management-group-${group.group_name}`} className="management-table table">
        <thead>
          <tr>
            <th>{group.group_name}</th>
          </tr>
        </thead>
        <tbody>
          <tr className="table-row">
            <th>Студент</th>
            <th>Средний балл по всем изучаемым дисциплинам</th>
            <th>Количество посещенных занятий</th>
            <th>Количество пропущенных занятий</th>
          </tr>
          {studentItems}
        </tbody>
      </table>
    )
  });

  return (
    <div>
      {groupedStudentsItems}
    </div>
  )
}

const StudentManagementItem = ({studentInfo, studentMarksAverage, studentPassed, studentMissed}) => {
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

  return (
    <tr key={`management-list-item-${studentInfo.student_id}`} className="table__row">
      <td className="table__cell">{studentInfo.first_name} {studentInfo.second_name}</td>
      <td className="table__cell">{studentMarksAverage}</td>
      <td className="table__cell">{studentPassed}</td>
      <td className="table__cell">{studentMissed}</td>
      <td className="table__cell"><button className="details-btn" onClick={() => setShowDatePicker(true)} >Подробнее</button></td>
      <CSSTransition
        in={showDatePicker}
        timeout={500}
        classNames="modal"
        unmountOnExit
      >
        <div className="modal">
          <div className="modal__wrapper">
            <button className="modal-close" onClick={() => setShowDatePicker(false)} ><i className="fa fa-close"></i></button>
            <h2 className="datepicker__title">Введите даты для отчета</h2>
            <div className="datepicker__content">
              {dateErr && <span className="form__error">Введите обе даты</span> }
              <DatePicker calendarPosition="bottom-left" fixMainPosition={true} range value={dateValues} onChange={setDateValues} weekDays={weekDays} months={months} />
              <button className="add-btn" onClick={createReport}>Создать отчет</button>
            </div>
          </div>
        </div>
      </CSSTransition>
    </tr>
  );
}

export default UserDashboardManagement