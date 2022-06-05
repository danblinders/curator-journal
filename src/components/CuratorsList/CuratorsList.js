import { useState } from 'react';
import { SlideDown } from 'react-slidedown';
import 'react-slidedown/lib/slidedown.css';
import axios from 'axios';
import { CSSTransition } from 'react-transition-group';
import { useFormik } from 'formik';
import * as yup from 'yup';

const CuratorsList = ({curatorsToShow = [],  groupsList = [], updateCurators, startLoading, deleteRow}) => {
  const curatorsItems = curatorsToShow.map((curator, id) => {
    const curatorGroups = groupsList.filter(item => +item.curator_id === +curator.curator_id);
    const groupsWithoutCurator = groupsList.filter(item => item.curator_id === null);
    return (
      <CuratorsListItem key={`curator-${curator.curator_id}`} updateCurators={updateCurators} groupsWithoutCurator={groupsWithoutCurator} startLoading={startLoading} curator={curator} id={id} curatorGroups={curatorGroups} deleteRow={deleteRow} />
    )
  });

  if (curatorsItems.length <= 0) {
    return 'Список кураторов пуст';
  }

  return (
    <ul className="list">
      {curatorsItems}
    </ul>
  )
}

export default CuratorsList;

const CuratorsListItem = ({updateCurators, startLoading, groupsWithoutCurator, curator, curatorGroups, id, deleteRow}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showAddCuratorGroupForm, setShowAddCuratorGroupForm] = useState(false);
  const {curator_id, first_name, last_name, email, phone, login, password} = curator;

  const curatorGroupsItems = curatorGroups?.length > 0 ? curatorGroups.map((item, groupId) => {
    const deleteCuratorGroup = (itemId) => {
      startLoading();
      axios.post(
        "https://curator-backend.onrender.com/update", 
        {table_name: 'student_groups', table_col: 'curator_id', table_val: null, table_check_col: 'group_id', table_check_val: itemId}
      ).then((response) => {
        if(response.data.type === 'success') {
          updateCurators();
        }
      });
    }
    return (
      <li key={`curator-${curator.curator_id}-group-${item.group_id}`} className="list__sublist-item">
        <div className="list__item-wrapper">
          <h4 className="list__subtitle_secondary subtitle_secondary">{groupId + 1}. {item.group_name}</h4>
          <button className="btn-delete push-left" onClick={() => deleteCuratorGroup(item.group_id)}>Удалить</button>
        </div>
      </li>
    )
  }) : 
  <li className="list__sublist-item">
    У картора еще нет групп
  </li>;

  return (
    <li className="list__item">
      <div className="list__item-wrapper">
        <h3 className="list__subtitle subtitle">{id + 1}. {first_name} {last_name}</h3>
        <button className="details-btn push-left" onClick={() => setShowDropdown((state) => !state)}>{showDropdown ? 'Свернуть' : 'Подробнее'}</button>
        <button className="btn-delete" onClick={() => deleteRow(curator_id)}>Удалить</button>
      </div>
      <SlideDown>
        {
          showDropdown &&
          <div className="list__fields list__fields_cols list__fields_curator_info">
            <div className="list__field list__field_column">
              <div className="list__field">Email: <span>{email ? email : '-' }</span></div>
              <div className="list__field">Телефон: <span>{phone ? phone : '-' }</span></div>
              <div className="list__field">Login: <span>{login}</span></div>
              <div className="list__field">password: <span>{password}</span></div>
            </div>
            <div className="list__field list__field_group">
              <div>Группы куратора:</div>
              <ul className="list__sublist">
                {curatorGroupsItems}
              </ul>
              {groupsWithoutCurator.length > 0 ? <button className="add-btn" onClick={() => setShowAddCuratorGroupForm(true)}>Добавить группу</button> : null}
   
                <CSSTransition
                in={showAddCuratorGroupForm}
                timeout={500}
                classNames="modal"
                unmountOnExit
                >
                  <div className="modal">
                    <div className="modal__wrapper modal__wrapper_medium">
                      <AddGroupForm curatorId={curator.curator_id} changeLoading={startLoading} groupsWithoutCurator={groupsWithoutCurator} closeForm={() => setShowAddCuratorGroupForm(false)} updateCurators={updateCurators} />
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

const AddGroupForm = ({changeLoading, groupsWithoutCurator, closeForm, updateCurators, curatorId}) => {
  const [groupCuratorSearch, setGroupCuratorSearch] = useState('');
  const [showGroupsWithoutCurator, setShowGroupsWithoutCurator] = useState('');

  const formik_group_curator = useFormik({
    initialValues: {
      groupId: groupsWithoutCurator[0].group_id
    },
    validationSchema:
      yup.object({
        groupId: yup.string().required("Обязательное поле").max(40, 'Значение не должно превышать 40 символов')
      }),
      validateOnChange: false,
      validateOnBlur: false,
      onSubmit: () => {
        changeLoading();
        axios.post('https://curator-backend.onrender.com/update-group', 
        {group_id: +formik_group_curator.values.groupId, curator_id: curatorId}
        ).then(response => {
          if(response.data.type === 'success') {
            formik_group_curator.resetForm();
            updateCurators();
            closeForm();
          } else {
            formik_group_curator.resetForm();
            closeForm();
            console.log(response.data.message);
          }
        });
      }
  });

  return (
      <form action="#" method="POST" className="add-curator__form form" onSubmit={formik_group_curator.handleSubmit}>
        <div className="modal-close" onClick={() => closeForm()}><i className="fa fa-close"></i></div>
        <div className="form__field form__field_with_filter">
          <span className="form__label">Группа:</span>
          <div className="form__group">
            <div className="list__field form__show-box">Группа для добавления: <span>{groupsWithoutCurator.filter(group => group.group_id === +formik_group_curator.values.groupId)[0].group_name}</span></div>
            <button type="button" className="add-btn" onClick={() => setShowGroupsWithoutCurator(state => !state)} >{showGroupsWithoutCurator ? 'Свернуть' : 'Выбрать группу'}</button>
          </div>
          <input className="form__input form__input_hidden" value={groupsWithoutCurator.filter(group => group.group_id === +formik_group_curator.values.groupId)[0].group_name} onChange={formik_group_curator.handleChange} onBlur={formik_group_curator.handleBlur} name="group" type="text" readOnly/>
          <div className="form__filter">
            <SlideDown>
              {
                showGroupsWithoutCurator &&
                  <div className="form__filter-search">
                    <div className="list__subtitle_secondary subtitle_secondary">Выберите группу для добавления:</div>
                    <div className="form__filter-search-wrapper">
                      <input className="form__input form__input_filter" type="text" placeholder="Введите название группы" name="group-search" value={groupCuratorSearch} onChange={(e) => setGroupCuratorSearch(e.target.value)}/>
                    </div>
                    <div className="list__subtitle_secondary subtitle_secondary">Группы для выборки:</div>
                    <ul className="form__filter-list">
                      {groupsWithoutCurator.filter(group => group.group_name.includes(groupCuratorSearch.toUpperCase()))
                      .map(item => <li key={`group-filter-${item.group_id}`} className="form__filter-item" data-group-filter-id={item.group_id} onClick={(e) => formik_group_curator.setFieldValue('groupId', e.target.getAttribute('data-group-filter-id'))}>{item.group_name}</li> )}
                    </ul>
                  </div>
              }
            </SlideDown>
          </div>
          {formik_group_curator.errors.group && <span className="form__error">{formik_group_curator.errors.group}</span> }
        </div>
        <button className="form__submit" type="submit" >Отправить</button>
      </form>
  )
}