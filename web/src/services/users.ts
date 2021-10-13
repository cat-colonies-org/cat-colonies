import { apiCall, getCriteriaString } from '../common/util';
import { Colony } from './colonies';

export const userQueryFields: string = `
  id
  createdAt
  name
  surnames
  phoneNumber
  email
  roleId
  idCard
  authorizesWhatsApp
  role { id description }
  colonies { id address createdAt 
      town {name} 
      locationType {description} 
      environment {description} 
    }
`;

export type User = {
  id: number;
  createdAt: Date;
  name: string;
  surnames: string;
  phoneNumber: number;
  email: string;
  roleId: number;
  idCard: string;
  authorizesWhatsApp: boolean;
  role: { description: string };
  colonies: Colony[];
};

export interface UsersList {
  total: number;
  items: User[];
}

const getUserFromGraphQlResult = (user: Record<string, any>): User => {
  return {
    ...user,
    createdAt: new Date(),
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

  const query = `query {
      users (${criteria}) {
        total
        items {
          ${userQueryFields}
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
  const query = `query {
      user (id:${id}) {
        ${userQueryFields}
      }
    }`;

  return await apiCall(query).then((response): User => {
    return getUserFromGraphQlResult(response?.data?.user);
  });
}
