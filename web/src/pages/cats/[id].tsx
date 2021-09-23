import { useRouter } from 'next/router';
import withPrivateRoute from '../../components/with-private-route';

const CatDetails = () => {
  const router = useRouter();

  return (
    <>
      <h1>Gato</h1>

      <p>Ficha del gato {router.query.id}</p>
    </>
  );
};

export default withPrivateRoute(CatDetails);
