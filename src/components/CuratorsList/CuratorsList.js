

const CuratorsList = ({curatorsToShow = [], deleteRow}) => {
  const curatorsItems = curatorsToShow.map(({curator_id, first_name, last_name, email, phone, login, password}) => {
    return (
      <tr className="table__row" key={`curator-${curator_id}`}>
        <td className="table__cell" data-curator-id={curator_id}>{curator_id}</td>
        <td className="table__cell" data-curator-first={first_name}>{first_name}</td>
        <td className="table__cell" data-curator-last={last_name}>{last_name}</td>
        <td className="table__cell" data-curator-email={email}>{email}</td>
        <td className="table__cell" data-curator-phone={phone}>{phone}</td>
        <td className="table__cell" data-curator-login={login}>{login}</td>
        <td className="table__cell" data-curator-password={password}>{password}</td>
        <td className="table__cell"><button className="btn-delete" onClick={() => deleteRow(curator_id)}>Удалить</button></td>
      </tr>
    )
  });

  if (curatorsItems.length <= 0) {
    return 'Список кураторов пуст';
  }

  return (
    <table className="table">
      <tbody>
        {curatorsItems}
      </tbody>
    </table>
  )
}

export default CuratorsList;