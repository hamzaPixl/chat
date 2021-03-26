export type Filter = {
  name: string;
  value: string;
};

type Page = number;
type Sort = string;
type SortDirection = string;

export type ExtractedQuery = {
  page: Page;
  sort: Sort;
  sortDirection: SortDirection;
  filters: Array<Filter>;
};

export type SortFilterQuery = {
  page?: string;
  sort?: string;
  sortDirection?: string;
} & {
  [key: string]: string | string[];
};

export function extractPage(query: SortFilterQuery): Page {
  if (!query.page) {
    return 1;
  }

  const page = parseInt(query.page, 10);
  return page <= 0 ? 1 : page;
}

export function extractSort(query: SortFilterQuery): Sort {
  return query.sort ?? '';
}

export function extractSortDirection(query: SortFilterQuery): SortDirection {
  return query.sortDirection ?? '';
}

export function buildFilterObject(name: string, value: string): Filter {
  return {
    name,
    value: decodeURI(value),
  };
}

export function extractFilters(query: SortFilterQuery): Array<Filter> {
  const filters: Array<Filter> = [];

  const excludeKeysList = ['sort', 'sortDirection', 'page'];

  Object.keys(query)
    .filter((k) => !excludeKeysList.includes(k))
    .forEach((key) => {
      // if the content is an array, we add all the elements in the array
      if (Array.isArray(query[key])) {
        (query[key] as string[]).forEach((value) => {
          filters.push(buildFilterObject(key, value));
        });
      } else {
        filters.push(buildFilterObject(key, query[key] as string));
      }
    });

  return filters;
}

export function buildSortFilterPagingObject(query: SortFilterQuery): ExtractedQuery {
  return {
    page: extractPage(query) ?? 1,
    sort: extractSort(query),
    sortDirection: extractSortDirection(query),
    filters: extractFilters(query),
  };
}
