import { useState } from 'react';
import {SlideDown} from 'react-slidedown';
import 'react-slidedown/lib/slidedown.css';

const GroupList = ({groupsToShow = [], students = [], deleteRow}) => {
  const groupsItems = groupsToShow.map((group, id) => {
    const groupStudents = students?.filter(item => +item.group_id === +group.group_id);

    return (
      <GroupListItem group={group} groupStudents={groupStudents} id={id} deleteRow={deleteRow} />
    )
  });

  if (groupsItems.length <= 0) {
    return 'Список групп пуст';
  }

  return (
    <ul className="list">
      {groupsItems}
    </ul>
  )
}

export default GroupList;

const GroupListItem = ({group, groupStudents, id, deleteRow}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const {group_id, group_name} = group;

  const studentItems = groupStudents.map(
    ({first_name, second_name, last_name}, id) => {
      return (
        <li className="list__sublist-item">
          <h4 className="list__subtitle_secondary subtitle_secondary">{id + 1}. {first_name} {second_name} {last_name}</h4>
        </li>
      )
    });

  return (
    <li className="list__item">
      <div className="list__item-wrapper">
        <h3 className="list__subtitle subtitle">{id + 1}. {group_name}</h3>
        <div className="list__label">Число студентов: {groupStudents.length}</div>
        {groupStudents.length > 0 ? <button className="details-btn push-left" onClick={() => setShowDropdown((state) => !state)}>{showDropdown ? 'Свернуть' : 'Подробнее'}</button> : null} 
        <button className={`btn-delete ${groupStudents.length <= 0 ? 'push-left' : null}`} onClick={() => deleteRow(group_id)}>Удалить</button>
      </div>
      <SlideDown>
        {
          showDropdown &&
          <>
            <div className="group-students">Список студентов:</div>
            <ul className="list__sublist">
              {studentItems}
            </ul>
          </>
        }
      </SlideDown>
    </li>
  );
};