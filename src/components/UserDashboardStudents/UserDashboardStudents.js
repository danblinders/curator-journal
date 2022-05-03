import { useState, useEffect, useContext } from 'react';
import authContext from '../../context';
import axios from 'axios';

const UserDashboardStudents = () => {
  const loggedUser = useContext(authContext);
  const [students, setStudents] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3001/curator-students', { params: { id: loggedUser.curator_id } } )
    .then(response => {
      setStudents(response.data);
    });
  }, []);

  const groupedStudentsItems = students.groups?.map(group => {
    const studentItems = students.items.filter(item => item.group_id === group.group_id).map(student => {
      return (
        <tr className="table-row">
          <td className="table-cell">{student.first_name}</td>
        </tr>
      );
    });
    return (
      <table className="group-table table">
        <thead>
          {group.group_name}
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

export default UserDashboardStudents