const LoginLayout = ({ children }: { children: any }) => {
  return (
    <>
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-12">
            <main>{children}</main>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginLayout;
