import { FormEvent, useState } from 'react';
import { signIn } from '../../services/auth';
import { toast } from 'react-toastify';
import LoginLayout from '../../components/LoginLayout';
import Router from 'next/router';

const Login = () => {
  const [state, setState] = useState({ email: '', password: '' });

  const onLoginClick = async (event: FormEvent<HTMLButtonElement>) => {
    const loggedIn = await signIn(state.email, state.password);
    if (loggedIn) {
      await Router.push('/');
    } else {
      setState({ email: state.email, password: '' });
      toast.error('Error al ingresar');
    }
  };

  const onInputChange = (event: FormEvent<HTMLInputElement>) => {
    setState({ ...state, [event.currentTarget.id]: event.currentTarget.value });
  };

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
                  <input
                    type="email"
                    id="email"
                    className="form-control form-control-lg"
                    value={state.email}
                    onChange={onInputChange}
                  />
                </div>

                <div className="form-outline mb-4">
                  <label className="form-label" htmlFor="typePasswordX">
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    className="form-control form-control-lg"
                    value={state.password}
                    onChange={onInputChange}
                  />
                </div>
                <button className="btn btn-primary btn-lg btn-block" onClick={onLoginClick}>
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
