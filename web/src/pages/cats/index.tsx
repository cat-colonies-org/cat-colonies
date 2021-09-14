import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import DataTable, { TableColumn } from 'react-data-table-component';

type CatRow = {
  id: number;
  imageUrl: string;
  createdAt: Date;
  color: string;
  pattern: string;
  sterilized: boolean;
  birthYear: number;
  colonyAddress: string;
  colonyLocationType: string;
  colonyEnvironment: string;
};

const Cats = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(10);

  const router = useRouter();

  const fetchData = async (page: number, newPerPage?: number) => {
    setLoading(true);

    const skip = Math.max(page - 1, 0) * perPage;
    const take = newPerPage || perPage;

    const query = `query {
      cats (order: "id", descending: false, skip: ${skip}, take: ${take}) {
        total
        items {
          id
          imageURL
          createdAt
          color { description }
          pattern { description }
          sterilized
          birthYear
          colony {
            address
            locationType { description }
            environment { description }
          }
        }
      }
    }`;

    const options = {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        // Authorization: "Bearer " + "## API KEY"
      },

      body: JSON.stringify({ query }),
    };

    // await fetch('http://cats.daviddiaz.es:8080/graphql', options) // TODO: llevar a configuración
    await fetch('http://service:8080/graphql', options)
      .then((response) => response.json())
      .then((response) => {
        const cats = response?.data?.cats;
        if (!cats) return;

        const selected = response.data.cats.items.map((cat: any): CatRow => {
          return {
            id: cat.id,
            imageUrl: cat.imageURL,
            createdAt: cat.createdAt,
            color: cat.color.description,
            pattern: cat.pattern.description,
            sterilized: cat.sterilized,
            birthYear: cat.birthYear,
            colonyAddress: cat.colony?.address,
            colonyLocationType: cat.colony?.locationType.description,
            colonyEnvironment: cat.colony?.environment.description,
          };
        });

        setData(selected);
        setTotalRows(cats.total);
        setLoading(false);
      });
    // TODO: catch
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
