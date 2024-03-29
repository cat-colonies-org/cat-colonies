import { Cat, Gender, getCatsList, isKitten } from '../../services/cats';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import DataTable, { TableColumn } from 'react-data-table-component';
import withPrivateRoute from '../../components/with-private-route';
import { coatFromCat } from '../../common/util';

const CatsList = () => {
  const [data, setData] = useState([] as Cat[]);
  const [loading, setLoading] = useState(false);
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(10);

  const router = useRouter();

  const fetchData = async (page: number, newPerPage?: number) => {
    setLoading(true);

    const cats = await getCatsList({ page, perPage: newPerPage || perPage });

    setData(cats.items);
    setTotalRows(cats.total);
    setLoading(false);
  };

  const handlePageChange = (page: number) => {
    fetchData(page);
  };

  const handlePerRowsChange = (newPerPage: number, page: number) => {
    fetchData(page, newPerPage);
    setPerPage(newPerPage);
  };

  useEffect(() => {
    fetchData(1, perPage);
  }, []);

  const columns: TableColumn<Cat>[] = [
    { name: 'Id', selector: (cat) => 'CAT' + cat.id, width: '80px' },
    // { name: 'Alta', selector: (cat) => new Date(cat.createdAt).toLocaleDateString(), width: '100px' },
    // {
    //   name: 'Nacimiento',
    //   selector: (cat) => (cat.bornAt ? new Date(cat.bornAt).toLocaleDateString() : ''),
    //   width: '100px',
    // },
    {
      name: 'Sexo',
      width: '100px',
      selector: (cat) => (cat.gender === Gender.Male ? 'Macho' : cat.gender === Gender.Female ? 'Hembra' : ''),
    },
    {
      name: 'Esterilizado',
      width: '110px',
      selector: (cat) =>
        cat.sterilized
          ? `Esterilizado ${cat.sterilizedAt ? '(' + new Date(cat.sterilizedAt).toLocaleDateString() + ')' : ''}`
          : '',
    },
    {
      name: 'Cachorro',
      width: '95px',
      selector: (cat) => (isKitten(cat) ? 'Cachorro' : ''),
    },
    {
      name: 'Capa',
      width: '180px',
      selector: coatFromCat,
    },
    {
      name: 'Fotos',
      width: '100px',
      selector: (cat) => cat.pictures?.length || '',
    },
    {
      name: 'Baja',
      selector: (cat) => (cat.ceasedAt ? new Date(cat.ceasedAt).toLocaleDateString() : ''),
      width: '100px',
    },
    { name: 'Causa baja', selector: (cat) => (cat.ceaseCauseId ? cat.ceaseCause?.description : '') },
    {
      name: 'Colonia',
      selector: (cat) => {
        return cat.colony ? `${cat.colony.address} - ${cat.colony.town?.name} (${cat.colony.id})` : '';
      },
    },
  ];

  // const columns: TableColumn<Cat>[] = [
  //   { name: 'Id', selector: (cat) => cat.id },
  //   {
  //     name: 'Foto',
  //     cell: (row) => <img height="56px" width="56px" style={styles.avatar} alt="" src={row.image} />,
  //   },
  //   { name: 'Alta', selector: (cat) => cat.createdAt?.toLocaleDateString() },
  //   { name: 'Nacimiento', selector: (cat) => cat.bornAt?.toLocaleDateString() },
  //   {
  //     name: 'Esterilizado',
  //     selector: (cat) => cat.sterilized,
  //     format: (cat) => (cat.sterilized ? 'Sí' : 'No'),
  //   },
  //   { name: 'Color', selector: (cat) => cat.color?.description },
  //   { name: 'Patrón', selector: (cat) => cat.pattern?.description },
  // ];

  return (
    <>
      <p>Listado de gatos</p>

      <DataTable
        columns={columns}
        data={data}
        highlightOnHover={false}
        striped={true}
        progressPending={loading}
        pagination
        paginationServer
        paginationRowsPerPageOptions={[10, 25, 50, 100]}
        paginationTotalRows={totalRows}
        onChangeRowsPerPage={handlePerRowsChange}
        onChangePage={handlePageChange}
        onRowClicked={(row) => router.push(`/cats/${row.id}`)}
      />
    </>
  );
};

export default withPrivateRoute(CatsList);
