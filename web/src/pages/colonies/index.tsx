import { ColoniesListRow, getColoniesList } from '../../services/colonies';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import DataTable, { TableColumn } from 'react-data-table-component';

export default function Colonies() {
  const [data, setData] = useState([] as ColoniesListRow[]);
  const [loading, setLoading] = useState(false);
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(10);

  const router = useRouter();

  const fetchData = async (page: number, newPerPage?: number) => {
    setLoading(true);

    const colonies = await getColoniesList(page, newPerPage || perPage);

    setData(colonies.items);
    setTotalRows(colonies.total);
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

  const columns: TableColumn<ColoniesListRow>[] = [
    { name: 'Id', selector: (row) => row.id },
    { name: 'Registro', selector: (row) => row.createdAt },
    { name: 'Dirección', selector: (row) => row.address },
    { name: 'Tipo ubicación', selector: (row) => row.locationType },
    { name: 'Entorno', selector: (row) => row.environment },
    { name: 'Localidad', selector: (row) => row.town },
  ];

  return (
    <>
      <h1>Colonias</h1>

      <p>Lista de Colonias</p>

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
        onRowClicked={(row) => router.push(`/colonies/${row.id}`)}
      />
    </>
  );
}
