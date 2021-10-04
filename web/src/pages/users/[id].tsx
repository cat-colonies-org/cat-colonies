import es from 'date-fns/locale/es';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import ReactDatePicker, { registerLocale } from 'react-datepicker';
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

  const onDateChange = (date: Date, field: string): void => {
    setUser((prev: User) => {
      return { ...prev, [field]: date };
    });
  };


  return (
    <>
      <div className="container">
       <div className="row mb-4">
         <div className="col-lg-12">
           <div className="container-md">
             <div className="shadow p-3 bg-body rounded">
              <p>
                <i className="fa fa-id-card mr-2" aria-hidden="true"></i>
                 Datos generales
               </p>
                <form>
                  <div className="row mt-3">
                    <div className="col-md-1">
                      <label htmlFor="id" className="form-label">
                        Id
                      </label>
                      <input
                        id="id"
                        type="text"
                        className="form-control"
                        value={user?.id}
                        placeholder="Nueva colonia"
                        readOnly
                      />
                    </div>
                    <div className="col-md-5">
                      <label htmlFor="name" className="form-label">
                        Nombre
                      </label>
                      <input
                        id="name"
                        type="text"
                        placeholder="Nombre del usuario"
                        className="form-control"
                        value={user?.name}            
                      />
                    </div>
                    <div className="col-md-5">
                      <label htmlFor="surnames" className="form-label">
                        Apellidos
                      </label>
                      <input
                        id="surnames"
                        type="text"
                        placeholder="Apellidos del usuario"
                        className="form-control"
                        value={user?.surnames}            
                      />
                    </div>
                  </div>
                  <div className="row mt-3">
                    
                    <div className="col-md-2">
                      <label htmlFor="idCard" className="form-label">
                        DNI
                      </label>
                      <input
                        id="idCard"
                        type="text"
                        className="form-control"
                        value={user?.idCard}
                        placeholder="idCard"                        
                      />
                    </div>
                    <div className="col-md-4">
                      <label htmlFor="email" className="form-label">
                        Email
                      </label>
                      <input
                        id="email"
                        type="text"
                        className="form-control"
                        value={user?.email}
                        placeholder="Email"                        
                      />
                    </div>
                    <div className="col-md-3">
                      <label htmlFor="phoneNumber" className="form-label">
                        Teléfono
                      </label>
                      <input
                        id="phoneNumber"
                        type="text"
                        className="form-control"
                        value={user?.phoneNumber}
                        placeholder="phoneNumber"                        
                      />
                    </div>
                    <div className="col-md-2">
                      <label htmlFor="authorizesWhatsApp" className="form-label">
                        Autoriza WhatsApp
                      </label>
                      <div className="form-check">
                        <input id="authorizesWhatsApp" className="form-check-input" type="checkbox" checked={user.authorizesWhatsApp} />
                      </div>
                    </div>
                  </div>
                  <div className="row mt-3">
                    <div className="col-md-2">
                      <label htmlFor="createdAt" className="form-label">
                        Alta
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        readOnly
                        value={user?.createdAt?.toLocaleDateString()}
                      />
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default withPrivateRoute(UserDetails);
