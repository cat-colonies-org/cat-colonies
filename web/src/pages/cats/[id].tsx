import { Annotation, createAnnotation } from '../../services/annotations';
import { Cat, getCat } from '../../services/cats';
import { CeaseCause, createCeaseCause, getCeaseCausesList } from '../../services/cease-causes';
import { Color, createColor, getColorsList } from '../../services/colors';
import { createEyeColor, EyeColor, getEyeColorsList } from '../../services/eyeColors';
import { createPattern, getPatternsList, Pattern } from '../../services/patterns';
import { FormEvent, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import DataTable, { TableColumn } from 'react-data-table-component';
import InputModal from '../../components/input-modal';
import PropertySelector from '../../components/property-selector';
import withPrivateRoute from '../../components/with-private-route';

const CatDetails = () => {
  const router = useRouter();

  const annotationsColumns: TableColumn<Annotation>[] = [
    { name: 'Id', selector: (row) => row.id },
    { name: 'Fecha', selector: (row) => new Date(row.date).toLocaleDateString() },
    { name: 'Anotación', selector: (row) => row.annotation },
  ];

  const [loading, setLoading] = useState(false);
  const [cat, setCat] = useState({} as Cat);
  const [ceaseCauses, setCeaseCauses] = useState([] as CeaseCause[]);
  const [colors, setColors] = useState([] as Color[]);
  const [patterns, setPatterns] = useState([] as Pattern[]);
  const [eyeColors, setEyeColors] = useState([] as Color[]);
  const [isModalOpen, setModalOpen] = useState(false);

  const descriptionSorter = (a: { description: string }, b: { description: string }): number => {
    return a.description.localeCompare(b.description);
  };

  const onNewCeaseCause = (item: CeaseCause) => {
    toast.success(`Creada nueva causa de baja "${item.description}" con id "${item.id}"`);

    setCeaseCauses((prev) => [...prev, { ...item }].sort(descriptionSorter));
    setCat((prev) => {
      return { ...prev, ceaseCauseId: item.id };
    });
  };

  const onAddAnnotation = (event: FormEvent<HTMLButtonElement>) => {
    setModalOpen(true);
  };

  const onNewAnnotation = async (result: { value: string }) => {
    if (!result?.value) return;

    const annotation: Annotation = await createAnnotation(cat.id, result.value);
    if (annotation) {
      cat.annotations.push(annotation);

      setCat((prev) => {
        return { ...prev, annotations: prev.annotations };
      });

      toast.success(`Creada nueva anotación "${annotation.annotation}"`);
    } else {
      toast.error(`Error creando nueva anotación "${result.value}"`);
    }
  };

  const onNewColor = (item: Color) => {
    toast.success(`Creado nuevo color "${item.description}" con id "${item.id}"`);

    setColors((prev) => [...prev, { ...item }].sort(descriptionSorter));
    setCat((prev) => {
      return { ...prev, colorId: item.id };
    });
  };

  const onNewPattern = (item: Pattern) => {
    toast.success(`Creada nueva distribución "${item.description}" con id "${item.id}"`);

    setPatterns((prev) => [...prev, { ...item }].sort(descriptionSorter));
    setCat((prev) => {
      return { ...prev, patternId: item.id };
    });
  };

  const onNewEyeColor = (item: EyeColor) => {
    toast.success(`Creado nuevo color de ojos "${item.description}" con id "${item.id}"`);

    setEyeColors((prev) => [...prev, { ...item }].sort(descriptionSorter));
    setCat((prev) => {
      return { ...prev, eyeColorId: item.id };
    });
  };

  const onSelectChange = (event: FormEvent<HTMLSelectElement>): void => {
    setCat((prev: any) => {
      return { ...prev, [event.currentTarget.id]: event.currentTarget.value };
    });
  };

  // const onInputChange = (event: FormEvent<HTMLInputElement>): void => {
  //   setCat((prev) => {
  //     return { ...prev, [event.currentTarget.id]: event.currentTarget.value };
  //   });
  // };

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
    const [cat, ceaseCauses, colors, patterns, eyeColors] = await Promise.all([
      id ? getCat(+id) : null,
      getCeaseCausesList({}),
      getColorsList({}),
      getPatternsList({}),
      getEyeColorsList({}),
    ]);

    if (cat) setCat(cat);
    if (ceaseCauses) setCeaseCauses(ceaseCauses.items.sort(descriptionSorter));
    if (colors) setColors(colors.items.sort(descriptionSorter));
    if (patterns) setPatterns(patterns.items.sort(descriptionSorter));
    if (eyeColors) setEyeColors(eyeColors.items.sort(descriptionSorter));

    setLoading(false);
  };

  useEffect((): void => {
    fetchData();
  }, []);

  return (
    <>
      <InputModal
        id="AnnotationModal"
        title="Nueva Anotación"
        caption="Texto"
        buttonCaption="Añadir"
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onReturn={onNewAnnotation}
      />
      <div className="container">
        <div className="row mb-4">
          <div className="col-lg-12">
            <div className="container-md">
              <div className="shadow p-3 bg-body rounded">
                <p>
                  <i className="fa fa-id-card mr-2" aria-hidden="true"></i>
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
                      <input
                        type="text"
                        className="form-control"
                        readOnly
                        value={cat?.createdAt?.toLocaleDateString()}
                      />
                    </div>
                    <div className="col-md-3">
                      <label htmlFor="town" className="form-label">
                        Nacimiento
                      </label>
                      <input type="text" className="form-control" value={cat?.bornAt?.toLocaleDateString()} />
                    </div>
                    <div className="col-md-4">
                      <label htmlFor="address" className="form-label">
                        Sexo
                      </label>
                      <select id="gender" className="form-control" value={cat?.gender} onChange={onSelectChange}>
                        <option value="Male">Macho</option>
                        <option value="Female">Hembra</option>
                        <option value="Unknown">Desconocido</option>
                      </select>
                    </div>
                  </div>

                  <div className="row mt-3">
                    <div className="col-md-2">
                      <label htmlFor="town" className="form-label">
                        Esterilizado
                      </label>
                      <div className="form-check">
                        <input id="sterilized" className="form-check-input" type="checkbox" checked={cat.sterilized} />
                      </div>
                    </div>

                    <div className="col-md-3">
                      <label htmlFor="town" className="form-label">
                        Fecha esterilización
                      </label>
                      <input type="text" className="form-control" value={cat?.bornAt?.toLocaleDateString()} />
                    </div>

                    <div className="col-md-3">
                      <label htmlFor="town" className="form-label">
                        Baja
                      </label>
                      <input type="text" className="form-control" value={cat?.bornAt?.toLocaleDateString()} />
                    </div>
                    <div className="col-md-4">
                      <label htmlFor="location" className="form-label">
                        Causa de baja
                      </label>
                      <PropertySelector
                        id="ceaseCauseId"
                        title="Nueva Causa de Baja"
                        caption="Descripción"
                        buttonCaption="Crear"
                        items={ceaseCauses}
                        value={cat?.ceaseCauseId}
                        setter={setCat}
                        textGetter={(i: CeaseCause) => i.description}
                        factory={createCeaseCause}
                        onCreate={onNewCeaseCause}
                        onError={(i: string) => toast.error(`Error creando causa de baja "${i}"`)}
                      />
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-4">
                      <label htmlFor="location" className="form-label">
                        Color
                      </label>
                      <PropertySelector
                        id="colorId"
                        title="Nuevo color"
                        caption="Descripción"
                        buttonCaption="Crear"
                        items={colors}
                        value={cat?.colorId}
                        setter={setCat}
                        textGetter={(i: Color) => i.description}
                        factory={createColor}
                        onCreate={onNewColor}
                        onError={(i: string) => toast.error(`Error creando color "${i}"`)}
                      />
                    </div>
                    <div className="col-md-4">
                      <label htmlFor="location" className="form-label">
                        Disposición
                      </label>
                      <PropertySelector
                        id="patternId"
                        title="Nueva disposición"
                        caption="Descripción"
                        buttonCaption="Crear"
                        items={patterns}
                        value={cat?.patternId}
                        setter={setCat}
                        textGetter={(i: Pattern) => i.description}
                        factory={createPattern}
                        onCreate={onNewPattern}
                        onError={(i: string) => toast.error(`Error creando causa de baja "${i}"`)}
                      />
                    </div>
                    <div className="col-md-4">
                      <label htmlFor="location" className="form-label">
                        Ojos
                      </label>
                      <PropertySelector
                        id="eyeColorId"
                        title="Nuevo color de ojos"
                        caption="Descripción"
                        buttonCaption="Crear"
                        items={eyeColors}
                        value={cat?.eyeColorId}
                        setter={setCat}
                        textGetter={(i: EyeColor) => i.description}
                        factory={createEyeColor}
                        onCreate={onNewEyeColor}
                        onError={(i: string) => toast.error(`Error creando causa de baja "${i}"`)}
                      />
                    </div>
                  </div>

                  {/*  <div className="col-md-6">
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
                 */}

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
              <p className="d-flex justify-content-between">
                <div>
                  <i className="far fa-sticky-note mr-2" aria-hidden="true"></i>
                  Anotaciones
                </div>
                <button className="btn btn-primary btn-sm mb-3" onClick={onAddAnnotation}>
                  <i className="fa fa-plus-circle" aria-hidden="true"></i>
                </button>
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
    </>
  );
};

export default withPrivateRoute(CatDetails);
