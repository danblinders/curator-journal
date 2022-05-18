import { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import InputMask from 'react-input-mask';
import CuratorsList from '../CuratorsList/CuratorsList';
import Loader from '../Loader/Loader';
import axios from 'axios';
import { CSSTransition } from 'react-transition-group';

const AdminDashboardCurators = () => {

  const [curators, setCurators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCuratorForm, setShowCuratorForm] = useState(false);

  const curatorsString = JSON.stringify(curators);

  const getCurators = () => {
    axios.get('http://localhost:3001/all-curators').then(response => {
      setCurators(response.data);
      setLoading(false);
    })
  }

  useEffect(() => {
    getCurators();
  }, [curatorsString]);

  const deleteCurator= (id) => {
    axios.post(
      "http://localhost:3001/delete", 
      {table_name: "curators", column_name: "curator_id", column_value: id}
    ).then(() => {
      setCurators(curators.filter(({curator_id}) => curator_id !== id));
      setLoading(false);
    });
  }

  if (loading) {
    return <Loader/>
  }


  return (
    <>
      <div className="curators-list">
        <CuratorsList curatorsToShow={curators} deleteRow={deleteCurator}/>
      </div>
      <button className="add-btn" onClick={() => setShowCuratorForm(true)}>Добавить куратора</button>
      <CSSTransition
        in={showCuratorForm}
        timeout={500}
        classNames="modal"
        unmountOnExit
      >
        <div className="modal">
          <div className="modal__wrapper">
            <AddCuratorForm changeLoading={setLoading} closeForm={() => setShowCuratorForm(false)} updateCurators={getCurators}/>
          </div>
        </div>
      </CSSTransition>
    </>
  )
}

const AddCuratorForm = ({changeLoading, closeForm, updateCurators}) => {

  const formik_curator = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      login: '',
      password: '',
      passwordRepeat: ''
    },
    validationSchema:
      yup.object({
        firstName: yup.string().required("Обязательное поле").max(40, 'Значение не должно превышать 40 символов').matches(/^[аА-яЯaA-zZ\s]+$/, "Поле должно содержать только буквенные символы"),
        lastName: yup.string().required("Обязательное поле").max(40, 'Значение не должно превышать 40 символов').matches(/^[аА-яЯaA-zZ\s]+$/, "Поле должно содержать только буквенные символы"),
        email: yup.string().required("Обязательное поле").email("Введен неверный формат email"),
        phone: yup.string().required("Обязательное поле"),
        login: yup.string().required("Обязательное поле"),
        password: yup.string().required("Обязательное поле"),
        passwordRepeat: yup.string().required("Обязательное поле").test(
          'equal',
          'Пароли не совпадают',
          function(val) {
            const ref = yup.ref('password');
            return val === this.resolve(ref);
          }
        )
      }),
      validateOnChange: false,
      validateOnBlur: false,
      onSubmit: () => {
        changeLoading(true);
        axios.post('http://localhost:3001/add-curator', 
        {first_name: formik_curator.values.firstName, last_name: formik_curator.values.lastName, email: formik_curator.values.email, phone: formik_curator.values.phone, login: formik_curator.values.login, password: formik_curator.values.password}
        ).then(() => {
          formik_curator.resetForm();
          updateCurators();
          closeForm(false);
        });
      }
  });

  return (
      <form action="#" method="POST" className="add-curator__form form" onSubmit={formik_curator.handleSubmit}>
        <div className="modal-close" onClick={() => closeForm()}><i className="fa fa-close"></i></div>
        <label className="form__field">
          <span className="form__label">Имя:</span> 
          <input className="form__input" type="text" name="firstName" value={formik_curator.values.firstName} onChange={formik_curator.handleChange} />
          {formik_curator.errors.firstName && <span className="form__error">{formik_curator.errors.firstName}</span>}
        </label>
        <label className="form__field">
          <span className="form__label">Фамилия:</span>
          <input className="form__input" type="text" name="lastName" value={formik_curator.values.lastName} onChange={formik_curator.handleChange} />
          {formik_curator.errors.lastName && <span className="form__error">{formik_curator.errors.lastName}</span>}
        </label>
        <label className="form__field">
          <span className="form__label">E-mail:</span>
          <input className="form__input" type="text" name="email" value={formik_curator.values.email} onChange={formik_curator.handleChange} />
          {formik_curator.errors.email && <span className="form__error">{formik_curator.errors.email}</span>}
        </label>
        <label className="form__field">
          <span className="form__label">Телефон:</span>
          <InputMask
            mask="+7(999)999-99-99"
            maskPlaceholder="_"
            value={formik_curator.values.phone} 
            alwaysShowMask={false}
            onChange={formik_curator.handleChange}
          >
            {() => <input className="form__input" name="phone" placeholder="+7(111)111-11-11" type="text"/>}
          </InputMask>
          {formik_curator.errors.phone && <span className="form__error">{formik_curator.errors.phone}</span>}
        </label>
        <label className="form__field">
          <span className="form__label">Логин:</span>
          <input className="form__input" type="text" name="login" value={formik_curator.values.login} onChange={formik_curator.handleChange} />
          {formik_curator.errors.login && <span className="form__error">{formik_curator.errors.login}</span>}
        </label>
        <label className="form__field">
          <span className="form__label">Пароль:</span>
          <input className="form__input" type="text" name="password" value={formik_curator.values.password} onChange={formik_curator.handleChange} />
          {formik_curator.errors.password && <span className="form__error">{formik_curator.errors.password}</span>}
        </label>
        <label className="form__field">
          <span className="form__label">Повторите пароль:</span>
          <input className="form__input" type="text" name="passwordRepeat" value={formik_curator.values.passwordRepeat} onChange={formik_curator.handleChange} />
          {formik_curator.errors.passwordRepeat && <span className="form__error">{formik_curator.errors.passwordRepeat}</span>}
        </label>
        <button className="form__submit" type="submit" >Отправить</button>
      </form>
  )
}

export default AdminDashboardCurators;