import { useState, useEffect,useMemo } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import InputMask from 'react-input-mask';
import StudentsList from '../StudentsList/StudentsList';
import Modal from '../Modal/Modal';
import axios from 'axios';

const AdminDashboardStudents = () => {
  const [students, setStudents] = useState([]);
  const [groups, setGroups] = useState([]);

  const studentsString = useMemo(() => JSON.stringify(students), [students]);
  const groupsString = useMemo(() => JSON.stringify(groups), [groups]);

  useEffect(() => {
    axios.get("http://localhost:3001/all-students").then(response => {
      setStudents(response.data);
    });
  }, [studentsString]);

  useEffect(() => {
    axios.get("http://localhost:3001/all-groups").then(response => {
      setGroups(response.data);
    });
  }, [groupsString]);

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
        <AddStudentForm studentsList={students} updateStudents={setStudents} groupsList={groups} />
      </div>
    </>
  )
}

const AddStudentForm = ({studentsList, updateStudents, groupsList}) => {
  const [groupSearch, setGroupSearch] = useState('');
  const formik_student = useFormik({
    initialValues:{
      isLeader: false,
      firstName: '',
      secondName: '',
      lastName: '',
      birthDate: '',
      address: '',
      email: '',
      phone: '',
      group: 0,
      isInDorm: false,
      addInfo: '',
    },
    validationSchema : yup.object(
      {
        firstName: yup.string().required("Обязательно поле").max(40, 'Значение не должно превышать 40 символов'),
        secondName: yup.string().max(40, 'Значение не должно превышать 40 символов'),
        lastName: yup.string().required("Обязательно поле").max(40, 'Значение не должно превышать 40 символов'),
        birthDate: yup.string().required("Обязательно поле"),
        address: yup.string().required("Обязательно поле"),
        email: yup.string().required("Обязательно поле").email("Введен неверный формат email"),
        phone: yup.string().required("Обязательно поле"),
        group: yup.string().required("Обязательно поле"),
        addInfo: yup.string().max(1000, 'Текст не должен превышать 1000 символов'),
      }
    ),
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: () => {
      setStep(2);
    }
  });

  const formik_parents = useFormik({
    initialValues:{
      isParentOneAbsent: false,
      parentOneFirstName: '',
      parentOneSecondName: '',
      parentOneLastName: '',
      parentOneEmail: '',
      parentOnePhone: '',
      parentOneRole: 'родитель',
      isParentTwoAbsent: false,
      parentTwoFirstName: '',
      parentTwoSecondName: '',
      parentTwoLastName: '',
      parentTwoEmail: '',
      parentTwoPhone: '',
      parentTwoRole: 'родитель',
    },
    validationSchema : yup.object(
      {
        parentOneFirstName: yup.string().when(
          'isParentOneAbsent', 
          {
            is: false,
            then: yup.string().required("Обязательно поле").max(40, 'Значение не должно превышать 40 символов'),
            otherwise: yup.string()
          }
        ),
        parentOneSecondName: yup.string().when(
          'isParentOneAbsent', 
          {
            is: false,
            then: yup.string().required("Обязательно поле").max(40, 'Значение не должно превышать 40 символов'),
            otherwise: yup.string()
          }
        ),
        parentOneLastName: yup.string().when(
          'isParentOneAbsent', 
          {
            is: false,
            then: yup.string().required("Обязательно поле").max(40, 'Значение не должно превышать 40 символов'),
            otherwise: yup.string()
          }
        ),
        parentOnePhone: yup.string().when(
          'isParentOneAbsent', 
          {
            is: false,
            then: yup.string().required("Обязательно поле"),
            otherwise: yup.string()
          }
        ),
        parentOneEmail: yup.string().when(
          'isParentOneAbsent', 
          {
            is: false,
            then: yup.string().required("Обязательно поле").email("Введен неверный формат email"),
            otherwise: yup.string()
          }
        ),
        parentTwoFirstName: yup.string().when(
          'isParentTwoAbsent', 
          {
            is: false,
            then: yup.string().required("Обязательно поле").max(40, 'Значение не должно превышать 40 символов'),
            otherwise: yup.string()
          }
        ),
        parentTwoSecondName: yup.string().when(
          'isParentTwoAbsent', 
          {
            is: false,
            then: yup.string().required("Обязательно поле").max(40, 'Значение не должно превышать 40 символов'),
            otherwise: yup.string()
          }
        ),
        parentTwoLastName: yup.string().when(
          'isParentTwoAbsent', 
          {
            is: false,
            then: yup.string().required("Обязательно поле").max(40, 'Значение не должно превышать 40 символов'),
            otherwise: yup.string()
          }
        ),
        parentTwoPhone: yup.string().when(
          'isParentTwoAbsent', 
          {
            is: false,
            then: yup.string().required("Обязательно поле"),
            otherwise: yup.string()
          }
        ),
        parentTwoEmail: yup.string().when(
          'isParentTwoAbsent', 
          {
            is: false,
            then: yup.string().required("Обязательно поле").email("Введен неверный формат email"),
            otherwise: yup.string()
          }
        )
      }
    ),
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: () => {
      console.log(formik_student.values);
      console.log(formik_parents.values);
      setStep(3);
    }
  });

  const [step, setStep] = useState(1);
  //       [groupSearch, setGroupSearch] = useState(''),
  //       [isLeader, setIsLeader] = useState(false),
  //       [firstName, setFirstName] = useState(''),
  //       [secondName, setSecondName] = useState(''),
  //       [lastName, setLastName] = useState(''),
  //       [birthDate, setBirthDate] = useState(''),
  //       [address, setAddress] = useState(''),
  //       [email, setEmail] = useState(''),
  //       [phone, setPhone] = useState(''),
  //       [group, setGroup] = useState(''),
  //       [isInDorm, setIsInDorm] = useState(false),
  //       [addInfo, setAddInfo] = useState(''),
  //       [parentOneFirstName, setParentOneFirstName] = useState(''),
  //       [parentOneSecondName, setParentOneSecondName] = useState(''),
  //       [parentOneLastName, setParentOneLastName] = useState(''),
  //       [parentOneEmail, setParentOneEmail] = useState(''),
  //       [parentOnePhone, setParentOnePhone] = useState(''),
  //       [parentTwoFirstName, setParentTwoFirstName] = useState(''),
  //       [parentTwoSecondName, setParentTwoSecondName] = useState(''),
  //       [parentTwoLastName, setParentTwoLastName] = useState(''),
  //       [parentTwoEmail, setParentTwoEmail] = useState(''),
  //       [parentTwoPhone, setParentTwoPhone] = useState('');

  const addStudent = (e) => {
    e.preventDefault();
    // console.log(formik_student.values);
    // console.log(formik_parents.values);
    // setStep(3);
    // axios.post('http://localhost:3001/add-student', 
    //           {first_name: firstName, second_name: secondName, last_name: lastName, birth_date: birthDate, address, email, phone,
    //           is_in_dorm: isInDorm, additional_info: addInfo, group_id: group}
    // ).then(() => {
    //   updateStudents(studentsList);
    // });
  }

  let renderedComponent = null;

  switch(step) {
    case 1:
      renderedComponent = <form className="add-student__form form" action="#" method="POST" onSubmit={formik_student.handleSubmit}>
        <label className="form__field">
          <span className="form__label">Имя:</span>
          <input className="form__input" value={formik_student.values.firstName} onChange={formik_student.handleChange} name="firstName" type="text"/>
          {formik_student.errors.firstName && <span className="form__error">{formik_student.errors.firstName}</span> }
        </label>
        <label className="form__field">
          <span className="form__label">Отчество:</span>
          <input className="form__input" value={formik_student.values.secondName} onChange={formik_student.handleChange} name="secondName" type="text"/>
          {formik_student.errors.secondName && <span className="form__error">{formik_student.errors.secondName}</span> }
        </label>
        <label className="form__field">
          <span className="form__label">Фамилия:</span>
          <input className="form__input" value={formik_student.values.lastName} onChange={formik_student.handleChange} name="lastName" type="text"/>
          {formik_student.errors.lastName && <span className="form__error">{formik_student.errors.lastName}</span> }
        </label>
        <label className="form__field">
          <span className="form__label">Дата рождения:</span>
          <InputMask
            mask="99-99-9999"
            maskPlaceholder="_"
            value={formik_student.values.birthDate} 
            alwaysShowMask={false}
            onChange={formik_student.handleChange}
          >
            {() => <input className="form__input" name="birthDate" placeholder="дд-мм-гггг" type="text"/>}
          </InputMask>
          {formik_student.errors.birthDate && <span className="form__error">{formik_student.errors.birthDate}</span> }
        </label>
        <label className="form__field">
          <span className="form__label">Адрес:</span>
          <input className="form__input" value={formik_student.values.address} onChange={formik_student.handleChange} name="address" type="text"/>
          {formik_student.errors.address && <span className="form__error">{formik_student.errors.address}</span> }
        </label>
        <label className="form__field">
          <span className="form__label">Телефон:</span>
          <InputMask
            mask="+7(999)999-99-99"
            maskPlaceholder="_"
            value={formik_student.values.phone} 
            alwaysShowMask={false}
            onChange={formik_student.handleChange}
          >
            {() => <input className="form__input" name="phone" placeholder="+7(111)111-11-11" type="text"/>}
          </InputMask>
          {formik_student.errors.phone && <span className="form__error">{formik_student.errors.phone}</span> }
        </label>
        <label className="form__field">
          <span className="form__label">Email:</span>
          <input className="form__input" value={formik_student.values.email} onChange={formik_student.handleChange} name="email" type="text"/>
          {formik_student.errors.email && <span className="form__error">{formik_student.errors.email}</span> }
        </label>
        <label className="form__field-check">
          <span className="form__label">Проживает в общежитии</span>
          <input className="form__input" onChange={formik_student.handleChange} name="isInDorm" type="checkbox" checked={formik_student.values.isInDorm ? true : false}/>
        </label>
        <label className="form__field">
          <span className="form__label">Староста</span>
          <input className="form__input" value={formik_student.values.isLeader} onChange={formik_student.handleChange} name="isLeader" type="checkbox" checked={formik_student.values.isLeader ? true : false}/>
        </label>
        <label className="form__field">
          <span className="form__label">Группа:</span>
          <input className="form__input" value={groupsList.filter(item => item.group_id === +formik_student.values.group)[0]?.group_name} onChange={formik_student.handleChange} onBlur={formik_student.handleBlur} name="group" type="text" readOnly/>
          <div className="form__filter">
            <div className="form__filter-search">
              <input type="text" name="group-search" value={groupSearch} onChange={(e) => setGroupSearch(e.target.value)}/>
              <ul className="form__filter-list">
                {groupsList.filter(group => group.group_name.includes(groupSearch.toUpperCase()))
                .map(item => <li className="form__filter-item" data-group-filter-id={item.group_id} onClick={(e) => formik_student.setFieldValue('group', e.target.getAttribute('data-group-filter-id'))}>{item.group_name}</li> )}
              </ul>
            </div>
          </div>
          {formik_student.errors.group && <span className="form__error">{formik_student.errors.group}</span> }
        </label>
        <label className="form__field">
          <span className="form__label">Дополнительная информация:</span>
          <input className="form__input" value={formik_student.values.addInfo} onChange={formik_student.handleChange} name="addInfo" type="text"/>
          {formik_student.errors.addInfo && <span className="form__error">{formik_student.errors.addInfo}</span> }
        </label>
        <button className="form__submit" type="submit">Далее</button>
      </form>
      break;
    case 2:
      renderedComponent = <form className="add-student__form form" action="#" method="POST" onSubmit={formik_parents.handleSubmit}>
        <h3 className="form__subtitle">Представители студента</h3>
        <div className="form__left">
          <label className="form__field">
            <input className="form__input" onChange={formik_parents.handleChange} name="isParentOneAbsent" type="checkbox" checked={formik_parents.values.isParentOneAbsent ? true : false}/>
            <span className="form__label">Отсутствует</span>
            {console.log(formik_parents.values.isParentOneAbsent)}
          </label>
          <label className="form__field">
            <span className="form__label">Имя первого представителя:</span>
            <input className="form__input" value={formik_parents.values.parentOneFirstName} onChange={formik_parents.handleChange} name="parentOneFirstName" type="text"/>
            {formik_parents.errors.parentOneFirstName && <span className="form__error">{formik_parents.errors.parentOneFirstName}</span> }
          </label>
          <label className="form__field">
            <span className="form__label">Отчество первого представителя:</span>
            <input className="form__input" value={formik_parents.values.parentOneSecondName} onChange={formik_parents.handleChange} name="parentOneSecondName" type="text"/>
            {formik_parents.errors.parentOneSecondName && <span className="form__error">{formik_parents.errors.parentOneSecondName}</span> }
          </label>
          <label className="form__field">
            <span className="form__label">Фамилия первого представителя:</span>
            <input className="form__input" value={formik_parents.values.parentOneLastName} onChange={formik_parents.handleChange} name="parentOneLastName" type="text"/>
            {formik_parents.errors.parentOneLastName && <span className="form__error">{formik_parents.errors.parentOneLastName}</span> }
          </label>
          <label className="form__field">
            <span className="form__label">Телефон первого представителя:</span>
            <InputMask
              mask="+7(999)999-99-99"
              maskPlaceholder="_"
              value={formik_parents.values.parentOnePhone} 
              alwaysShowMask={false}
              onChange={formik_parents.handleChange}
            >
              {() => <input className="form__input" name="parentOnePhone" placeholder="+7(111)111-11-11" type="text"/>}
            </InputMask>
            {formik_parents.errors.parentOnePhone && <span className="form__error">{formik_parents.errors.parentOnePhone}</span> }
          </label>
          <label className="form__field">
            <span className="form__label">Email первого представителя:</span>
            <input className="form__input" value={formik_parents.values.parentOneEmail} onChange={formik_parents.handleChange} name="parentOneEmail" type="text"/>
            {formik_parents.errors.parentOneEmail && <span className="form__error">{formik_parents.errors.parentOneEmail}</span> }
          </label>
          <label className="form__field-check">
            <input className="form__input" onChange={formik_parents.getFieldProps("parentOneRole").onChange} value="родитель" name="parentOneRole" type="radio"/>
            <span className="form__label">Родитель</span>
          </label>
          <label className="form__field-check">
            <input className="form__input" onChange={formik_parents.getFieldProps("parentOneRole").onChange}  name="parentOneRole" value="опекун" type="radio" />
            <span className="form__label">Опекун</span>
          </label>
        </div>

        <div className="form__right">
          <label className="form__field">
            <input className="form__input" onChange={formik_parents.handleChange} name="isParentTwoAbsent" type="checkbox" checked={formik_parents.values.isParentTwoAbsent ? true : false}/>
            <span className="form__label">Отсутствует</span>
            {console.log(formik_parents.values.isParentTwoAbsent)}
          </label>
          <label className="form__field">
            <span className="form__label">Имя второго представителя:</span>
            <input className="form__input" value={formik_parents.values.parentTwoFirstName} onChange={formik_parents.handleChange} name="parentTwoFirstName" type="text"/>
            {formik_parents.errors.parentTwoFirstName && <span className="form__error">{formik_parents.errors.parentTwoFirstName}</span> }
          </label>
          <label className="form__field">
            <span className="form__label">Отчество второго представителя:</span>
            <input className="form__input" value={formik_parents.values.parentTwoSecondName} onChange={formik_parents.handleChange} name="parentTwoSecondName" type="text"/>
            {formik_parents.errors.parentTwoSecondName && <span className="form__error">{formik_parents.errors.parentTwoSecondName}</span> }
          </label>
          <label className="form__field">
            <span className="form__label">Фамилия второго представителя:</span>
            <input className="form__input" value={formik_parents.values.parentTwoLastName} onChange={formik_parents.handleChange} name="parentTwoLastName" type="text"/>
            {formik_parents.errors.parentTwoLastName && <span className="form__error">{formik_parents.errors.parentTwoLastName}</span> }
          </label>
          <label className="form__field">
            <span className="form__label">Телефон второго представителя:</span>
            <InputMask
              mask="+7(999)999-99-99"
              maskPlaceholder="_"
              value={formik_parents.values.parentTwoPhone} 
              alwaysShowMask={false}
              onChange={formik_parents.handleChange}
            >
              {() => <input className="form__input" name="parentTwoPhone" placeholder="+7(111)111-11-11" type="text"/>}
            </InputMask>
            {formik_parents.errors.parentTwoPhone && <span className="form__error">{formik_parents.errors.parentTwoPhone}</span> }
          </label>
          <label className="form__field">
            <span className="form__label">Email второго представителя:</span>
            <input className="form__input" value={formik_parents.values.parentTwoEmail} onChange={formik_parents.handleChange} name="parentTwoEmail" type="text"/>
            {formik_parents.errors.parentTwoEmail && <span className="form__error">{formik_parents.errors.parentTwoEmail}</span> }
          </label>
          <label className="form__field-check">
            <input className="form__input" onChange={formik_parents.getFieldProps("parentTwoRole").onChange} value="родитель" name="parentTwoRole" type="radio"/>
            <span className="form__label">Родитель</span>
          </label>
          <label className="form__field-check">
            <input className="form__input" onChange={formik_parents.getFieldProps("parentTwoRole").onChange}  name="parentTwoRole" value="опекун" type="radio" />
            <span className="form__label">Опекун</span>
          </label>
        </div>
        <button className="form__submit" type="submit">Подтвердить</button>
      </form>
      break;
    case 3:
      renderedComponent = (
        <Modal showState={true} message={'Новый студент добавлен!'}/>
      );
      break;
    default:
      renderedComponent = null;
  }

  return (
    <div className="add-student">
        {renderedComponent}
    </div>
  );

}

export default AdminDashboardStudents;