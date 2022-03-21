/**
 * Describes the object used for initializing and testing a table component.
 * @typedef {Object} TableConfig
 * @property {ApplicationConfig} app
 * @property {TestingConfig} testing
 * @example
 * {
        app: {
            rowHeight: 60,
            nrVisibleRows: 8,
            filterObj: {
                ColumnFilters: ['', '', '', '', '', ''],
                ColumnSorter:
                    {
                        column: undefined,
                        state:  ''
                    }
            },
            columnWidths: [150, 560, 250, 150, 560, 250, 560, 540]
        },
        testing: {
            SIMULATED_FETCH_DELAY: 150,
        }
    }
 */

/**
 * Describes the object used for initializing a table component.
 * @typedef {Object} ApplicationConfig
 * @property {number} rowHeight - Defines the height of the rendered table rows in pixels.
 * @property {number} nrVisibleRows - Defines the number of rendered rows the table displays at a time.
 * @property {Filter} filterObj
 * @property {ColumnWidths} columnWidths
 * @example
 * {
        rowHeight: 60,
        nrVisibleRows: 8,
        filterObj: {
            ColumnFilters: ['', '', '', '', '', ''],
            ColumnSorter:
                {
                    column: undefined,
                    state:  ''
                }
        },
        columnWidths: [150, 560, 250, 150, 560, 250, 560, 540]
    }
 */

/**
 * Describes the object used for testing a table component.
 * @typedef {Object} TestingConfig
 * @property {number} SIMULATED_FETCH_DELAY - Delay in ms that is used for testing simulating asynchronous data calls.
 * @example
 * {
        SIMULATED_FETCH_DELAY: 150,
    }
 */

/**
 * Describes a filter object.
 * @typedef {Object} Filter
 * @property {Array<string>} ColumnFilters
 * @property ColumnSorter ColumnSorter
 * @example
 * {
      ColumnFilters: [
        "", "u", "z", "", ""
      ],
      ColumnSorter:
        {
            column: 1,
            state: "desc"
        }
    }
 */

/**
 * Describes the object used for sorting.
 * @typedef {Object} ColumnSorter
 * @property {number} column - The index of the column the sorting applies to.
 * @property {('asc'|'desc'|'')} state - The sorting criteria.
 * @example
 * {
        column: 1,
        state: "desc"
    }
 */

/**
 * Describes the column width property.
 * @typedef ColumnWidths
 * @type {Array}
 * @example
 {
       [20, 40, 60, 80, 60, 40]
   }
 */

//todo: replace with generics
/**
 * Describes one entry of a dataset. All properties of a data entry must be accessible on the first level.
 * @typedef Entry
 * @type {Object}
 * @example
 * {id:0, name: "Hans Muster", email: "hans.muster@gmail.com", address: "9038 Metus Rd.", country: "New Zealand", region: "Melilla"}
 */



/**
 * Describes the filter set for a facet (or a combination of facets).
 * It has either the property 'or' or the property 'and'.
 * @typedef {Object} Filter
 * @property {Object.<string, FacetSelection>} [or] - Facets are combined with 'and'
 * @property {Object.<string, FacetSelection>} [and] - Facets are combined with 'or'
 * @example
 * {
        or:
            {
                Surface: {
                    foci: ['Grass'],
                    groupType: 'none',
                    grouping: []
                },
                WRank: {
                    foci: ['1-10'],
                    groupType: 'range',
                    grouping: [{
                        name: 'unassigned',
                        foci: [],
                    }, {
                        name: '1-10',
                        foci: [1, 11]
                    }]
                }
            }
    }
 */