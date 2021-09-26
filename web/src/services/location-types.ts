import { apiCall, getCriteriaString } from '../common/util';

const locationTypeQueryFields: string = `
  id
  description
`;

export type LocationType = {
  id: number;
  description: string;
};

export interface LocationTypeList {
  total: number;
  items: LocationType[];
}

const getLocationTypeFromGraphQlResult = (locationType: Record<string, any>): LocationType => {
  return locationType as LocationType;
};

export async function getLocationTypesList({
  filter,
  page,
  perPage,
}: {
  filter?: Record<string, any>;
  page?: number;
  perPage?: number;
}): Promise<LocationTypeList> {
  const criteria = getCriteriaString({ filter, page, perPage });

  const query = `query {
      locationTypes (${criteria}) {
        total
        items {
          ${locationTypeQueryFields}
        }
      }
    }`;

  return await apiCall(query).then((response): LocationTypeList => {
    const locationTypes = response?.data?.locationTypes;

    const total: number = locationTypes ? locationTypes.total : 0;
    const items: LocationType[] = locationTypes
      ? locationTypes.items.map((locationType: any): LocationType => {
          return getLocationTypeFromGraphQlResult(locationType);
        })
      : [];

    return { items, total };
  });
}

export async function createLocationType(description: string): Promise<LocationType> {
  const query = `mutation {
    createLocationType(createLocationTypeInput: {description: "${description}"}) { id description }
  }`;

  return await apiCall(query).then((response): LocationType => {
    return response?.data?.createLocationType;
  });
}
