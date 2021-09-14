import { useRouter } from 'next/router';

const Cat = () => {
  const router = useRouter();

  return (
    <>
      <h1>Colonia</h1>

      <p>Ficha de la colonia {router.query.id}</p>
    </>
  );
};

export default Cat;
