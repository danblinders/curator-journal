import moment from 'moment';

const StudentsList = ({studentsToShow = [], deleteRow}) => {
  const studentsItems = studentsToShow.map(({student_id, first_name, second_name, last_name, birth_date, address, email, phone, group_id, is_in_dorm, additional_info}) => {
    const formattedBirthDate = moment.utc(birth_date).format('DD/MM/YYYY');
    return (
      <tr className="table__row" key={`student-${student_id}`}>
        <td className="table__cell" data-student-id={student_id}>{student_id}</td>
        <td className="table__cell" data-student-first={first_name}>{first_name}</td>
        <td className="table__cell" data-student-second={second_name}>{second_name}</td>
        <td className="table__cell" data-student-last={last_name}>{last_name}</td>
        <td className="table__cell" data-student-birth={birth_date}>{formattedBirthDate}</td>
        <td className="table__cell" data-student-addr={address}>{address}</td>
        <td className="table__cell" data-student-email={email}>{email}</td>
        <td className="table__cell" data-student-phone={phone}>{phone}</td>
        <td className="table__cell" data-student-dorm={is_in_dorm}>{is_in_dorm}</td>
        <td className="table__cell" data-student-add={additional_info}>{additional_info}</td>
        <td className="table__cell" data-student-group={group_id}>{group_id}</td>
        <td className="table__cell"><button className="btn-delete" onClick={() => deleteRow(student_id)}>Удалить</button></td>
      </tr>
    )
  });

  if (studentsItems.length <= 0) {
    return 'Список студентов пуст';
  }

  return (
    <table className="table">
      <tbody>
        {studentsItems}
      </tbody>
    </table>
  )
}

export default StudentsList;