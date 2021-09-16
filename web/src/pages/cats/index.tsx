import { Cat, getCatsList } from '../../services/cats';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import DataTable, { TableColumn } from 'react-data-table-component';

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

  const styles = {
    avatar: {
      borderRadius: '50%',
      width: '56px',
      height: '56px',
      margin: '2px',
    },
  };

  const columns: TableColumn<Cat>[] = [
    { name: 'Id', selector: (cat) => cat.id },
    {
      name: 'Foto',
      cell: (row) => <img height="56px" width="56px" style={styles.avatar} alt="" src={row.imageURL} />,
    },
    { name: 'Registro', selector: (cat) => cat.createdAt?.toLocaleDateString() },
    { name: 'Nacimiento', selector: (cat) => cat.birthYear },
    {
      name: 'Esterilizado',
      selector: (cat) => cat.sterilized,
      format: (cat) => (cat.sterilized ? 'Sí' : 'No'),
    },
    { name: 'Color', selector: (cat) => cat.color.description },
    { name: 'Patrón', selector: (cat) => cat.pattern.description },
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

export default CatsList;
