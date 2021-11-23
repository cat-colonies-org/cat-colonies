import { apiCall, getCriteriaString } from '../common/util';
import { Colony } from './colonies';
import { UserAnnotation } from './user-annotations';

export const userDataFragment: string = `
  fragment userData on User {
    id
    name
    surnames
    createdAt
    idCard
    phoneNumber
    email
    authorizesWhatsApp
    password
    role { id description }
    colonies { id address createdAt  }
    annotations { id userId date annotation }
  }
`;

export type User = {
  id: number;
  createdAt: Date;
  name: string;
  surnames: string;
  phoneNumber: string;
  email: string;
  roleId: number;
  idCard: string;
  authorizesWhatsApp: boolean;
  role: { description: string };
  colonies: Colony[];
  annotations: UserAnnotation[];
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

export async function createUser(user: Partial<User>): Promise<User> {
  const query = `
    ${userDataFragment}

    mutation (
      $id: Int,
      $name: String,
      $surnames: String,
      $idCard: String,
      $phoneNumber: String,
      $email: String,
      $createdAt: DateTime,
      $authorizesWhatsApp: Boolean,
      $roleId: Number,
      $colonies: [InputColony!],
    ) {
      createUser(createUserInput: {
        id: $id,
        name: $name,
        surnames: $surnames,
        idCard: $idCard,
        phoneNumber: $phoneNumber,
        email: $email,
        createdAt: $createdAt,
        authorizesWhatsApp: $authorizesWhatsApp,
        roleId: $roleId,
        colonies: $colonies
      }) {
        ...userData
      }
    }
  `;

  return await apiCall(query, user).then((response): User => {
    return getUserFromGraphQlResult(response?.data?.createUser);
  });
}

export async function updateUser(user: Partial<User>): Promise<User> {
  const query = `
    ${userDataFragment}

    mutation (
      $id: Int!,
      $name: String,
      $surnames: String,
      $idCard: String,
      $phoneNumber: String,
      $email: String,
      $authorizesWhatsApp: Boolean,
    ) {
      updateUser(updateUserInput: {
        id: $id,
        name: $name,
        surnames: $surnames,
        idCard: $idCard,
        phoneNumber: $phoneNumber,
        email: $email,
        authorizesWhatsApp: $authorizesWhatsApp,
      }) {
        ...userData
      }
    }
  `;

  return await apiCall(query, user).then((response): User => {
    let user = response?.data?.updateUser;
    user = user ? getUserFromGraphQlResult(user) : undefined;
    return user;
  });
}
