import moment from 'moment';

const EventsList = ({eventsToShow, deleteRow}) => {
  const eventsItems = eventsToShow.map(({event_id, event_name, description, thumbnail, start_date, end_date}) => {
    const formattedStartDate = moment.utc(start_date).format('DD/MM/YYYY');
    const formattedEndDate = moment.utc(start_date).format('DD/MM/YYYY');
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

    const thumbSrc = `data:image/${thumbExt};base64,${thumbnail}`

    return (
      <tr className="table__row" key={`event-${event_id}`}>
        <td className="table__cell" data-event-id={event_id}>{event_id}</td>
        <td className="table__cell" data-event-name={event_name}>{event_name}</td>
        <td className="table__cell" data-event-descr={description}>{description}</td>
        <td className="table__cell"><img src={thumbSrc ? thumbSrc : null} alt={event_name} /></td>
        <td className="table__cell" data-event-start={start_date}>{formattedStartDate}</td>
        <td className="table__cell" data-event-end={end_date}>{formattedEndDate}</td>
        <td className="table__cell"><button className="btn-delete" onClick={() => deleteRow(event_id)}>Удалить</button></td>
      </tr>
    )
  });

  if (eventsItems.length <= 0) {
    return <div>Нет событий</div>
  }

  return (
    <table className="table">
      <tbody>
        {eventsItems}
      </tbody>
    </table>
  )
}

export default EventsList;