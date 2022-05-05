import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import authContext from '../../context';
import axios from 'axios';

const UserDashboardManagement = () => {
  const loggedUser = useContext(authContext);
  const [studentStats, setStudentStats] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:3001/curator-students-management', { params: { id: loggedUser.curator_id } } )
    .then(response => {
      setStudentStats(response.data);
    });
  }, []);

  const groupedStudentsItems = studentStats.groups?.map(group => {
    const studentItems = studentStats.students.filter(item => item.group_id === group.group_id).map(student => {
      const studentData = studentStats.stats.filter(stat => stat.student_id === student.student_id);
      const studentMarks = studentData.map(stat => +stat.mark);
      const studentMarksAverage = studentMarks.reduce((sum, item) => sum + item) / studentMarks.length;
      const studentPassed = studentData.filter(data => data.attendance === 'п').length;
      const studentMissed = studentData.filter(data => data.attendance === 'н' || data.attendance === 'б').length;
      return (
        <tr className="table-row">
          <td className="table-cell">{student.first_name} {student.second_name}</td>
          <td className="table-cell">{studentMarksAverage}</td>
          <td className="table-cell">{studentPassed}</td>
          <td className="table-cell">{studentMissed}</td>
          <td className="table-cell"><button className="details-button" onClick={() => navigate(`${student.student_id}`)} >Подробнее</button></td>
        </tr>
      );
    });
    return (
      <table className="management-table table">
        <thead>
          {group.group_name}
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

export default UserDashboardManagement