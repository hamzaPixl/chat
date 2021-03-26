type Configuration = {
  propertyName: string;
};

type Configurations = {
  [filterName: string]: Configuration;
};

type ConfigurationsProps = Array<
  Configuration & {
    filterName: string;
  }
>;

type Sort = {
  [propertyName: string]: number;
};

export enum SortDirection {
  ASCENDING = 1,
  DESCENDING = -1,
}

/**
 * Allows to build a list of configuration mapping between the sort asked from the http
 * and the property name(s) we need to map on the (mongo) document
 *
 */
export class SortBuilder {
  configurations: Configurations;
  defaultSort: keyof Configurations;
  sortDirection: SortDirection;

  constructor(configurations: ConfigurationsProps) {
    this.configurations = {};
    this.defaultSort = '';
    this.sortDirection = SortDirection.ASCENDING;

    configurations.forEach((configuration) => {
      this.configurations[configuration.filterName] = {
        propertyName: configuration.propertyName,
      };
    });
  }

  setDefault(propertyName: string, sortDirection: SortDirection): void {
    this.defaultSort = propertyName;
    this.sortDirection = sortDirection;
  }

  buildQuery(sort: string, sortDirection: string): Sort {
    let direction = this.sortDirection;

    if (sortDirection === 'asc') {
      direction = SortDirection.ASCENDING;
    } else if (sortDirection === 'desc') {
      direction = SortDirection.DESCENDING;
    }

    return {
      [this.configurations[sort]?.propertyName || this.defaultSort]: direction,
    };
  }
}
