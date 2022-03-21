// DATA
import "./serviceDoc.js";
import {localEntries} from "../../../demo_implementations/repositories/localRepository.js";
import {tableConfig} from "../../config.js";

export { testService }

/**
 * Concrete factory for local {@link TableService} functions.
 * @constructor
 */
const testService = () => {
    let totalData = null;
    let currentEntries = [];

    const SIMULATED_FETCH_DELAY = tableConfig.testing.SIMULATED_FETCH_DELAY;

    // set initial data
    totalData = localEntries;
    currentEntries = totalData;

    /**
     * Fetch x entries fulfilling a filter from a local repository.
     * @param {Filter} filter
     * @return
     */
    const applyFilter = (filter) => {
        let entriesProxy = totalData;

        /**
         * Filtering.
         */
        for (const [index, columnFilter] of filter.ColumnFilters.entries()) {
            if (columnFilter !== '') {
                entriesProxy = entriesProxy.filter(entry => entry[Object.keys(entry)[index]].toString().toLowerCase().includes(columnFilter));
            }
        }

        /**
         * Sorting.
         */
        if (filter.ColumnSorter.state === "desc") {
            entriesProxy.sort((a, b) => a[Object.keys(a)[filter.ColumnSorter.column]] > b[Object.keys(b)[filter.ColumnSorter.column]] ? 1 : -1);
        } else if (filter.ColumnSorter.state === "asc") {
            entriesProxy.sort((a, b) => a[Object.keys(a)[filter.ColumnSorter.column]] < b[Object.keys(b)[filter.ColumnSorter.column]] ? 1 : -1);
        }

        currentEntries = entriesProxy;
        return entriesProxy;
    }

    /**
     * getData is responsible for fetching the appropriate data entries,
     * returning from a filtered subset the first n = pageSize items starting at startindex.
     * @param {Filter} filter
     * @param {Number} startIndex
     * @param {Number} endIndex
     */
    const getDataWithFilter = (filter, startIndex, endIndex) => {
        const filteredData = applyFilter(filter);
        const filteredDataSubset = (filteredData.length < endIndex + 1) ? filteredData : filteredData.slice(startIndex, endIndex);

        const filteredDataSubsetPromise     = new Promise((resolve) => setTimeout(() => resolve(filteredDataSubset),  SIMULATED_FETCH_DELAY));
        const filteredDataSubsetSizePromise = new Promise((resolve) => setTimeout(() => resolve(filteredData.length), SIMULATED_FETCH_DELAY));
        const totalDataSizePromise          = new Promise((resolve) => setTimeout(() => resolve(totalData.length),    SIMULATED_FETCH_DELAY));

        return Promise.all([filteredDataSubsetPromise, filteredDataSubsetSizePromise, totalDataSizePromise]);
    }

    const getSingleDataEntry = (_, index) => {
        return new Promise((resolve) => setTimeout(() => resolve(currentEntries[index]), SIMULATED_FETCH_DELAY));
    }

    return {
        getDataWithFilter,
        getSingleDataEntry,
        applyFilter         //only exposed for test purposes
    }
}