import { apiCall, getCriteriaString } from '../common/util';

const userCeaseCauseQueryFields: string = `
  id
  description
`;

export type UserCeaseCause = {
  id: number;
  description: string;
};

export interface UserCeaseCauseList {
  total: number;
  items: UserCeaseCause[];
}

const getUserCeaseCauseFromGraphQlResult = (userCeaseCause: Record<string, any>): UserCeaseCause => {
  return userCeaseCause as UserCeaseCause;
};

export async function getUserCeaseCausesList({
  filter,
  page,
  perPage,
}: {
  filter?: Record<string, any>;
  page?: number;
  perPage?: number;
}): Promise<UserCeaseCauseList> {
  const criteria = getCriteriaString({ filter, page, perPage });

  const query = `query {
      userCeaseCauses (${criteria}) {
        total
        items {
          ${userCeaseCauseQueryFields}
        }
      }
    }`;

  return await apiCall(query).then((response): UserCeaseCauseList => {
    const userCeaseCauses = response?.data?.userCeaseCauses;

    const total: number = userCeaseCauses?.total || 0;
    const items: UserCeaseCause[] = userCeaseCauses
      ? userCeaseCauses.items.map((userCeaseCause: any): UserCeaseCause => {
          return getUserCeaseCauseFromGraphQlResult(userCeaseCause);
        })
      : [];

    return { items, total };
  });
}

export async function createUserCeaseCause(description: string): Promise<UserCeaseCause> {
  const query = `mutation {
    createUserCeaseCause(createUserCeaseCauseInput: {description: "${description}"}) { id description }
  }`;

  return await apiCall(query).then((response): UserCeaseCause => {
    return response?.data?.createUserCeaseCause;
  });
}
