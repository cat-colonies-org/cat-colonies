import 'react-datepicker/dist/react-datepicker.css';
import 'react-image-gallery/styles/css/image-gallery.css';
import { Annotation, createAnnotation } from '../../services/annotations';
import { Auth } from '../../common/authToken';
import { Cat, createCat, Gender, getCat, updateCat } from '../../services/cats';
import { CeaseCause, createCeaseCause, getCeaseCausesList } from '../../services/cease-causes';
import { Color, createColor, getColorsList } from '../../services/colors';
import { createEyeColor, EyeColor, getEyeColorsList } from '../../services/eyeColors';
import { createPattern, getPatternsList, Pattern } from '../../services/patterns';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import DataTable, { TableColumn } from 'react-data-table-component';
import es from 'date-fns/locale/es';
import ImageGallery from 'react-image-gallery';
import InputModal from '../../components/input-modal';
import Link from 'next/link';
import PropertySelector from '../../components/property-selector';
import React, { FormEvent, useEffect, useState } from 'react';
import ReactDatePicker, { registerLocale } from 'react-datepicker';
import UploadModal from '../../components/upload-modal';
import withPrivateRoute from '../../components/with-private-route';

registerLocale('es', es);

interface CatDetailsProps {
  authToken: Auth;
}

const CatDetails = ({ authToken }: CatDetailsProps) => {
  const router = useRouter();

  const annotationsColumns: TableColumn<Annotation>[] = [
    { name: 'Id', selector: (row) => row.id, width: '100px' },
    { name: 'Fecha', selector: (row) => new Date(row.date).toLocaleDateString(), width: '100px' },
    { name: 'Anotación', selector: (row) => row.annotation },
  ];

  const emptyCat: Partial<Cat> = Object.freeze({
    createdAt: new Date(),
    bornAt: undefined,
    sterilizedAt: undefined,
    ceasedAt: undefined,
    eyeColorId: 0,
    patternId: 0,
    ceaseCauseId: 0,
    gender: Gender.Unknown,
  });

  const [loading, setLoading] = useState(false);
  const [cat, setCat] = useState(emptyCat);
  const [ceaseCauses, setCeaseCauses] = useState([] as CeaseCause[]);
  const [colors, setColors] = useState([] as Color[]);
  const [patterns, setPatterns] = useState([] as Pattern[]);
  const [eyeColors, setEyeColors] = useState([] as Color[]);
  const [isAnnotationModalOpen, setAnnotationModalOpen] = useState(false);
  const [isUploadModalOpen, setUploadModalOpen] = useState(false);

  const descriptionSorter = (a: { description: string }, b: { description: string }): number => {
    return a.description.localeCompare(b.description);
  };

  const onAddAnnotation = (event: FormEvent<HTMLButtonElement>) => {
    if (!cat.id) {
      toast.warn('Debe guardar el gato antes de poder hacer anotaciones');
      return;
    }

    setAnnotationModalOpen(true);
  };

  const onNewAnnotation = async (result: { value: string }) => {
    if (!result?.value || !cat.id) return;

    const annotation: Annotation = await createAnnotation(cat.id, result.value);
    if (annotation) {
      if (cat.annotations) cat.annotations.push(annotation);
      else cat.annotations = [annotation];

      setCat((prev) => ({ ...prev, annotations: prev.annotations }));

      toast.success(`Creada nueva anotación "${annotation.annotation}"`);
    } else {
      toast.error(`Error creando nueva anotación "${result.value}"`);
    }
  };

  const onCreateCeaseCause = async (description: string) => {
    const item: CeaseCause = await createCeaseCause(description);

    if (!item) {
      toast.error(`Error creando causa de baja "${description}"`);
      return;
    }

    setCeaseCauses((prev) => [...prev, { ...item }].sort(descriptionSorter));

    setCat((prev) => ({ ...prev, ceaseCauseId: item.id }));

    toast.success(`Creada nueva causa de baja "${item.description}" con id "${item.id}"`);
  };

  const onCreateColor = async (description: string) => {
    const item: Color = await createColor(description);

    if (!item) {
      toast.error(`Error creando color "${description}"`);
      return;
    }

    setColors((prev) => [...prev, { ...item }].sort(descriptionSorter));

    setCat((cat) => ({ ...cat, colors: [...(cat.colors || []), item] }));

    toast.success(`Creado nuevo color "${item.description}" con id "${item.id}"`);
  };

  const onCreatePattern = async (description: string) => {
    const item: Pattern = await createPattern(description);

    if (!item) {
      toast.error(`Error creando distribución "${description}"`);
      return;
    }

    setPatterns((prev) => [...prev, { ...item }].sort(descriptionSorter));

    setCat((prev) => ({ ...prev, patternId: item.id }));

    toast.success(`Creada nueva distribución "${item.description}" con id "${item.id}"`);
  };

  const onCreateEyeColor = async (description: string) => {
    const item: EyeColor = await createEyeColor(description);

    if (!item) {
      toast.error(`Error creando color de ojos "${description}"`);
      return;
    }

    setEyeColors((prev) => [...prev, { ...item }].sort(descriptionSorter));

    setCat((prev) => ({ ...prev, eyeColorId: item.id }));

    toast.success(`Creado nuevo color de ojos "${item.description}" con id "${item.id}"`);
  };

  const onCheckboxChange = (event: any): void => {
    setCat((prev: any) => ({ ...prev, [event.target.id]: event.target.checked }));
  };

  const onSelectChange = (data: any, meta: { action: string; name: string }): void => {
    if (meta.name === 'colors') return onColorSelectChange(data);

    setCat((prev: any) => ({ ...prev, [meta.name]: data?.value }));
  };

  const onColorSelectChange = (data: { value: number; label: string }[]): void => {
    setCat((prev) => ({ ...prev, colors: data.map((c) => ({ id: c.value, description: c.label })) }));
  };

  const onGenderChange = (event: any): void => {
    setCat((prev: any) => ({ ...prev, [event.currentTarget.id]: event.currentTarget.value }));
  };

  const onDateChange = (date: Date, field: string): void => {
    setCat((prev: any) => ({ ...prev, [field]: date }));
  };

  const onSubmit = async (event: FormEvent): Promise<void> => {
    event.preventDefault();

    let promise: Promise<Cat>;

    if (cat.id) promise = updateCat(cat);
    else promise = createCat(cat);

    const saved = await toast.promise(promise, {
      pending: 'Conectando con el servidor...',
      success: 'Datos actualizados',
      error: 'Error actualizando datos',
    });

    saved && setCat(saved);
  };

  const onPicturesSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!cat.id) {
      toast.warn('No es posible asignar imágenes a un gato que todavía no tiene ID');
      return;
    }

    setUploadModalOpen(false);

    const data = new FormData(event.target as HTMLFormElement);

    const response = await fetch(`${process.env.NEXT_PUBLIC_REST_BASE_URL}/file-upload/${cat.id}`, {
      method: 'POST',
      headers: {
        Authorization: authToken.authorizationString,
      },
      body: data,
    });

    const { uploaded } = await response.json();
    if (uploaded) {
      const updatedCat = await getCat(cat.id);
      setCat((cat) => ({ ...cat, pictures: [...updatedCat.pictures] }));

      toast.success(uploaded > 1 ? `Añadidas ${uploaded} nuevas imagenes` : 'Añadida 1 nueva imagen');
    }
  };

  const fetchData = async () => {
    setLoading(true);

    const id = router?.query?.id ? +router.query.id : undefined;
    const colonyId = router?.query?.colonyId ? +router.query.colonyId : undefined;

    if (!id && !colonyId) {
      toast.error('Error inesperado');
      router.replace('/');
      return;
    }

    const [cat, ceaseCauses, colors, patterns, eyeColors] = await Promise.all([
      id ? getCat(+id) : Promise.resolve({ ...emptyCat, colonyId } as Cat),
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
    <h1>Gato CAT{cat?.id}</h1>
      <InputModal
        id="AnnotationModal"
        title="Nueva Anotación"
        caption="Texto"
        buttonCaption="Añadir"
        isOpen={isAnnotationModalOpen}
        onClose={() => setAnnotationModalOpen(false)}
        onReturn={onNewAnnotation}
      />

      <UploadModal
        id="UploadModal"
        isOpen={isUploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        onReturn={onPicturesSubmit}
      ></UploadModal>

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
                      <label htmlFor="bornAt" className="form-label">
                        Nacimiento
                      </label>
                      <ReactDatePicker
                        id="bornAt"
                        className="form-control"
                        locale="es"
                        value={cat?.bornAt?.toLocaleDateString()}
                        onChange={(date: Date) => onDateChange(date, 'bornAt')}
                      />
                    </div>
                    <div className="col-md-2">
                      <label htmlFor="gender" className="form-label">
                        Sexo
                      </label>
                      <select id="gender" className="form-control" value={cat?.gender} onChange={onGenderChange}>
                        <option value="Male">Macho</option>
                        <option value="Female">Hembra</option>
                        <option value="Unknown">Desconocido</option>
                      </select>
                    </div>
                    <div className="col-md-2">
                      <label className="form-label">Colonia</label>
                      <div>
                        <Link href={`/colonies/${cat?.colonyId}`}>
                          <a className="btn btn-secondary">{cat?.colonyId}</a>
                        </Link>
                      </div>
                    </div>
                  </div>

                  <div className="row mt-3">
                    <div className="col-md-2">
                      <label htmlFor="sterilized" className="form-label"></label>
                      <div className="form-check">
                        <input
                          id="sterilized"
                          className="form-check-input"
                          type="checkbox"
                          checked={cat.sterilized}
                          onChange={onCheckboxChange}
                        />{' '}
                        Esterilizado
                      </div>
                    </div>

                    <div className="col-md-3">
                      <label htmlFor="sterilizedAt" className="form-label">
                        Fecha esterilización
                      </label>
                      <ReactDatePicker
                        id="sterilizedAt"
                        className="form-control"
                        locale="es"
                        value={cat?.sterilizedAt?.toLocaleDateString()}
                        onChange={(date: Date) => onDateChange(date, 'sterilizedAt')}
                      />
                    </div>

                    <div className="col-md-3">
                      <label htmlFor="ceasedAt" className="form-label">
                        Baja
                      </label>
                      <ReactDatePicker
                        id="ceasedAt"
                        className="form-control"
                        locale="es"
                        value={cat?.ceasedAt?.toLocaleDateString()}
                        onChange={(date: Date) => onDateChange(date, 'ceasedAt')}
                      />
                    </div>
                    <div className="col-md-4">
                      <label htmlFor="ceaseCauseId" className="form-label">
                        Causa de baja
                      </label>
                      <PropertySelector
                        id="ceaseCauseId"
                        title="Nueva Causa de Baja"
                        caption="Descripción"
                        allowAdd={authToken.isAdmin}
                        options={ceaseCauses.map((i) => ({ value: i.id, label: i.description }))}
                        value={cat?.ceaseCauseId}
                        onChange={onSelectChange}
                        onCreate={onCreateCeaseCause}
                      />
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-3">
                      <label htmlFor="eyeColorId" className="form-label">
                        Ojos
                      </label>
                      <PropertySelector
                        id="eyeColorId"
                        title="Nuevo color de ojos"
                        caption="Descripción"
                        allowAdd={authToken.isAdmin}
                        multiple={false}
                        options={eyeColors.map((i) => ({ value: i.id, label: i.description }))}
                        value={cat?.eyeColorId}
                        onChange={onSelectChange}
                        onCreate={onCreateEyeColor}
                      />
                    </div>

                    <div className="col-md-3">
                      <label htmlFor="patternId" className="form-label">
                        Disposición
                      </label>
                      <PropertySelector
                        id="patternId"
                        title="Nueva disposición"
                        caption="Descripción"
                        allowAdd={authToken.isAdmin}
                        multiple={false}
                        options={patterns.map((i) => ({ value: i.id, label: i.description }))}
                        value={cat?.patternId}
                        onChange={onSelectChange}
                        onCreate={onCreatePattern}
                      />
                    </div>

                    <div className="col-md-6">
                      <label htmlFor="colors" className="form-label">
                        Colores
                      </label>
                      <PropertySelector
                        id="colors"
                        title="Nuevo color"
                        caption="Descripción"
                        allowAdd={authToken.isAdmin}
                        multiple={true}
                        value={cat?.colors}
                        options={colors.map((i) => ({ value: i.id, label: i.description }))}
                        onChange={onSelectChange}
                        onCreate={onCreateColor}
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
        </div>

        <div className="row mb-4">
          <div className="col-md-12">
            <div className="shadow p-3 bg-body rounded">
              <div className="d-flex justify-content-between">
                <div>
                  <i className="far fa-sticky-note mr-2" aria-hidden="true"></i>
                  Anotaciones
                </div>
                <button className="btn btn-primary btn-sm mb-3" onClick={onAddAnnotation} disabled={!cat.id}>
                  <i className="fa fa-plus-circle" aria-hidden="true"></i>
                </button>
              </div>

              <DataTable
                columns={annotationsColumns}
                data={cat.annotations || []}
                dense={true}
                highlightOnHover={true}
                progressPending={loading}
                striped={true}
              />
            </div>
          </div>
        </div>

        <div className="row mb-4">
          <div className="col-md-12">
            <div className="shadow p-3 bg-body rounded" style={{ minHeight: '500px' }}>
              <div className="d-flex justify-content-between">
                <div>
                  <i className="fa fa-camera mr-2" aria-hidden="true"></i>
                  Fotos
                </div>
                <button
                  className="btn btn-primary btn-sm mb-3"
                  disabled={!cat.id}
                  onClick={() => setUploadModalOpen(true)}
                >
                  <i className="fa fa-plus-circle" aria-hidden="true"></i>
                </button>
              </div>

              {cat.pictures?.length && (
                <ImageGallery
                  thumbnailPosition="bottom"
                  showNav={!isUploadModalOpen && !isAnnotationModalOpen}
                  showFullscreenButton={!isUploadModalOpen && !isAnnotationModalOpen}
                  showPlayButton={false}
                  items={
                    cat.pictures
                      ? cat.pictures.map((i) => ({
                          original: `${process.env.NEXT_PUBLIC_PICTURES_BASE_URL}/${i.image}`,
                          thumbnail: `${process.env.NEXT_PUBLIC_PICTURES_BASE_URL}/${i.thumbnail}`,
                        }))
                      : []
                  }
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default withPrivateRoute(CatDetails);
