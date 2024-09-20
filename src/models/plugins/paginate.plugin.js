/* eslint-disable no-param-reassign */

// const paginate = (schema) => {
/**
 * @typedef {Object} QueryResult
 * @property {Document[]} results - Results found
 * @property {number} page - Current page
 * @property {number} limit - Maximum number of results per page
 * @property {number} totalPages - Total number of pages
 * @property {number} totalResults - Total number of documents
 */
/**
 * Query for documents with pagination
 * @param {Object} [filter] - Mongo filter
 * @param {Object} [options] - Query options
 * @param {string} [options.sortBy] - Sorting criteria using the format: sortField:(desc|asc). Multiple sorting criteria should be separated by commas (,)
 * @param {string} [options.populate] - Populate data fields. Hierarchy of fields should be separated by (.). Multiple populating criteria should be separated by commas (,)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
// const paginate = (schema) => {
//   schema.statics.paginate = async function (filter, options) {
//     let sort = '';
//     if (options.sortBy) {
//       const sortingCriteria = [];
//       options.sortBy.split(',').forEach((sortOption) => {
//         const [key, order] = sortOption.split(':');
//         sortingCriteria.push((order === 'desc' ? '-' : '') + key);
//       });
//       sort = sortingCriteria.join(' ');
//     } else {
//       sort = 'createdAt';
//     }

//     const limit = options.limit && parseInt(options.limit, 10) > 0 ? parseInt(options.limit, 10) : 10;
//     const page = options.page && parseInt(options.page, 10) > 0 ? parseInt(options.page, 10) : 1;
//     const skip = (page - 1) * limit;

//     const countPromise = this.countDocuments(filter).exec();
//     let docsPromise = this.find(filter).sort(sort).skip(skip).limit(limit);

//     if (options.populate) {
//       options.populate.split(',').forEach((populateOption) => {
//         docsPromise = docsPromise.populate(
//           populateOption
//             .split('.')
//             .reverse()
//             .reduce((a, b) => ({ path: b, populate: a }))
//         );
//       });
//     }

//     docsPromise = docsPromise.exec();

//     return Promise.all([countPromise, docsPromise]).then((values) => {
//       const [totalResults, results] = values;
//       const totalPages = Math.ceil(totalResults / limit);
//       const result = {
//         results,
//         page,
//         limit,
//         totalPages,
//         totalResults,
//       };
//       return Promise.resolve(result);
//     });
//   };
// };

// module.exports = paginate;

const paginate = (schema) => {
  schema.statics.paginate = async function (filter, options) {
    let sort = '';
    if (options.sortBy) {
      const sortingCriteria = [];
      options.sortBy.split(',').forEach((sortOption) => {
        const [key, order] = sortOption.split(':');
        sortingCriteria.push((order === 'desc' ? '-' : '') + key);
      });
      sort = sortingCriteria.join(' ');
    } else {
      sort = 'createdAt';
    }

    // Check if limit is provided, otherwise return all data
    const limit = options.limit && parseInt(options.limit, 10) > 0 ? parseInt(options.limit, 10) : null;
    const page = options.page && parseInt(options.page, 10) > 0 ? parseInt(options.page, 10) : 1;
    const skip = limit ? (page - 1) * limit : 0;

    const countPromise = this.countDocuments(filter).exec();
    let docsPromise = this.find(filter).sort(sort).skip(skip);

    // Only apply limit if it is specified
    if (limit) {
      docsPromise = docsPromise.limit(limit);
    }
    if (options.populate) {
      options.populate.split(',').forEach((populateOption) => {
        docsPromise = docsPromise.populate(
          populateOption
            .split('.')
            .reverse()
            .reduce((a, b) => ({ path: b, populate: a }))
        );
      });
    }

    docsPromise = docsPromise.exec();

    return Promise.all([countPromise, docsPromise]).then((values) => {
      const [totalResults, results] = values;
      // Calculate totalPages only if limit is set, otherwise set totalPages as 1
      const totalPages = limit ? Math.ceil(totalResults / limit) : 1;
      const result = {
        results,
        page,
        limit: limit || totalResults,  // Return totalResults as limit if no limit is set
        totalPages,
        totalResults,
      };
      return Promise.resolve(result);
    });
  };
};

module.exports = paginate;


//   schema.statics.paginate = async function (filter, options) {
//     let sort = '';
//     if (options.sortBy) {
//       const sortingCriteria = [];
//       options.sortBy.split(',').forEach((sortOption) => {
//         const [key, order] = sortOption.split(':');
//         sortingCriteria.push((order === 'desc' ? '-' : '') + key);
//       });
//       sort = sortingCriteria.join(' ');
//     } else {
//       sort = 'createdAt';
//     }

//     let limit = options.limit && parseInt(options.limit, 10) > 0 ? parseInt(options.limit, 10) : null;
//     const page = options.page && parseInt(options.page, 10) > 0 ? parseInt(options.page, 10) : 1;
//     const skip = (page - 1) * (limit || 0);

//     const countPromise = this.countDocuments(filter).exec();
//     let docsPromise = this.find(filter).sort(sort).skip(skip).limit(limit);

//     if (options.populate) {
//       options.populate.split(',').forEach((populateOption) => {
//         docsPromise = docsPromise.populate(
//           populateOption
//             .split('.')
//             .reverse()
//             .reduce((a, b) => ({ path: b, populate: a }))
//         );
//       });
//     }

//     docsPromise = docsPromise.exec();

//     return Promise.all([countPromise, docsPromise]).then((values) => {
//       const [totalResults, results] = values;
//       const totalPages = limit ? Math.ceil(totalResults / limit) : 1;
//       const result = {
//         results,
//         page,
//         limit: limit || totalResults, // If limit is null, set it to totalResults
//         totalPages,
//         totalResults,
//       };
//       return Promise.resolve(result);
//     });
//   };
// };

// module.exports = paginate;
