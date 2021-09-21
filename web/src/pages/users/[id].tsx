import { useRouter } from 'next/router';

const CatDetails = () => {
  const router = useRouter();

  return (
    <>
      <h1>Usuario</h1>

      <p>Ficha del usuarios {router.query.id}</p>
    </>
  );
};

export default CatDetails;
