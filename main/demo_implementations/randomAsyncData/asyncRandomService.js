// DATA
import "../../BLT/table/service/serviceDoc.js";
import "../../BLT/util/util.mjs";
import { RandomRepository } from "../repositories/randomRepository.js";

export { asyncRandomService }

/**
 * Concrete factory for remote {@link TableService}. Hosts a randomized data set.
 * @property totalData - Contains the complete data set. Simulates a database or similar. For demonstration purposes.
 * @property currentEntries - Cached subset of totalData that is given to the table. For demonstration purposes.
 * @returns { TableService }
 */
const asyncRandomService = dataSize => {
    let totalData = null;
    let currentEntries = [];
    const randomRepository = RandomRepository();
    const SIMULATED_FETCH_DELAY = 800;

    /**
     * With no filter active, currentEntries is initially equal to the complete data set.
     */
    totalData = randomRepository.getData(dataSize);
    currentEntries = totalData;

    /**
     * Applies a given filter to totalData and caches the result in currentEntries.
     * @param {Filter} filter
     * @return Array<Entry>
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
     * Fetches an array of  data entries.
     * Applies the received filter to the data set and returns the entries
     * ranging from startIndex to endIndex from that filtered subset.
     * The 2nd return value is length of the filtered subset.
     * The 3rd return value is the length of the original, unfiltered data.
     * All 3 values must be returned as an Array of promises.
     * @param {Filter} filter
     * @param {Number} startIndex
     * @param {Number} endIndex
     * @returns PromiseConstructor
     */
    const getDataWithFilter = (filter, startIndex, endIndex) => {

        const filteredData = applyFilter(filter);
        const filteredDataSubset = (filteredData.length < endIndex + 1) ? filteredData : filteredData.slice(startIndex, endIndex);

        const filteredDataSubsetPromise     = new Promise((resolve) => setTimeout(() => resolve(filteredDataSubset),  SIMULATED_FETCH_DELAY));
        const filteredDataSubsetSizePromise = new Promise((resolve) => setTimeout(() => resolve(filteredData.length), SIMULATED_FETCH_DELAY));
        const totalDataSizePromise          = new Promise((resolve) => setTimeout(() => resolve(totalData.length),    SIMULATED_FETCH_DELAY));

        return Promise.all([filteredDataSubsetPromise, filteredDataSubsetSizePromise, totalDataSizePromise]);
    }

    /**
     * Fetches a single data entry.
     * Applies the received filter to the data set and returns the entry
     * with the given index from that filtered subset.
     * @param {Filter} filter
     * @param {Number} index
     * @return {Promise<Entry>}
     */
    const getSingleDataEntry = (filter, index) => {
        return new Promise((resolve) => setTimeout(() => resolve(currentEntries[index]), SIMULATED_FETCH_DELAY));
    }

    return {
        getDataWithFilter,
        getSingleDataEntry,
    }
}