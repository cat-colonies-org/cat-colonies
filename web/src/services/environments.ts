import { apiCall, getCriteriaString } from '../common/util';

const environmentQueryFields: string = `
  id
  description
`;

export type Environment = {
  id: number;
  description: string;
};

export interface EnvironmentList {
  total: number;
  items: Environment[];
}

const getEnvironmentFromGraphQlResult = (environment: Record<string, any>): Environment => {
  return environment as Environment;
};

export async function getEnvironmentsList({
  filter,
  page,
  perPage,
}: {
  filter?: Record<string, any>;
  page?: number;
  perPage?: number;
}): Promise<EnvironmentList> {
  const criteria = getCriteriaString({ filter, page, perPage });

  const query = `query {
      environments (${criteria}) {
        total
        items {
          ${environmentQueryFields}
        }
      }
    }`;

  return await apiCall(query).then((response): EnvironmentList => {
    const environments = response?.data?.environments;

    const total: number = environments ? environments.total : 0;
    const items: Environment[] = environments
      ? environments.items.map((environment: any): Environment => {
          return getEnvironmentFromGraphQlResult(environment);
        })
      : [];

    return { items, total };
  });
}

export async function createEnvironment(description: string): Promise<Environment> {
  const query = `mutation {
    createEnvironment(createEnvironmentInput: {description: "${description}"}) { id description }
  }`;

  return await apiCall(query).then((response): Environment => {
    return response?.data?.createEnvironment;
  });
}
