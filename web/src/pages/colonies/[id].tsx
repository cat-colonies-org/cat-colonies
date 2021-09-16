/* eslint-disable @next/next/no-sync-scripts */
import { Cat, getCatsList } from '../../services/cats';
import { Colony, getColony, updateColony } from '../../services/colonies';
import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import DataTable, { TableColumn } from 'react-data-table-component';

const ColonyDetails = () => {
  const columns: TableColumn<Cat>[] = [
    { name: 'Id', selector: (cat) => cat.id },
    { name: 'Alta', selector: (cat) => cat.createdAt.toLocaleDateString() },
    { name: 'Nacimiento', selector: (cat) => cat.birthYear },
    {
      name: 'Esterilizado',
      selector: (cat) => cat.sterilized,
      format: (cat) => (cat.sterilized ? 'Sí' : 'No'),
    },
    { name: 'Color', selector: (cat) => cat.color.description },
    { name: 'Patrón', selector: (cat) => cat.pattern.description },
  ];

  const router = useRouter();

  const [colony, setColony] = useState({} as Colony);
  const [cats, setCats] = useState({} as Cat[]);
  const [loading, setLoading] = useState(false);

  const onInputChange = (event: FormEvent<HTMLInputElement>): void => {
    setColony({ ...colony, [event.currentTarget.id]: event.currentTarget.value });
  };

  const onSubmit = async (event: FormEvent): Promise<void> => {
    event.preventDefault();

    if (colony.id) {
      const result = await updateColony(+colony.id, {
        ...(colony.address && { address: colony.address }),
        ...(colony.locationType?.id && { locationTypeId: colony.locationType.id }),
        ...(colony.environment?.id && { environmentId: colony.environment.id }),
        ...(colony.town?.id && { townId: colony.town.id }),
      });

      console.log(result);
    }
  };

  const fetchData = async () => {
    setLoading(true);

    const id = router.query.id;
    if (id) {
      const colony = await getColony(+id);
      if (colony) {
        setColony(colony);

        const cats = await getCatsList({ filter: { colonyId: +id } });
        if (cats) setCats(cats.items);
      }
    }

    setLoading(false);
  };

  useEffect((): void => {
    fetchData();
  }, []);

  const styles = {
    blue: {
      background: 'blue',
    },
    red: {
      background: 'red',
    },
    map: {
      display: 'block',
      width: '100%',
      height: '295px',
    },
  };

  return (
    <>
      <div className="container">
        <div className="row">
          <div className="col-lg-7">
            <div className="container-md">
              <div className="shadow p-3 bg-body rounded">
                <p>
                  <i className="far fa-sticky-note mr-2" aria-hidden="true"></i>
                  Datos generales
                </p>
                <form className="needs-validation" noValidate onSubmit={onSubmit}>
                  <div className="row mt-3">
                    <div className="col-md-2">
                      <label htmlFor="id" className="form-label">
                        Id
                      </label>
                      <input
                        id="id"
                        type="text"
                        className="form-control"
                        value={colony?.id}
                        placeholder="Nueva colonia"
                        readOnly
                      />
                    </div>
                    <div className="col-md-3">
                      <label htmlFor="createdAt" className="form-label">
                        Alta
                      </label>
                      <input
                        id="createdAt"
                        type="text"
                        className="form-control"
                        value={colony?.createdAt?.toLocaleDateString()}
                        onChange={onInputChange}
                      />
                    </div>
                    <div className="col-md-7">
                      <label htmlFor="town" className="form-label">
                        Localidad
                      </label>
                      <input
                        id="town"
                        type="text"
                        className="form-control"
                        value={colony?.town?.name}
                        onChange={onInputChange}
                      />
                    </div>
                  </div>

                  <div className="row mt-3">
                    <div className="col-md-12">
                      <label htmlFor="address" className="form-label">
                        Calle
                      </label>
                      <input
                        id="address"
                        type="text"
                        className="form-control"
                        value={colony?.address}
                        onChange={onInputChange}
                      />
                    </div>
                  </div>

                  <div className="row mt-3">
                    <div className="col-md-6">
                      <label htmlFor="location" className="form-label">
                        Ubicación
                      </label>
                      <input
                        id="location"
                        type="text"
                        className="form-control"
                        value={colony?.locationType?.description}
                        onChange={onInputChange}
                      />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="environment" className="form-label">
                        Entorno
                      </label>
                      <input
                        id="environment"
                        type="text"
                        className="form-control"
                        value={colony?.environment?.description}
                        onChange={onInputChange}
                      />
                    </div>
                  </div>

                  <div className="row mt-3">
                    <div className="col-md-12">
                      <button className="btn btn-primary">Guardar</button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="col-lg-5">
            <div className="shadow p-3 bg-body rounded">
              <p>
                <i className="far fa-map mr-2" aria-hidden="true"></i>
                Ubicación
              </p>
              <iframe
                style={styles.map}
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1564.0051792651661!2d-0.49694479283032256!3d38.37188181628149!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd6236e5beba75f9%3A0xe54cc71b08152eeb!2sC.%20Roque%20Chab%C3%A1s%2C%2011%2C%2003011%20Alicante%20(Alacant)%2C%20Alicante!5e0!3m2!1ses!2ses!4v1631740183993!5m2!1ses!2ses"
                loading="lazy"
              ></iframe>{' '}
            </div>
          </div>
        </div>

        <div className="shadow p-3 bg-body rounded">
          <p>
            <i className="fas fa-chart-pie mr-2" aria-hidden="true"></i>
            Estadísticas
          </p>
        </div>

        <div className="shadow p-3 bg-body rounded">
          <p>
            <i className="fa fa-female mr-2" aria-hidden="true"></i>
            Gestoras
          </p>

          <DataTable
            columns={columns}
            data={cats}
            dense
            highlightOnHover={false}
            striped={true}
            progressPending={loading}
            onRowClicked={(row) => router.push(`/cats/${row.id}`)}
          />
        </div>

        <div className="shadow p-3 mb-5 bg-body rounded">
          <p>
            <i className="fas fa-cat mr-2" aria-hidden="true"></i>
            Gatos
          </p>

          <DataTable
            columns={columns}
            data={cats}
            dense
            highlightOnHover={false}
            striped={true}
            progressPending={loading}
            onRowClicked={(row) => router.push(`/cats/${row.id}`)}
          />
        </div>
      </div>
    </>
  );
};

export default ColonyDetails;
