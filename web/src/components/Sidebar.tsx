import Link from 'next/link';

const Sidebar = () => {
  return (
    <div className="flex-shrink-0 p-3 bg-white">
      <ul className="list-unstyled ps-0">
        <li className="mb-1">
          <Link href="/">
            <a className="link-dark rounded">Inicio</a>
          </Link>
        </li>
        <li className="mb-1">
          <button
            className="btn btn-toggle"
            data-bs-toggle="collapse"
            data-bs-target="#home-collapse"
            aria-expanded="true"
          >
            Maestros
          </button>
          <div className="collapse" id="home-collapse">
            <ul className="btn-toggle-nav list-unstyled fw-normal pb-1 small">
              <li>
                <Link href="/cats">
                  <a className="link-dark rounded">Gatos</a>
                </Link>
              </li>
              <li>
                <a className="link-dark rounded">Colonias</a>
              </li>
              <li>
                <a className="link-dark rounded">Localidades</a>
              </li>
            </ul>
          </div>
        </li>
        <li className="mb-1">
          <button
            className="btn btn-toggle"
            data-bs-toggle="collapse"
            data-bs-target="#dashboard-collapse"
            aria-expanded="false"
          >
            Informes
          </button>
          <div className="collapse" id="dashboard-collapse">
            <ul className="btn-toggle-nav list-unstyled fw-normal pb-1 small">
              <li>
                <a className="link-dark rounded">Resumen</a>
              </li>
              <li>
                <a className="link-dark rounded">Semanal</a>
              </li>
              <li>
                <a className="link-dark rounded">Mensual</a>
              </li>
              <li>
                <a className="link-dark rounded">Anual</a>
              </li>
            </ul>
          </div>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
