import { Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from './components/Header';
import { DefaultImg } from "./components/DefaultImage";
import { FooterWithSocialLinks } from "./components/Footer";


const App = () => {
  return (
    <div>
      <Header />
      <ToastContainer />
      <div className="container mx-auto px-4 py-2">
        <Outlet />
        
        
        
      </div>
      <div className='mt-32'><FooterWithSocialLinks /></div>
    </div>
  );
};

export default App;
