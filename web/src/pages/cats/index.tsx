import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import DataTable, { TableColumn } from 'react-data-table-component';

type CatRow = {
  id: number;
  sterilized: boolean;
  birthYear: number;
  colonyAddress: string;
  colonyLocationType: string;
  colonyEnvironment: string;
  imageUrl: string;
};

const Cats = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(2);

  const router = useRouter();

  const fetchData = async (page: number, newPerPage?: number) => {
    setLoading(true);

    const skip = Math.max(page - 1, 0) * perPage;
    const take = newPerPage || perPage;

    const query = `query {
      cats (order: "id", descending: false, skip: ${skip}, take: ${take}) {
        id
        sterilized
        birthYear
        imageURL
        colony {
          address
          locationType { description }
          environment { description }
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

    await fetch('http://service:8080/graphql', options)
      .then((response) => response.json())
      .then((response) => {
        console.log(response.data?.cats);
        const cats = response.data?.cats.map((cat: any): CatRow => {
          return {
            id: cat.id,
            sterilized: cat.sterilized,
            birthYear: cat.birthYear,
            colonyAddress: cat.colony.address,
            colonyLocationType: cat.colony.locationType.description,
            colonyEnvironment: cat.colony.environment.description,
            imageUrl: cat.colony.environment.description,
          };
        });

        setLoading(false);
        setData(cats);
        setTotalRows(10);
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

  const columns: TableColumn<CatRow>[] = [
    { name: 'Id', selector: (cat) => cat.id },
    { name: 'Nacimiento', selector: (cat: CatRow) => cat.birthYear },
    {
      name: 'Esterilizado',
      selector: (cat: CatRow) => cat.sterilized,
      format: (cat: CatRow) => (cat.sterilized ? 'Sí' : 'No'),
    },
    { name: 'Dirección', selector: (cat: CatRow) => cat.colonyAddress },
    { name: 'Tipo de localización', selector: (cat: CatRow) => cat.colonyLocationType },
    { name: 'Entorno', selector: (cat: CatRow) => cat.colonyEnvironment },
    { name: '', selector: (cat: CatRow) => cat.imageUrl },
  ];

  return (
    <>
      <h1>Gatos</h1>

      <p>Lista de gatos</p>

      <DataTable
        highlightOnHover={true}
        striped={true}
        columns={columns}
        data={data}
        progressPending={loading}
        pagination
        paginationRowsPerPageOptions={[2, 4, 6, 8]}
        paginationServer
        paginationTotalRows={totalRows}
        onChangeRowsPerPage={handlePerRowsChange}
        onChangePage={handlePageChange}
        onRowClicked={(row) => {
          router.push(`/cats/${row.id}`);
        }}
      />
    </>
  );
};

export default Cats;
