import { CatRow, getCatsList } from '../../services/cats';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import DataTable, { TableColumn } from 'react-data-table-component';

const Cats = () => {
  const [data, setData] = useState([] as CatRow[]);
  const [loading, setLoading] = useState(false);
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(10);

  const router = useRouter();

  const fetchData = async (page: number, newPerPage?: number) => {
    setLoading(true);

    const cats = await getCatsList(page, newPerPage || perPage);

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

  const styles = {
    avatar: {
      borderRadius: '50%',
      width: '56px',
      height: '56px',
      margin: '2px',
    },
  };

  const columns: TableColumn<CatRow>[] = [
    { name: 'Id', selector: (cat) => cat.id },
    {
      name: 'Foto',
      cell: (row) => <img height="56px" width="56px" style={styles.avatar} alt="" src={row.imageUrl} />,
    },
    { name: 'Registro', selector: (cat) => cat.createdAt },
    { name: 'Nacimiento', selector: (cat) => cat.birthYear },
    { name: 'Color', selector: (cat) => cat.color },
    { name: 'Patrón', selector: (cat) => cat.pattern },
    {
      name: 'Esterilizado',
      selector: (cat) => cat.sterilized,
      format: (cat) => (cat.sterilized ? 'Sí' : 'No'),
    },
    { name: 'Dirección', selector: (cat) => cat.colonyAddress },
    { name: 'Tipo de localización', selector: (cat) => cat.colonyLocationType },
    { name: 'Entorno', selector: (cat) => cat.colonyEnvironment },
  ];

  return (
    <>
      <h1>Gatos</h1>

      <p>Lista de gatos</p>

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

export default Cats;
