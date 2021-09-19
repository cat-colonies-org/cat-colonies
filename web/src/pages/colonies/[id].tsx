/* eslint-disable @next/next/no-sync-scripts */
import { Cat, Gender } from '../../services/cats';
import { Chart } from 'react-google-charts';
import { Colony, getColony, updateColony } from '../../services/colonies';
import { Environment, getEnvironmentsList } from '../../services/environments';
import { FormEvent, useEffect, useState } from 'react';
import { getLocationTypesList, LocationType } from '../../services/locationTypes';
import { getTownsList, Town } from '../../services/towns';
import { toast } from 'react-toastify';
import { User } from '../../services/users';
import { useRouter } from 'next/router';
import DataTable, { TableColumn } from 'react-data-table-component';

interface Stats {
  total: number;

  malesCount: number;
  femalesCount: number;
  esterilicedCount: number;
  kittensCount: number;
}

const ColonyDetails = () => {
  const router = useRouter();

  const catsColumns: TableColumn<Cat>[] = [
    { name: 'Id', selector: (cat) => cat.id },
    // { name: 'Alta', selector: (cat) => cat.createdAt.toLocaleDateString() },
    { name: 'Nacimiento', selector: (cat) => cat.birthYear },
    {
      name: 'Genero',
      selector: (cat) =>
        cat.gender === Gender.Male ? 'Macho' : cat.gender === Gender.Female ? 'Hembra' : 'Indeterminado',
    },
    {
      name: 'Esterilizado',
      selector: (cat) => cat.sterilized,
      format: (cat) => (cat.sterilized ? 'Sí' : 'No'),
    },
    { name: 'Cachorro', selector: (cat) => (cat.kitten ? 'Sí' : 'No') },
    { name: 'Patrón', selector: (cat) => cat.pattern.description },
  ];

  const managersColumns: TableColumn<User>[] = [
    { name: 'Id', selector: (user) => user.id },
    // { name: 'Alta', selector: (user) => user.createdAt.toLocaleDateString() },
    { name: 'Nombre', selector: (user) => user.name },
    { name: 'Apellidos', selector: (user) => user.surnames },
  ];

  const [colony, setColony] = useState({} as Colony);
  const [environments, setEnvironments] = useState({} as Environment[]);
  const [locationTypes, setLocationTypes] = useState({} as LocationType[]);
  const [towns, setTowns] = useState({} as Town[]);
  const [stats, setStats] = useState({} as Stats);
  const [loading, setLoading] = useState(false);

  const onInputChange = (event: FormEvent<HTMLInputElement>): void => {
    setColony({ ...colony, [event.currentTarget.id]: event.currentTarget.value });
  };

  const onSelectChange = (event: FormEvent<HTMLSelectElement>): void => {
    setColony({ ...colony, [event.currentTarget.id]: +event.currentTarget.value });
  };

  const onSubmit = async (event: FormEvent): Promise<void> => {
    event.preventDefault();

    if (colony.id) {
      const updatePromise = updateColony(+colony.id, {
        ...(colony.address && { address: colony.address }),
        ...(colony.locationTypeId && { locationTypeId: +colony.locationTypeId }),
        ...(colony.environmentId && { environmentId: +colony.environmentId }),
        ...(colony.townId && { townId: +colony.townId }),
      });

      toast.promise(updatePromise, {
        pending: 'Conectando con el servidor...',
        success: 'Los datos se actualizaron con éxito 👍',
        error: 'Hubo un error actualizando los datos 🤯',
      });
    }
  };

  const reduceAndSetStats = (cats: Cat[]): void => {
    let stats: Stats = {
      total: 0,
      malesCount: 0,
      femalesCount: 0,
      esterilicedCount: 0,
      kittensCount: 0,
    };

    stats = cats.reduce((stats: Stats, cat: Cat): Stats => {
      if (cat.ceasedAt || cat.ceasedCuaseId) return stats;

      ++stats.total;

      stats.malesCount += cat.gender === Gender.Male ? 1 : 0;
      stats.femalesCount += cat.gender === Gender.Female ? 1 : 0;
      stats.esterilicedCount += cat.sterilized ? 1 : 0;
      stats.kittensCount += cat.kitten ? 1 : 0;

      return stats;
    }, stats);

    console.log(stats);

    setStats(stats);
  };

  const fetchData = async () => {
    setLoading(true);

    const id = router.query.id;
    if (id) {
      const colony = await getColony(+id);
      if (colony) {
        setColony(colony);

        const [environments, locationTypes, towns] = await Promise.all([
          getEnvironmentsList({}),
          getLocationTypesList({}),
          getTownsList({}),
        ]);

        if (environments) setEnvironments(environments.items);
        if (locationTypes) setLocationTypes(locationTypes.items);
        if (towns) setTowns(towns.items);
        if (colony.cats) reduceAndSetStats(colony.cats);
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
        <div className="row mb-4">
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
                      <select id="townId" className="form-control" value={colony?.townId} onChange={onSelectChange}>
                        {towns.length &&
                          towns.map((item, i) => (
                            <option key={i} value={item.id}>
                              {item.name}
                            </option>
                          ))}
                      </select>
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
                      <select
                        id="locationTypeId"
                        className="form-control"
                        value={colony?.locationTypeId}
                        onChange={onSelectChange}
                      >
                        {locationTypes.length &&
                          locationTypes.map((item, i) => (
                            <option key={i} value={item.id}>
                              {item.description}
                            </option>
                          ))}
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label" htmlFor="environment">
                        Entorno
                      </label>
                      <select
                        id="environmentId"
                        className="form-control"
                        value={colony?.environmentId}
                        onChange={onSelectChange}
                      >
                        {environments.length &&
                          environments.map((item, i) => (
                            <option key={i} value={item.id}>
                              {item.description}
                            </option>
                          ))}
                      </select>
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

        <div className="row mb-4">
          <div className="col-md-6">
            <div className="shadow p-3 bg-body rounded">
              <p>
                <i className="fa fa-female mr-2" aria-hidden="true"></i>
                Gestoras
              </p>

              <DataTable
                columns={managersColumns}
                data={colony.managers}
                dense
                highlightOnHover={true}
                striped={true}
                progressPending={loading}
                onRowClicked={(row) => router.push(`/users/${row.id}`)}
              />
            </div>
          </div>

          <div className="col-md-6">
            <div className="shadow p-3 bg-body rounded">
              <p>
                <i className="fas fa-chart-pie mr-2" aria-hidden="true"></i>
                Estadísticas
              </p>

              <div className="row">
                <div className="col-sm">
                  <Chart
                    width={200}
                    height={100}
                    chartType="BarChart"
                    loader={<div>Cargando gráfico...</div>}
                    data={[
                      ['Estado', 'Total'],
                      ['Vivos', 10],
                      ['Bajas', 0],
                    ]}
                    options={{
                      title: 'Población',
                      is3D: true,
                      backgroundColor: '#fafafa',
                    }}
                  />
                </div>
                <div className="col-sm">
                  <Chart
                    width={200}
                    height={100}
                    chartType="BarChart"
                    loader={<div>Cargando gráfico...</div>}
                    data={[
                      ['Estado', 'Sí', 'No'],
                      ['', 4, 2],
                    ]}
                    options={{
                      title: 'Esterilizados',
                      is3D: true,
                      backgroundColor: '#fafafa',
                    }}
                  />
                </div>
                <div className="col-sm">
                  <Chart
                    width={200}
                    height={100}
                    chartType="BarChart"
                    loader={<div>Cargando gráfico...</div>}
                    data={[
                      ['Estado', 'Total'],
                      ['Hembras', 6],
                      ['Machos', 4],
                    ]}
                    options={{
                      title: 'Sexo',
                      is3D: true,
                      backgroundColor: '#fafafa',
                    }}
                  />
                </div>
                <div className="col-sm">
                  <Chart
                    width={200}
                    height={100}
                    chartType="BarChart"
                    loader={<div>Cargando gráfico...</div>}
                    data={[
                      ['Estado', 'Total'],
                      ['Cachorros', 9],
                      ['Adultos', 1],
                    ]}
                    options={{
                      title: 'Edad',
                      is3D: true,
                      backgroundColor: '#fafafa',
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row mb-4">
          <div className="col-md-12">
            <div className="shadow p-3 bg-body rounded">
              <p>
                <i className="fas fa-cat mr-2" aria-hidden="true"></i>
                Gatos
              </p>

              <DataTable
                columns={catsColumns}
                data={colony.cats}
                dense
                highlightOnHover={true}
                striped={true}
                progressPending={loading}
                onRowClicked={(row) => router.push(`/cats/${row.id}`)}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ColonyDetails;
