import type { NextPage } from 'next';
import withPrivateRoute from '../components/withPrivateRoute';

const Home: NextPage = () => {
  return (
    <>
      <h1>Home</h1>
      <p>Un servicio para controlarlos a todos...</p>
    </>
  );
};

export default withPrivateRoute(Home);
