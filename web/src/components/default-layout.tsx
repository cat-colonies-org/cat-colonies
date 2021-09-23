import Sidebar from './sidebar';

const DefaultLayout = ({ children }: { children: any }) => {
  return (
    <>
      <div className="container-fluid">
        <div className="row">
          <div id="sidebar" className="col-md-2">
            <Sidebar />
          </div>

          <div className="col-md-10 pt-5">
            <main>{children}</main>
          </div>
        </div>
      </div>
    </>
  );
};

export default DefaultLayout;
