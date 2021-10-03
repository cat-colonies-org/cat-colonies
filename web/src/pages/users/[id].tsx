import es from 'date-fns/locale/es';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { registerLocale } from 'react-datepicker';
import { toast } from 'react-toastify';
import withPrivateRoute from '../../components/with-private-route';
import { User, getUser } from '../../services/users';


registerLocale('es', es);


const UserDetails = () => {
  const router = useRouter();

  const emptyUser: Partial<User> = Object.freeze({
    createdAt: new Date(),
    name: '',
    surnames: '',
    phoneNumber: 0,
    email: '',
    roleId: 0,
  });

  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({} as User);
  //const [ceaseCauses, setCeaseCauses] = useState([] as CeaseCause[]);
  
  const descriptionSorter = (a: { description: string }, b: { description: string }): number => {
    return a.description.localeCompare(b.description);
  };

  const fetchData = async () => {
    setLoading(true);

    const id = router?.query?.id ? +router.query.id : undefined;
    if (!id) {
      toast.error('Error inesperado');
      router.replace('/');
      return;
    }

    const [user] = await Promise.all([
      id ? getUser(+id) : Promise.resolve({ ...emptyUser } as User)
    ]);
  
    if (user) setUser(user);
    
    setLoading(false);
  };

  useEffect((): void => {
    fetchData();
  }, []);


  return (
    <>
      <h1>Usuario</h1>

      <p>Ficha del usuarios {router.query.id}</p>
      <div className="row mt-3">
        <div className="col-md-6">
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input
            id="address"
            type="text"
            placeholder="Email del usuario"
            className="form-control"
            value={user?.email}            
          />
        </div>
      </div>
    </>
  );
};

export default withPrivateRoute(UserDetails);
