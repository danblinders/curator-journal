import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import DatePicker, {DateObject} from 'react-multi-date-picker';
import authContext from '../../context';
import axios from 'axios';

const UserDashboardManagement = () => {
  const loggedUser = useContext(authContext);
  const [studentStats, setStudentStats] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:3001/curator-students-management', { params: { id: loggedUser.curator_id } } )
    .then(response => {
      setStudentStats(response.data);
    });
  }, []);

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
    <tr key={`management-list-item-${studentInfo.student_id}`} className="table-row">
      <td className="table-cell">{studentInfo.first_name} {studentInfo.second_name}</td>
      <td className="table-cell">{studentMarksAverage}</td>
      <td className="table-cell">{studentPassed}</td>
      <td className="table-cell">{studentMissed}</td>
      <td className="table-cell"><button className="details-button" onClick={() => setShowDatePicker(true)} >Подробнее</button></td>
      {showDatePicker && (
        <div className="date-picker-block">
          <h2 className="date-picker-block__title">Введите даты для отчета</h2>
          <div className="date-picker-block__content">
            {dateErr && <span className="form__error">Введите обе даты</span> }
            <DatePicker range value={dateValues} onChange={setDateValues} weekDays={weekDays} months={months} />
            <button className="btn" onClick={createReport}>Создать отчет</button>
          </div>
        </div>
      )}
    </tr>
  );
}

export default UserDashboardManagement