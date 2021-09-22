import LoginLayout from '../../components/LoginLayout';

const Login = () => {
  return (
    <section className="vh-100">
      <div className="container py-5 h-100">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col-12 col-md-8 col-lg-6 col-xl-5">
            <div className="card shadow-2-strong" style={{ borderRadius: '1rem' }}>
              <div className="card-body p-5 ">
                <div className="form-outline mb-4">
                  <label className="form-label" htmlFor="typeEmailX">
                    Email
                  </label>
                  <input type="email" id="typeEmailX" className="form-control form-control-lg" />
                </div>

                <div className="form-outline mb-4">
                  <label className="form-label" htmlFor="typePasswordX">
                    Password
                  </label>
                  <input type="password" id="typePasswordX" className="form-control form-control-lg" />
                </div>

                <div className="form-check d-flex justify-content-start mb-4">
                  <input className="form-check-input" type="checkbox" value="" id="form1Example3" />
                  <label className="form-check-label" htmlFor="form1Example3">
                    Recordar password
                  </label>
                </div>

                <button className="btn btn-primary btn-lg btn-block" type="submit">
                  Acceder
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

Login.Layout = LoginLayout;

export default Login;
