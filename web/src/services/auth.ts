import { apiCall } from '../common/util';

export const signIn = async (email: string, password: string): Promise<boolean> => {
  const query = `query {
    signin (userCredentials: {email: "${email}" , password: "${password}" }) {
      result 
    }
  }`;

  try {
    const result = await apiCall(query);
    if (result?.data?.signin?.result) {
      // TODO: store JWT
      return true;
    }

    const response = result?.errors[0]?.extensions?.response;
    console.error(`Signin error: ${response?.error}, ${response?.message}, ${response?.statusCode}`);
  } catch (e) {
    console.error(`Signin error: ${e}`);
  }

  return false;
};
