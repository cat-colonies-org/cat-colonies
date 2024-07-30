/* eslint-disable @next/next/no-img-element */
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import { Auth } from '../common/authToken';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface NavbarProps {
  authToken: Auth;
}

function NavBar({ authToken: auth }: NavbarProps) {
  const router = useRouter();
  const [email, setEmail] = useState('');

  const logout = async () => {
    Auth.logout();
    toast.success('Logged out... 👋');
    router.push('/login');
  };

  useEffect(() => {
    setEmail(auth?.email);
  });

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light justify-content-between mt-3 mb-3 rounded shadow">
      <Link href="/" className="navbar-brand">
          Colonias
      </Link>
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarSupportedContent">
        <ul className="navbar-nav mr-auto">
          <li className="nav-item dropdown">
            <a
              className="nav-link dropdown-toggle"
              href="#"
              id="navbarDropdown"
              role="button"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              Colecciones
            </a>

            <div className="dropdown-menu" aria-labelledby="navbarDropdown">
              <Link href="/users" className="dropdown-item">
                Gestoras
              </Link>

              <Link href="/colonies" className="dropdown-item">
                Colonias
              </Link>

              <Link href="/cats" className="dropdown-item">
                Gatos
              </Link>
            </div>
          </li>

          <li className="nav-item dropdown">
            <a
              className="nav-link dropdown-toggle"
              href="#"
              id="navbarDropdown"
              role="button"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              Informes
            </a>
            <div className="dropdown-menu" aria-labelledby="navbarDropdown">
              <Link href="#" className="dropdown-item">
                Informe 1
              </Link>
              <Link href="#" className="dropdown-item">
                Informe 2
              </Link>
              <Link href="#" className="dropdown-item">
                Informe 3
              </Link>
            </div>
          </li>
        </ul>

        <div>
          <a className="navbar-link mr-3">{email}</a>
          <button className="btn btn-outline-danger" onClick={logout}>
            Salir
          </button>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
