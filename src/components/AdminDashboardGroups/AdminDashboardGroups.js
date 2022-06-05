import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import Loader from '../Loader/Loader';
import GroupList from '../GroupList/GroupList';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { CSSTransition } from 'react-transition-group';

const AdminDashboardGroups = () => {
  const [loading, setLoading] = useState(true);
  const [groups, setGroups] = useState(null);
  const [students, setStudents] = useState(null);
  const [showGroupForm, setShowGroupForm] = useState(false);

  const studentsString = useMemo(() => JSON.stringify(students), [students]);
  const groupsString = useMemo(() => JSON.stringify(groups), [groups]);

  const getGroups = () => {
    Promise.all([axios.get("https://curator-backend.onrender.com/all-students"), axios.get("https://curator-backend.onrender.com/all-groups")]).then(
      responses => {
        if(responses[0].data.type === 'success' && responses[1].data.type === 'success') {
          setStudents(responses[0].data.result);
          setGroups(responses[1].data.result);
          setLoading(false);
        }
      }
    )
  }

  useEffect(() => {
    getGroups();
  }, [studentsString, groupsString]);

  const deleteGroup = (id) => {
    setLoading(true);
    axios.post(
      "https://curator-backend.onrender.com/delete", 
      {table_name: "student_groups", column_name: "group_id", column_value: id}
    ).then((response) => {
      if(response.data.type === 'success') {
        getGroups();
      }
    });
  }

  if(loading) {
    return <Loader/>
  }

  return (
    <>
      <button className="add-btn" onClick={() => setShowGroupForm(true)}>Добавить группу</button>
      <div className="group-list-wrapper">
        <GroupList groupsToShow={groups} students={students} deleteRow={deleteGroup} />
      </div>
      <CSSTransition
        in={showGroupForm}
        timeout={500}
        classNames="modal"
        unmountOnExit
      >
        <div className="modal">
          <div className="modal__wrapper modal__wrapper_medium">
            <AddGroupForm changeLoading={setLoading} closeForm={() => setShowGroupForm(false)} updateCurators={getGroups}/>
          </div>
        </div>
      </CSSTransition>
    </>
  )
}

const AddGroupForm = ({changeLoading, closeForm, updateCurators}) => {

  const formik_curator = useFormik({
    initialValues: {
      groupName: ''
    },
    validationSchema:
      yup.object({
        groupName: yup.string().required("Обязательное поле").max(40, 'Значение не должно превышать 40 символов')
      }),
      validateOnChange: false,
      validateOnBlur: false,
      onSubmit: () => {
        changeLoading(true);
        axios.post('https://curator-backend.onrender.com/add-group', 
        {group_name: formik_curator.values.groupName}
        ).then(response => {
          if(response.data.type === 'success') {
            formik_curator.resetForm();
            updateCurators();
            closeForm(false);
          } else {
            formik_curator.resetForm();
            closeForm(false);
            console.log(response.data.message);
          }
        });
      }
  });

  return (
      <form action="#" method="POST" className="add-curator__form form" onSubmit={formik_curator.handleSubmit}>
        <div className="modal-close" onClick={() => closeForm()}><i className="fa fa-close"></i></div>
        <h2 className="form__title title">Новая группа</h2>
        <label className="form__field">
          <span className="form__label">Название группы:</span> 
          <input className="form__input" type="text" name="groupName" value={formik_curator.values.groupName} onChange={formik_curator.handleChange} />
          {formik_curator.errors.groupName && <span className="form__error">{formik_curator.errors.groupName}</span>}
        </label>
        <button className="form__submit" type="submit" >Отправить</button>
      </form>
  )
}

export default AdminDashboardGroups;