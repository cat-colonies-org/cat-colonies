import { useRouter } from 'next/router';
import { FormEvent, useEffect, useState } from 'react';
import DataTable, { TableColumn } from 'react-data-table-component';
import withPrivateRoute from '../../components/with-private-route';
import { Annotation, Cat, getCat } from '../../services/cats';

const CatDetails = () => {
  const router = useRouter();

  const annotationsColumns: TableColumn<Annotation>[] = [
    { name: 'Id', selector: (row) => row.id },
    { name: 'Fecha', selector: (row) => new Date(row.date).toLocaleDateString() },
    { name: 'Anotación', selector: (row) => row.annotation },
  ];

  const [cat, setCat] = useState({} as Cat);
  // const [environments, setEnvironments] = useState([] as Environment[]);
  // const [locationTypes, setLocationTypes] = useState([] as LocationType[]);
  // const [towns, setTowns] = useState([] as Town[]);
  // const [stats, setStats] = useState(zeroStats);
  const [loading, setLoading] = useState(false);
  // const [newTownModalOpen, setNewTownModalOpen] = useState(false);
  // const [newLocationTypeModalOpen, setNewLocationTypeModalOpen] = useState(false);
  // const [newEnvironmentModalOpen, setNewEnvironmentModalOpen] = useState(false);

  const onInputChange = (event: FormEvent<HTMLInputElement>): void => {
    setCat((prev) => {
      return { ...prev, [event.currentTarget.id]: event.currentTarget.value };
    });
  };

  const onSubmit = async (event: FormEvent): Promise<void> => {
    event.preventDefault();

    // if (colony.id) {
    //   const updatePromise = updateColony(+colony.id, {
    //     ...(colony.address && { address: colony.address }),
    //     ...(colony.locationTypeId && { locationTypeId: +colony.locationTypeId }),
    //     ...(colony.environmentId && { environmentId: +colony.environmentId }),
    //     ...(colony.townId && { townId: +colony.townId }),
    //   });

    //   toast.promise(updatePromise, {
    //     pending: 'Conectando con el servidor...',
    //     success: 'Datos actualizados',
    //     error: 'Error actualizando datos',
    //   });
    // }
  };

  const fetchData = async () => {
    setLoading(true);

    const id = router.query.id;
    if (id) {
      const cat = await getCat(+id);
      if (cat) {
        setCat(cat);

        // const [environments, locationTypes, towns] = await Promise.all([
        //   getEnvironmentsList({}),
        //   getLocationTypesList({}),
        //   getTownsList({}),
        // ]);

        // if (environments) setEnvironments(environments.items.sort(descriptionSorter));
        // if (locationTypes) setLocationTypes(locationTypes.items.sort(descriptionSorter));
        // if (towns) setTowns(towns.items.sort(nameSorter));
        // if (cat.cats) reduceAndSetStats(cat.cats);
      }
    }

    setLoading(false);
  };

  useEffect((): void => {
    fetchData();
  }, []);

  return (
    <div className="container">
      <div className="row mb-4">
        <div className="col-lg-12">
          <div className="container-md">
            <div className="shadow p-3 bg-body rounded">
              <p>
                <i className="far fa-sticky-note mr-2" aria-hidden="true"></i>
                Datos generales
              </p>
              <form onSubmit={onSubmit}>
                <div className="row mt-3">
                  <div className="col-md-2">
                    <label htmlFor="id" className="form-label">
                      Id
                    </label>
                    <input
                      id="id"
                      type="text"
                      className="form-control"
                      value={cat?.id}
                      placeholder="Nuevo gato"
                      readOnly
                    />
                  </div>
                  <div className="col-md-3">
                    <label htmlFor="createdAt" className="form-label">
                      Alta
                    </label>
                    <input type="text" className="form-control" readOnly value={cat?.createdAt?.toLocaleDateString()} />
                  </div>
                  <div className="col-md-7">
                    <label htmlFor="town" className="form-label">
                      Nacimiento
                    </label>
                    <input type="text" className="form-control" readOnly value={cat?.bornAt?.toLocaleDateString()} />
                  </div>
                </div>

                <div className="row mt-3">
                  <div className="col-md-12">
                    <label htmlFor="address" className="form-label">
                      Sexo
                    </label>
                    <input
                      id="address"
                      type="text"
                      className="form-control"
                      value={cat?.gender}
                      onChange={onInputChange}
                    />
                  </div>
                </div>

                {/* <div className="row mt-3">
                  <div className="col-md-6">
                    <label htmlFor="location" className="form-label">
                      Ubicación
                    </label>
                    <div className="input-group mb-3">
                      <select
                        id="locationTypeId"
                        className="form-control"
                        value={cat?.locationTypeId}
                        onChange={onSelectChange}
                      >
                        {locationTypes.length &&
                          locationTypes.map((item, i) => (
                            <option key={i} value={item.id}>
                              {item.description}
                            </option>
                          ))}
                      </select>
                      <div className="input-group-append">
                        <button className="input-group-text" onClick={onCreateLocationTypeClick}>
                          <i className="fa fa-plus-circle" aria-hidden="true"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label" htmlFor="environment">
                      Entorno
                    </label>
                    <div className="input-group mb-3">
                      <select
                        id="environmentId"
                        className="form-control"
                        value={cat?.environmentId}
                        onChange={onSelectChange}
                      >
                        {environments.length &&
                          environments.map((item, i) => (
                            <option key={i} value={item.id}>
                              {item.description}
                            </option>
                          ))}
                      </select>
                      <div className="input-group-append">
                        <button className="input-group-text" onClick={onCreateEnvironmentClick}>
                          <i className="fa fa-plus-circle" aria-hidden="true"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div> */}

                <div className="row mt-3">
                  <div className="col-md-12">
                    <button className="btn btn-primary">Guardar</button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className="row mb-4">
        <div className="col-md-12">
          <div className="shadow p-3 bg-body rounded">
            <p>
              <i className="fa fa-female mr-2" aria-hidden="true"></i>
              Anotaciones
            </p>

            <DataTable
              columns={annotationsColumns}
              data={cat.annotations}
              dense
              highlightOnHover={true}
              progressPending={loading}
              striped={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default withPrivateRoute(CatDetails);
