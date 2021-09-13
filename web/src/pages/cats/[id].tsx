import { useRouter } from 'next/router';

const Cat = () => {
  const router = useRouter();

  return (
    <>
      <h1>Gato</h1>

      <p>Ficha del gato {router.query.id}</p>
    </>
  );
};

export default Cat;
