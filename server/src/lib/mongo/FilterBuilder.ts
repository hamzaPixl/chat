import * as mongoose from 'mongoose';
import { Comparison } from './FilterComparison';

type ConfigurationProps = {
  comparison?: Comparison;
  exactMatch?: boolean;
  propertyName: string;
};

type Configuration = {
  comparison: Comparison;
  exactMatch: boolean;
  propertyName: string;
};

type Configurations = {
  [filterName: string]: Array<{
    comparison: Comparison;
    exactMatch: boolean;
    propertyName: string;
  }>;
};

type ConfigurationsProps = Array<
  ConfigurationProps & {
    filterName: string;
  }
>;

type Filter =
  | {
      [comparison: string]: boolean | string | RegExp | Date | string[];
    }
  | string
  | boolean
  | mongoose.Types.ObjectId;

type HttpQueryFilters = Array<{
  name: string;
  value: string;
}>;

export type Query = {
  [propertyName: string]: Filter | Array<{ [propertyName: string]: Filter }>;
};

/**
 * Allows to build a list of configuration mapping between the filters asked from the http
 * and the property name(s) we need to map on the (mongo) document
 *
 */
export class FilterBuilder {
  configurations: Configurations;

  constructor(configurations: ConfigurationsProps) {
    this.configurations = {};

    configurations.forEach((configuration) => {
      if (!this.configurations[configuration.filterName]) {
        this.configurations[configuration.filterName] = [];
      }

      this.configurations[configuration.filterName].push({
        propertyName: configuration.propertyName,
        comparison: configuration.comparison ?? Comparison.EQ,
        exactMatch: configuration.exactMatch ?? false,
      });
    });
  }

  static buildFilter(configuration: Configuration, value: string): Filter | undefined {
    let filter: Filter | undefined = undefined;

    if (configuration.exactMatch) {
      if (configuration.comparison === Comparison.OBJECT_ID) {
        if (mongoose.isValidObjectId(value)) {
          filter = new mongoose.Types.ObjectId(value);
        }
      } else {
        filter = {
          [configuration.comparison]: value,
        };
      }
    } else {
      filter = {
        $regex: new RegExp(
          value
            .replace(/[.+^$[\]\\(){}|-]/g, '\\$&')
            .replace('/*/g', '.*')
            .replace('/?/g', '.?') + '.*',
          'i'
        ),
      };
    }

    return filter;
  }

  buildQuery(httpQueryFilters?: HttpQueryFilters): Query {
    const query: Query = {};

    if (!httpQueryFilters) {
      return query;
    }
    httpQueryFilters
      .filter((filter) => this.configurations[filter.name])
      .forEach((filter) => {
        const configurations = this.configurations[filter.name];

        const queryFilters = configurations.reduce((filtered: { name: string; filter: Filter }[], configuration) => {
          const queryFilter = FilterBuilder.buildFilter(configuration, filter.value);
          if (queryFilter) {
            filtered.push({ name: configuration.propertyName, filter: queryFilter });
          }
          return filtered;
        }, []);

        if (queryFilters.length == 1) {
          query[queryFilters[0].name] = queryFilters[0].filter;
        } else if (queryFilters.length > 1) {
          query.$or = queryFilters.map((queryFilter) => ({
            [queryFilter.name]: queryFilter.filter,
          }));
        }
      });

    return query;
  }
}
