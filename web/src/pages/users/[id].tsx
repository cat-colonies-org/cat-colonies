import { useRouter } from 'next/router';
import withPrivateRoute from '../../components/with-private-route';

const UserDetails = () => {
  const router = useRouter();

  return (
    <>
      <h1>Usuario</h1>

      <p>Ficha del usuarios {router.query.id}</p>
    </>
  );
};

export default withPrivateRoute(UserDetails);
