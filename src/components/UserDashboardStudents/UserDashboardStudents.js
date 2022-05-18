import { useState, useEffect, useContext } from 'react';
import authContext from '../../context';
import axios from 'axios';
import moment from 'moment';
import Loader from '../Loader/Loader';

const UserDashboardStudents = () => {
  const loggedUser = useContext(authContext);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:3001/curator-students', { params: { id: loggedUser.curator_id } } )
    .then(response => {
      setStudents(response.data);
      setLoading(false);
    });
  }, [loggedUser.curator_id]);

  if (loading) {
    return <Loader/>
  }

  const groupedStudentsItems = students.groups?.map(group => {
    const studentItems = students.items.filter(item => item.group_id === group.group_id).map(student => {
      const formattedBirthDate = moment.utc(student.birth_date).format('DD/MM/YYYY');
      return (
        <tr key={`student-${student.student_id}`} className="table__row">
          <td className="table__cell">{student.first_name}</td>
          <td className="table__cell">{student.second_name}</td>
          <td className="table__cell">{student.last_name}</td>
          <td className="table__cell">{formattedBirthDate}</td>
          <td className="table__cell">{student.address}</td>
          <td className="table__cell">{student.phone}</td>
          <td className="table__cell">{student.email}</td>
          <td className="table__cell">{student.is_in_dorm}</td>
          <td className="table__cell">{student.additional_info}</td>
        </tr>
      );
    });
    return (
      <table key={`group-${group.group_id}`} className="group-table table">
        <thead>
          <tr>
            <th>{group.group_name}</th>
          </tr>
        </thead>
        <tbody>
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

export default UserDashboardStudents;