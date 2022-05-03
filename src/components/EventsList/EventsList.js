import moment from 'moment';

const EventsList = ({eventsToShow, deleteRow}) => {
  const eventsItems = eventsToShow.map(({event_id, event_name, description, thumbnail, start_date, end_date}) => {
    const formattedStartDate = moment.utc(start_date).format('DD/MM/YYYY');
    const formattedEndDate = moment.utc(start_date).format('DD/MM/YYYY');
    const thumbSrc = window.URL.createObjectURL(new Blob( [thumbnail] ));
    return (
      <tr className="event-row" key={`event-${event_id}`}>
        <td className="event-cell" data-event-id={event_id}>{event_id}</td>
        <td className="event-cell" data-event-name={event_name}>{event_name}</td>
        <td className="event-cell" data-event-descr={description}>{description}</td>
        <td className="event-cell" data-event-thumb={thumbSrc}><img src={thumbSrc} alt={event_name} /></td>
        <td className="event-cell" data-event-start={start_date}>{formattedStartDate}</td>
        <td className="event-cell" data-event-end={end_date}>{formattedEndDate}</td>
        <td className="event-cell"><button className="btn-delete" onClick={() => deleteRow(event_id)}>Удалить</button></td>
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