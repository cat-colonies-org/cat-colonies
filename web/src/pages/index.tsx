import type { NextPage } from 'next';
import withPrivateRoute from '../components/with-private-route';

const Home: NextPage = () => {
  return (
    <>
      <h1>Home</h1>
      <p>Un servicio para controlarlos a todos...</p>
    </>
  );
};

export default withPrivateRoute(Home);
