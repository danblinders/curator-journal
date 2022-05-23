import { useContext, useRef } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import authContext from '../../context';
import './UserDashBoard.scss';

const UserDashboard = ({logoutUser}) => {
  const mobileNavRef = useRef(null);
  const loggedUser = useContext(authContext);
  const signOut = () => {
    sessionStorage.removeItem('user');
    logoutUser(null);
  }

  return (
    <>
      <header className="header">
        <div className="container">
          <div className="header__wrapper">
            <div className="header__user">
              <h1 className="header__user-name">{loggedUser.first_name} {loggedUser.last_name}</h1>
            </div>
            <nav className="navbar">
              <div className="navbar__item">
                <NavLink end className={(navData) => navData.isActive ? "navbar__link navbar__link_active" : "navbar__link" } to={`/user/${loggedUser.curator_id}`}>
                  Главная
                </NavLink>
              </div>
              <div className="navbar__item">
                <NavLink className={(navData) => navData.isActive ? "navbar__link navbar__link_active" : "navbar__link" } to="students">
                  Студенты
                </NavLink>
              </div>
              <div className="navbar__item">
                <NavLink className={(navData) => navData.isActive ? "navbar__link navbar__link_active" : "navbar__link" } to="management">
                  Успеваемость и посещаемость
                </NavLink>
              </div>
              <div className="navbar__item">
                <NavLink className={(navData) => navData.isActive ? "navbar__link navbar__link_active" : "navbar__link" } to="events">
                  События
                </NavLink>
              </div>
            </nav>
            <div className="mobile-navbar-toggle push_left" onClick={() => mobileNavRef.current.classList.add('opened')}><i className="fa fa-bars"></i></div>
            <button className="header__logout" onClick={signOut}>Выйти</button>
          </div>
        </div>
      </header>
      <nav className="mobile-navbar" ref={mobileNavRef}>
        <div className="mobile-navbar__close" onClick={() => mobileNavRef.current.classList.remove('opened')}><i className="fa fa-close"></i></div>
        <div className="mobile-navbar__wrapper">
          <div className="navbar__item">
            <NavLink end className={(navData) => navData.isActive ? "navbar__link navbar__link_active" : "navbar__link" } to={`/user/${loggedUser.curator_id}`}>
              Главная
            </NavLink>
          </div>
          <div className="navbar__item">
            <NavLink className={(navData) => navData.isActive ? "navbar__link navbar__link_active" : "navbar__link" } to="students">
              Студенты
            </NavLink>
          </div>
          <div className="navbar__item">
            <NavLink className={(navData) => navData.isActive ? "navbar__link navbar__link_active" : "navbar__link" } to="management">
              Успеваемость и посещаемость
            </NavLink>
          </div>
          <div className="navbar__item">
            <NavLink className={(navData) => navData.isActive ? "navbar__link navbar__link_active" : "navbar__link" } to="events">
              События
            </NavLink>
          </div>
        </div>
      </nav>     
      <div className="page__content">
        <div className="container">
          <div className="page__content-wrapper">
            <Outlet/>
          </div>
        </div>
      </div>
    </>
  )
}

export default UserDashboard;