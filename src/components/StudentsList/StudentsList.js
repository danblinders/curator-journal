import moment from 'moment';
import { useState } from 'react';
import {SlideDown} from 'react-slidedown';
import 'react-slidedown/lib/slidedown.css';

const StudentsList = ({studentsToShow = [], deleteRow}) => {
  const studentsItems = studentsToShow.map((student, id) => {
    return (
      <StudentListItem student={student} id={id} deleteRow={deleteRow} />
    )
  });

  if (studentsItems.length <= 0) {
    return 'Список студентов пуст';
  }

  return (
    <ul className="list">
      {studentsItems}
    </ul>
  )
}

export default StudentsList;

const StudentListItem = ({student, id, deleteRow}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const {student_id, first_name, second_name, last_name, birth_date, address, email, phone, group_id, is_in_dorm, is_leader, additional_info} = student;
  const formattedBirthDate = moment.utc(birth_date).format('DD/MM/YYYY');

  return (
    <li className="list__item">
      <div className="list__main">
        <div className="list__main-field">{id + 1}</div>
        <div className="list__main-field">{first_name} {second_name} {last_name}</div>
        <button className="btn-delete" onClick={() => setShowDropdown((state) => !state)}>{showDropdown ? 'Свернуть' : 'Подробнее'}</button>
        <button className="btn-delete" onClick={() => deleteRow(student_id)}>Удалить</button>
      </div>
      <SlideDown>
        {
          showDropdown &&
          <div className="list__dropdown">
            <div className="list__dropdown-item">Дата рождения: {formattedBirthDate}</div>
            <div className="list__dropdown-item">Адрес: {address}</div>
            <div className="list__dropdown-item">Email: {email ? email : '-' }</div>
            <div className="list__dropdown-item">Телефон: {phone ? phone : '-' }</div>
            <div className="list__dropdown-item">Группа: {group_id}</div>
            <div className="list__dropdown-item">Живет в общежитии: {is_in_dorm === 1 ? 'да' : 'нет'}</div>
            <div className="list__dropdown-item">Староста: {is_leader === 1 ? 'да' : 'нет'}</div>
            <div className="list__dropdown-item">Дополнительная информация: {additional_info}</div>
          </div>
        }
      </SlideDown>
    </li>
  );
};