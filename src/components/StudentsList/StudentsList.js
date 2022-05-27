import moment from 'moment';
import { useState } from 'react';
import {SlideDown} from 'react-slidedown';
import 'react-slidedown/lib/slidedown.css';
import axios from 'axios';
import { useFormik } from 'formik';
import * as yup from 'yup';
import InputMask from 'react-input-mask';
import { CSSTransition } from 'react-transition-group';

const StudentsList = ({changeLoading, studentsToShow = [], updateParents, parents, deleteRow}) => {
  const studentsItems = studentsToShow.map((student, id) => {
    const studentParents = parents?.filter(item => item.student_id === student.student_id);
    
    return (
      <StudentListItem key={`student-${student.student_id}`} changeLoading={changeLoading} student={student} updateParents={updateParents} studentParents={studentParents} id={id} deleteRow={deleteRow} />
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

const StudentListItem = ({changeLoading, updateParents, student, studentParents, id, deleteRow}) => {
  const [showAddParentForm, setShowAddParentForm] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [studentParentsList, setStudentParentsList] = useState(studentParents);
  const {student_id, first_name, second_name, last_name, birth_date, address, email, phone, group_id, is_in_dorm, is_leader, additional_info} = student;
  const formattedBirthDate = moment.utc(birth_date).format('DD/MM/YYYY');

  const studentParentsItems = studentParentsList ? (studentParentsList.length > 0 ? studentParentsList.map( (studentParent, parentId) => {
    const deleteParent = (id) => {
      changeLoading(true);
      axios.post(
        "http://localhost:3001/delete", 
        {table_name: "parents", column_name: "parent_id", column_value: id}
      ).then((response) => {
        if(response.data.type === 'success') {
          setStudentParentsList((state) => state.filter(item => item.parent_id !== id));
          changeLoading(false);
        }
      });
    }
    return (
      <li key={`student-${student_id}-parent-${studentParent.parent_id}`} className="list__sublist-item">
        <div className="list__item-wrapper">
          <h4 className="list__subtitle_secondary subtitle__secondary">{parentId + 1}. {studentParent.first_name} {studentParent.second_name} {studentParent.last_name}</h4>
          <div className="list__label">{studentParent.role}</div>
          <button className="btn-delete push-left" onClick={() => deleteParent(studentParent.parent_id)}>Удалить</button>
        </div>
        <div className="list__fields">
          <div className="list__field">Телефон: <span>{studentParent.phone ? studentParent.phone : '-'}</span></div>
          <div className="list__field">Email: <span>{studentParent.email ? studentParent.email : '-'}</span></div>
        </div>
      </li>
    )
  }) : <li className="list__sublist-item">У студента отсутвуют официальные представители</li> ) : <li className="list__sublist-item">Произошла ошибка</li> 

  return (
    <li className="list__item">
      <div className="list__item-wrapper">
        <h3 className="list__subtitle subtitle">{id + 1}. {first_name} {second_name} {last_name}</h3>
        <button className="details-btn push-left" onClick={() => setShowDropdown((state) => !state)}>{showDropdown ? 'Свернуть' : 'Подробнее'}</button>
        <button className="btn-delete" onClick={() => deleteRow(student_id)}>Удалить</button>
      </div>
      <SlideDown>
        {
          showDropdown &&
          <div className="list__fields list__fields_cols list__fields_student_info">
            <div className="list__field list__field_group">
              <div className="list__field">Дата рождения: {formattedBirthDate}</div>
              <div className="list__field">Адрес: {address}</div>
              <div className="list__field">Email: {email ? email : '-' }</div>
              <div className="list__field">Телефон: {phone ? phone : '-' }</div>
              <div className="list__field">Группа: {group_id}</div>
              <div className="list__field">Живет в общежитии: {is_in_dorm === 1 ? 'да' : 'нет'}</div>
              {is_leader === 1 ? <div className="list__field">Староста группы</div> : null}
              <div className="list__field list_field_column">
                Дополнительная информация: {additional_info}
              </div>
            </div>
            <div className="list__field list__field_group">
              <div className="list__subtitle_secondary subtitle_secondary list__subtitle_with_margin">Представители студента:</div>
              <button className="add-btn" onClick={() => setShowAddParentForm(true)}>Добавить представителя</button>
              <ul className="list__sublist">
                {studentParentsItems}
              </ul>
              <CSSTransition
                in={showAddParentForm}
                timeout={500}
                classNames="modal"
                unmountOnExit
              >
                <div className="modal">
                  <div className="modal__wrapper modal__wrapper_medium">
                    <AddParentForm studentId={student_id} updateParents={updateParents} changeLoading={changeLoading} closeForm={() => setShowAddParentForm(false)} />
                  </div>
                </div>
              </CSSTransition>
            </div>
          </div>
        }
      </SlideDown>
    </li>
  );
};

const AddParentForm = ({studentId, changeLoading, closeForm, updateParents}) => {
  const formik_parent = useFormik({
    initialValues:{
      parentFirstName: '',
      parentSecondName: '',
      parentLastName: '',
      parentEmail: '',
      parentPhone: '',
      parentRole: 'родитель',
    },
    validationSchema : yup.object(
      {
        parentFirstName: yup.string().required("Обязательное поле").max(40, 'Значение не должно превышать 40 символов').matches(/^[аА-яЯaA-zZ\s]+$/, "Поле должно содержать только буквенные символы"),
        parentSecondName: yup.string().required("Обязательное поле").max(40, 'Значение не должно превышать 40 символов').matches(/^[аА-яЯaA-zZ\s]+$/, "Поле должно содержать только буквенные символы"),
        parentLastName:  yup.string().required("Обязательное поле").max(40, 'Значение не должно превышать 40 символов').matches(/^[аА-яЯaA-zZ\s]+$/, "Поле должно содержать только буквенные символы"),
        parentEmail: yup.string().email("Введен неверный формат email")
      }
    ),
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: () => {
      changeLoading(true);
      const parentFormData = {
        first_name: formik_parent.values.parentFirstName,
        second_name: formik_parent.values.parentSecondName,
        last_name: formik_parent.values.parentLastName,
        email: formik_parent.values.parentEmail,
        phone: formik_parent.values.parentPhone,
        role: formik_parent.values.parentRole,
        student_id: studentId
      }

      axios.post('http://localhost:3001/add-parent', 
      {parent: parentFormData}
      ).then((response) => {
        if(response.data.type === 'success') {
          closeForm();
          updateParents();
        } else {
          closeForm();
          updateParents();
        }
      });
    }
  });

  return (
<form className="add-parent__form form" action="#" method="POST" onSubmit={formik_parent.handleSubmit}>
      <div className="modal-close" onClick={() => {
        formik_parent.resetForm();
        closeForm();
      }}><i className="fa fa-close"></i></div>
          <h2 className="form__title title">Новый представитель</h2>
          <label className="form__field">
            <span className="form__label">Имя представителя:</span>
            <input className="form__input" value={formik_parent.values.parentFirstName} onChange={formik_parent.handleChange} name="parentFirstName" type="text"/>
            {formik_parent.errors.parentFirstName && <span className="form__error">{formik_parent.errors.parentFirstName}</span> }
          </label>
          <label className="form__field">
            <span className="form__label">Отчество представителя:</span>
            <input className="form__input" value={formik_parent.values.parentSecondName} onChange={formik_parent.handleChange} name="parentSecondName" type="text"/>
            {formik_parent.errors.parentSecondName && <span className="form__error">{formik_parent.errors.parentSecondName}</span> }
          </label>
          <label className="form__field">
            <span className="form__label">Фамилия представителя:</span>
            <input className="form__input" value={formik_parent.values.parentLastName} onChange={formik_parent.handleChange} name="parentLastName" type="text"/>
            {formik_parent.errors.parentLastName && <span className="form__error">{formik_parent.errors.parentLastName}</span> }
          </label>
          <label className="form__field">
            <span className="form__label">Телефон представителя:</span>
            <InputMask
              mask="+7(999)999-99-99"
              maskPlaceholder="_"
              value={formik_parent.values.parentPhone} 
              alwaysShowMask={false}
              onChange={formik_parent.handleChange}
            >
              {() => <input className="form__input" name="parentPhone" placeholder="+7(111)111-11-11" type="text"/>}
            </InputMask>
            {formik_parent.errors.parentPhone && <span className="form__error">{formik_parent.errors.parentPhone}</span> }
          </label>
          <label className="form__field">
            <span className="form__label">Email представителя:</span>
            <input className="form__input" value={formik_parent.values.parentEmail} onChange={formik_parent.handleChange} name="parentEmail" type="text"/>
            {formik_parent.errors.parentEmail && <span className="form__error">{formik_parent.errors.parentEmail}</span> }
          </label>
          <div className="form__wrapper">
            <label className="form__field form__field_check">
              <input className="form__input" onChange={formik_parent.getFieldProps("parentRole").onChange} value="родитель" name="parentRole" type="radio" checked={formik_parent.values.parentRole === "родитель" ? true : false}/>
              <span className="form__label">Родитель</span>
            </label>
            <label className="form__field form__field_check">
              <input className="form__input" onChange={formik_parent.getFieldProps("parentRole").onChange}  name="parentRole" value="опекун" type="radio" checked={formik_parent.values.parentRole === "опекун" ? true : false} />
              <span className="form__label">Опекун</span>
            </label>
          </div>
          <button className="form__submit" type="submit">Подтвердить</button>
      </form>
  );

}