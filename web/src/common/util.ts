import { Cat } from '../services/cats';
import { Color } from '../services/colors';
import { Auth } from './authToken';

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

export const coatFromCat = (cat: Cat) => {
  let pattern = cat.patternId !== 0 ? cat.pattern?.description : '';
  return (
    pattern +
    (pattern ? ' ' : '') +
    cat.colors?.reduce(
      (acc: string, color: Color) => (color.id !== 0 ? (acc ? acc + ', ' : '') + color.description : acc),
      '',
    )
  );
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
  const apiBaseUrl: string = process.env.NEXT_PUBLIC_GRAPHQL_BASE_URL as string;

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + (await Auth.getToken()),
    },
  };

  // TODO: handle 401 - Unauthorized
  return await fetch(apiBaseUrl, {
    ...options,
    body: JSON.stringify({ query, variables }),
  }).then((response) => response.json());
  // TODO: catch
};
