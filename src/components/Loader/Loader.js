import loaderImg from '../../img/spinner.gif';
import './Loader.scss';

const Loader = () => {
  return (
    <div className="loader">
      <img src={loaderImg} alt="спиннер"/>
    </div>
  )
}

export default Loader;