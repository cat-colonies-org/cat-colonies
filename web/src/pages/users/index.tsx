import { User, getUsersList} from '../../services/users';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import DataTable, { TableColumn } from 'react-data-table-component';
import withPrivateRoute from '../../components/with-private-route';

const UsersList = () => {
  const [data, setData] = useState([] as User[]);
  const [loading, setLoading] = useState(false);
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(10);

  const router = useRouter();

  const fetchData = async (page: number, newPerPage?: number) => {
    setLoading(true);

    const users = await getUsersList({ page, perPage: newPerPage || perPage });

    setData(users.items);
    setTotalRows(users.total);
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


  const columns: TableColumn<User>[] = [
    { name: 'Id', selector: (user) => user.id, width: '60px' },
    { name: 'Alta', selector: (user) => new Date(user.createdAt).toLocaleDateString(), width: '100px' },
    {
      name: 'Rol',
      width: '150px',
      selector: (user) => user.role?.description,
    },
    { name: 'Nombre', selector: (user) => user.name, width: '150px' },
    { name: 'Apellidos', selector: (user) => user.surnames, width: '250px' },
    { name: 'Teléfono', selector: (user) => user.phoneNumber, width: '100px' },
    { name: 'Email', selector: (user) => user.email, width: '200px' },


  ];

  return (
    <>
      <p>Listado de gestoras</p>

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
        onRowClicked={(row) => router.push(`/users/${row.id}`)}
      />
    </>
  );
};

export default withPrivateRoute(UsersList);
