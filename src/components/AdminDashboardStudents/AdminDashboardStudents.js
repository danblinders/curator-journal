import { useState, useEffect,useMemo } from 'react'
import StudentsList from '../StudentsList/StudentsList';
import axios from 'axios';

const AdminDashboardStudents = () => {
  const [students, setStudents] = useState([]);

  const studentsString = useMemo(() => JSON.stringify(students), [students]);

  useEffect(() => {
    axios.get("http://localhost:3001/all-students").then(response => {
      setStudents(response.data);
    });
  }, [studentsString]);

  const deleteStudent = (id) => {
    axios.post(
      "http://localhost:3001/delete", 
      {table_name: "students", column_name: "student_id", column_value: id}
    ).then(() => {
      setStudents(students.filter(({student_id}) => student_id !== id));
    });
  }


  return (
    <>
      <div className="events-list-wrapper">
        <StudentsList studentsToShow={students} deleteRow={deleteStudent} />
      </div>
      <div className="add-event-block">
        <AddStudentForm studentsList={students} updateStudents={setStudents} />
      </div>
    </>
  )
}

const AddStudentForm = ({studentsList, updateStudents}) => {
  const [firstName, setFirstName] = useState(''),
        [secondName, setSecondName] = useState(''),
        [lastName, setLastName] = useState(''),
        [birthDate, setBirthDate] = useState(''),
        [address, setAddress] = useState(''),
        [email, setEmail] = useState(''),
        [phone, setPhone] = useState(''),
        [group, setGroup] = useState(''),
        [isInDorm, setIsInDorm] = useState(''),
        [addInfo, setAddInfo] = useState('');

  const addStudent = (e) => {
    e.preventDefault();
    axios.post('http://localhost:3001/add-student', 
              {first_name: firstName, second_name: secondName, last_name: lastName, birth_date: birthDate, address, email, phone,
              is_in_dorm: isInDorm, additional_info: addInfo, group_id: group}
    ).then(() => {
      updateStudents(studentsList);
    });
  }

  return (
    <div className="add-curator">
      <form action="#" method="POST" className="add-curator__form form" onSubmit={addStudent}>
        {/* {error ? <span className="form__error">{error}</span>: null} */}
        <label className="form__field">
          <span className="form__label">Имя:</span> 
          <input className="form__input" type="text" name="first_name" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
        </label>
        <label className="form__field">
          <span className="form__label">Отчество:</span>
          <input className="form__input" type="text" name="second_name" value={secondName} onChange={(e) => setSecondName(e.target.value)} required />
        </label>
        <label className="form__field">
          <span className="form__label">Фамилия:</span>
          <input className="form__input" type="text" name="last_name" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
        </label>
        <label className="form__field">
          <span className="form__label">Дата рождения:</span>
          <input className="form__input" type="text" name="birth_date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} required />
        </label>
        <label className="form__field">
          <span className="form__label">Адрес:</span>
          <input className="form__input" type="text" name="last_name" value={address} onChange={(e) => setAddress(e.target.value)} required />
        </label>
        <label className="form__field">
          <span className="form__label">E-mail:</span>
          <input className="form__input" type="text" name="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>
        <label className="form__field">
          <span className="form__label">Телефон:</span>
          <input className="form__input" type="text" name="phone" value={phone} onChange={(e) => setPhone(e.target.value)} required />
        </label>
        <label className="form__field">
          <span className="form__label">Группа:</span>
          <input className="form__input" type="text" name="group" value={group} onChange={(e) => setGroup(e.target.value)} required />
        </label>
        <label className="form__field">
          <span className="form__label">Проживает ли в общежитии:</span>
          <input className="form__input" type="text" name="dorm" value={isInDorm} onChange={(e) => setIsInDorm(e.target.value)} required />
        </label>
        <label className="form__field">
          <span className="form__label">Дополнительная информация:</span>
          <input className="form__input" type="text" name="special" value={addInfo} onChange={(e) => setAddInfo(e.target.value)} required />
        </label>
        <button className="form__submit" type="submit" >Отправить</button>
      </form>
    </div>
  )
}

export default AdminDashboardStudents;