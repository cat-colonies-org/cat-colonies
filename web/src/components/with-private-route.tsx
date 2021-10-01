import { AuthToken, TOKEN_STORAGE_KEY } from '../common/authToken';
import { NextPageContext } from 'next';
import Router from 'next/router';
import ServerCookie from 'next-cookies';

const login = '/login?redirected=true';

const checkUserAuthentication = (context: NextPageContext) => {
  const noAuth = { auth: null };

  const token = ServerCookie(context)[TOKEN_STORAGE_KEY];
  if (!token) return noAuth;

  const auth = new AuthToken(token);
  if (!auth) return noAuth;

  if (!auth.isValid) return noAuth;
  if (auth.isExpired) return noAuth;

  return { auth };
};

const withPrivateRoute = (WrappedComponent: any) => {
  const hocComponent = ({ ...props }) => <WrappedComponent {...props} />;

  hocComponent.getInitialProps = async (context: any) => {
    const userAuth = await checkUserAuthentication(context);

    if (!userAuth?.auth) {
      if (context.res) {
        context.res?.writeHead(302, { Location: login });
        context.res?.end();
      } else {
        Router.replace(login);
      }
    } else if (WrappedComponent.getInitialProps) {
      const wrappedProps = await WrappedComponent.getInitialProps({ ...context, auth: userAuth });
      return { ...wrappedProps, ...userAuth };
    }

    return { ...userAuth };
  };

  return hocComponent;
};

export default withPrivateRoute;
