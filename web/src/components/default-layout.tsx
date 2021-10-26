import NavBar from './nav-bar';

const DefaultLayout = ({ children, authToken }: any) => {
  return (
    <>
      <div>
        <div className="container">
          <div className="row">
            <div className="col-12">
              <NavBar authToken={authToken} />
              {children}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DefaultLayout;
