import { apiCall, getCriteriaString, objToListString } from '../common/util';
import { Colony } from './colonies';
import { UserAnnotation } from './user-annotations';

export const userDataFragment: string = `
  fragment userData on User {
    id
    name
    surnames
    createdAt
    ceasedAt
    ceaseCauseId
    ceaseCause { description }
    idCard
    phoneNumber
    email
    authorizesWhatsApp
    password
    role { id description }
    colonies { id address createdAt  }
    annotations { id userId date annotation }
    documents { id userId createdAt originalFilename document }
  }
`;

export type UserDocument = {
  id: number;
  userId: number;
  createdAt: Date;
  originalFilename: string;
  document: string;
};

export type User = {
  id: number;
  createdAt: Date;
  ceasedAt: Date;
  ceaseCauseId: number;
  ceaseCause: { description: string };
  name: string;
  surnames: string;
  phoneNumber: string;
  email: string;
  roleId: number;
  idCard: string;
  password: string;
  authorizesWhatsApp: boolean;
  role: { description: string };
  colonies: Colony[];
  annotations: UserAnnotation[];
  documents: UserDocument[];
};

export interface UsersList {
  total: number;
  items: User[];
}

const getUserFromGraphQlResult = (user: Record<string, any>): User => {
  if (!user) return {} as User;

  return {
    ...user,
    createdAt: user.createdAt ? new Date(user.createdAt) : undefined,
    ceasedAt: user.ceasedAt ? new Date(user.ceasedAt) : undefined,
  } as User;
};

export async function getUsersList({
  filter,
  page,
  perPage,
}: {
  filter?: Record<string, any>;
  page?: number;
  perPage?: number;
}): Promise<UsersList> {
  const criteria = getCriteriaString({ filter, page, perPage });

  const query = `
   ${userDataFragment}

    query {
      users (${criteria}) {
        total
        items {
          ...userData
        }
      }
    }`;

  return await apiCall(query).then((response): UsersList => {
    const users = response?.data?.users;

    const total: number = users ? users.total : 0;
    const items: User[] = users
      ? users.items.map((user: any): User => {
          return getUserFromGraphQlResult(user);
        })
      : [];

    return { items, total };
  });
}

export async function getUser(id: number): Promise<User> {
  const query = `
    ${userDataFragment}

    query {
      user (id:${id}) {
        ...userData
      }
    }`;

  return await apiCall(query).then((response): User => {
    return getUserFromGraphQlResult(response?.data?.user);
  });
}

export async function createUser(data: any): Promise<User> {
  const toCreateString = objToListString(data);

  const query = `
    ${userDataFragment}

    mutation {
      createUser (createUserInput: {${toCreateString}}) {
        ...userData
      }
    }
  `;

  return await apiCall(query).then((response): User => {
    return getUserFromGraphQlResult(response?.data?.createUser);
  });
}

export async function updateUser(id: number, data: any): Promise<User> {
  const toUpdateString = objToListString(data);

  const query = `
      ${userDataFragment}
  
      mutation {
        updateUser (updateUserInput: {id: ${id}, ${toUpdateString}}) {
          ...userData
        }
      }
    `;

  return await apiCall(query).then((response): User => {
    return getUserFromGraphQlResult(response?.data?.updateUser);
  });
}
