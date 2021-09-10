import Sidebar from './Sidebar';
import Navbar from './Navbar';

const Layout = ({ children }: { children: any }) => {
  return (
    <>
      <div className="wrapper row">
        <div className="col-2">
          <Sidebar />
        </div>

        <div className="col-10">
          <Navbar />
          <main>{children}</main>
        </div>
      </div>
    </>
  );
};

export default Layout;
