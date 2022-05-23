import { useState } from 'react';
import moment from 'moment';
import {SlideDown} from 'react-slidedown';
import 'react-slidedown/lib/slidedown.css';

const EventsList = ({eventsToShow, deleteRow}) => {
  const eventsItems = eventsToShow.map((eventItem, id) => {
    

    return <EventListItem eventObj={eventItem} id={id} deleteRow={deleteRow} />
  });

  if (eventsItems.length <= 0) {
    return <div>Нет событий</div>
  }

  return (
    <ul className="list">
      {eventsItems}
    </ul>
  )
}

export default EventsList;


const EventListItem = ({eventObj, id, deleteRow}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const {event_id, event_name, description, thumbnail, start_date, end_date} = eventObj;
  const formattedStartDate = moment.utc(start_date).format('DD/MM/YYYY');
  const formattedEndDate = moment.utc(end_date).format('DD/MM/YYYY');
  
  let thumbExt;

  switch(thumbnail[0]) {
    case '/':
      thumbExt = 'jpg';
      break;
    case 'i':
      thumbExt = 'png';
      break;
    case 'U':
      thumbExt = 'webp';
      break;
    case 'P':
      thumbExt = 'svg';
      break;
    default:
      thumbExt = null;
      break;
  }

  const thumbSrc = `data:image/${thumbExt};base64,${thumbnail}`;

  return (
    <li className="list__item">
      <div className="list__item-wrapper">
        <h3 className="list__subtitle subtitle">{id + 1}. {event_name}</h3>
        <button className="details-btn push-left" onClick={() => setShowDropdown((state) => !state)}>{showDropdown ? 'Свернуть' : 'Подробнее'}</button>
        <button className="btn-delete" onClick={() => deleteRow(event_id)}>Удалить</button>
      </div>
      <SlideDown>
        {
          showDropdown &&
          <div className="list__fields list__fields_cols">
            <div className="list__field list__field_image">
              <img src={thumbSrc} alt={event_name}/>
            </div>
            <div className="list__field list__field_column">
              <div className="list__field list__field_column">
                Описание:
                <span>{description}</span>
              </div>
              <div className="list__field">Даты: <span>{formattedStartDate} - {formattedEndDate}</span></div>
            </div>
          </div>
        }
      </SlideDown>
    </li>
  );
};