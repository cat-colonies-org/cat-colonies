import { AuthToken } from './authToken';

export const omit = (obj: Record<string, any>, props: string[]) => {
  const result = { ...obj };
  props.forEach(function (prop) {
    delete result[prop];
  });
  return result;
};

export const objToListString = (obj: Record<string, any>): string => {
  return Object.keys(obj).reduce((composed, key) => {
    composed += composed ? ', ' : '';
    return composed + `${key}: ${JSON.stringify(obj[key])}`;
  }, '');
};

export const getCriteriaString = ({
  filter,
  page,
  perPage,
}: {
  filter?: Record<string, any>;
  page?: number;
  perPage?: number;
}): string => {
  let criteria = 'order: "id"';

  if (filter) {
    const filterString = objToListString(filter);
    criteria += filterString;
  }

  if (page && perPage) {
    const skip = Math.max(page - 1, 0) * perPage;
    const take = perPage;
    criteria += `, skip: ${skip}, take: ${take}`;
  }

  return criteria;
};

export const apiCall = async (query: string, variables?: any) => {
  const apiBaseUrl: string = process.env.NEXT_PUBLIC_API_BASE_URL as string;

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + (await AuthToken.getToken()),
    },
  };

  return await fetch(apiBaseUrl, {
    ...options,
    body: JSON.stringify({ query, variables }),
  }).then((response) => response.json());
  // TODO: catch
};
