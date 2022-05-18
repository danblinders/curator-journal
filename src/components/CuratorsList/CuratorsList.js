import { useState } from 'react';
import {SlideDown} from 'react-slidedown';
import 'react-slidedown/lib/slidedown.css';

const CuratorsList = ({curatorsToShow = [], deleteRow}) => {
  const curatorsItems = curatorsToShow.map((curator, id) => {
    return (
      <CuratorsListItem curator={curator} id={id} deleteRow={deleteRow} />
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

const CuratorsListItem = ({curator, id, deleteRow}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const {curator_id, first_name, last_name, email, phone, login, password} = curator;

  return (
    <li className="list__item">
      <div className="list__main">
        <div className="list__main-field">{id + 1}</div>
        <div className="list__main-field">{first_name} - {last_name}</div>
        <button className="btn-delete" onClick={() => setShowDropdown((state) => !state)}>{showDropdown ? 'Свернуть' : 'Подробнее'}</button>
        <button className="btn-delete" onClick={() => deleteRow(curator_id)}>Удалить</button>
      </div>
      <SlideDown>
        {
          showDropdown &&
          <div className="list__dropdown">
            <div className="list__dropdown-item">Email: {email ? email : '-' }</div>
            <div className="list__dropdown-item">Телефон: {phone ? phone : '-' }</div>
            <div className="list__dropdown-item">Login: {login}</div>
            <div className="list__dropdown-item">password: {password}</div>
          </div>
        }
      </SlideDown>
    </li>
  );
};