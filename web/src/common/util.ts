import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();

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

export const apiCall = async (query: string) => {
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // Authorization: "Bearer " + "## API KEY"
    },
  };

  return await fetch(publicRuntimeConfig.apiBaseUrl, {
    ...options,
    body: JSON.stringify({ query }),
  }).then((response) => response.json());
  // TODO: catch
};
