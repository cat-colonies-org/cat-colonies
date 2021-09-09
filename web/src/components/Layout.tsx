import Sidebar from './Sidebar';
import Navbar from './Navbar';

const Layout = ({ children }) => {
  return (
    <>
      <div className="container-fluid">
        <div className="row">
          <Navbar />
        </div>

        <div className="row">
          <div className="col-2">
            <Sidebar />
          </div>

          <div className="col-10">
            <main>{children}</main>
          </div>
        </div>
      </div>
    </>
  );
};

export default Layout;
