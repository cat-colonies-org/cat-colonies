import DataTable from 'react-data-table-component';

const totalRows: number = 100;
let loading: boolean = false;

interface Cat {
  id: number;
  sterilized: boolean;
  birthYear: number;
  colonyAddress: string;
  colonyLocationType: string;
  colonyEnvironment: string;
}

const handlePerRowsChange = () => {};
const handlePageChange = () => {};

const columns = [
  { name: 'Id', selector: (cat: Cat) => cat.id },
  { name: 'Nacimiento', selector: (cat: Cat) => cat.birthYear },
  {
    name: 'Esterilizado',
    selector: (cat: Cat) => cat.sterilized,
    format: (cat: Cat) => (cat.sterilized ? 'Sí' : 'No'),
  },
  { name: 'Dirección', selector: (cat: Cat) => cat.colonyAddress },
  { name: 'Tipo de localización', selector: (cat: Cat) => cat.colonyLocationType },
  { name: 'Entorno', selector: (cat: Cat) => cat.colonyEnvironment },
];

const Home = ({ cats }: { cats: Cat[] }) => {
  return (
    <>
      <h1>Gatos</h1>

      <p>Lista de gatos</p>

      <DataTable
        highlightOnHover={true}
        striped={true}
        columns={columns}
        data={cats}
        progressPending={loading}
        pagination
        paginationRowsPerPageOptions={[2, 4, 8, 16]}
        // paginationServer
        // paginationTotalRows={totalRows}
        // onChangeRowsPerPage={handlePerRowsChange}
        // onChangePage={handlePageChange}
        onRowClicked={(row) => {
          alert(JSON.stringify(row, null, 2));
        }}
      />
    </>
  );
};

const buildCatsQuery = () => `query {
  cats (order: "id", descending: false) {
    id
    sterilized
    birthYear
    colony {
      address
      locationType { description }
      environment { description }
    }
  }
}`;

export async function getServerSideProps() {
  loading = true;

  const options = {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      // Authorization: "Bearer " + "## API KEY"
    },

    body: JSON.stringify({ query: buildCatsQuery() }),
  };

  return fetch('http://service:8080/graphql', options)
    .then((response) => response.json())
    .then((response) => {
      const cats = response.data?.cats.map((cat: any): Cat => {
        loading = false;

        return {
          id: cat.id,
          sterilized: cat.sterilized,
          birthYear: cat.birthYear,
          colonyAddress: cat.colony.address,
          colonyLocationType: cat.colony.locationType.description,
          colonyEnvironment: cat.colony.environment.description,
        };
      });
      return { props: { cats } };
    });
}

export default Home;
