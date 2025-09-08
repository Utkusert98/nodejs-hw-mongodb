import { SORT_ORDER } from '../constants/index.js';

const parseSortOrder = (sortOrder) => {
  if (!sortOrder) return SORT_ORDER.ASC;
  const normalized = sortOrder.toString().toLowerCase();
  const isKnownOrder = [SORT_ORDER.ASC, SORT_ORDER.DESC].includes(normalized);
  return isKnownOrder ? normalized : SORT_ORDER.ASC;
};

const parseSortBy = (sortBy) => {
  const allowedFields = [
    '_id',
    'name',
    'phoneNumber',
    'email',
    'contactType',
    'isFavourite',
    'createdAt'
  ];
  if (allowedFields.includes(sortBy)) return sortBy;
  return '_id';
};

export const parseSortParams = (query) => {
  const { sortOrder, sortBy } = query;
  const parsedSortOrder = parseSortOrder(sortOrder);
  const parsedSortBy = parseSortBy(sortBy);
  return { sortOrder: parsedSortOrder, sortBy: parsedSortBy };
};
