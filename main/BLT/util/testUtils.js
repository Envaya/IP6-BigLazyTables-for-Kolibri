import {Observable} from "../../../kolibri/observable.js";
import {localEntries} from "../../demo_implementations/repositories/localRepository.js";

export {getTableConfig, stubModel, noService}

/**
 * Mock: tableConfig Object
 */
const getTableConfig = () => {
    return {
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
            columnWidths: [100, 240, 350, 350, 240, 240]
        },
        testing: {
            SIMULATED_FETCH_DELAY: 150,
        }
    }
}

/**
 * Stub: presentation Model
 */
const stubModel = () => {
    const filter    = Observable( getTableConfig().app.filterObj);
    const entryKeys = ['id', 'name', 'email', 'address', 'region', 'country'];
    let data = localEntries;

    return {
        getFilter:          filter.getValue,
        setFilter:          filter.setValue,
        onFilterChanged:    _ => _,
        getItemIndex:       _ => _,

        setData:            value => data = value,
        getData:            _ => data,
        initData:           _ => _,
        getSingleDataEntry:       _ => _,
        setDataEntry:       _ => _,
        deleteDataEntry:    _ => _,
        hasDataEntry:       _ => _,
        onDataEntryClear:   _ => _,
        getDataSize:        _ => data.length,
        onDataInit:         _ => _,
        onDataChanged:      _ => _,
        hasEntry:           _ => _,

        setPostfillInitialHeight:     _ => _,
        getPostfillInitialHeight:     _ => _,

        setItemIndex:                 _ => _,
        onItemIndexChanged:           _ => _,

        getScrollTop:                 _ => _,
        setScrollTop:                 _ => _,
        onScrollTopChanged:           _ => _,

        getPrefillHeight:             _ => _,
        setPrefillHeight:             _ => _,
        onPrefillHeightChanged:       _ => _,

        getPostfillHeight:            _ => _,
        setPostfillHeight:            _ => _,
        onPostfillHeightChanged:      _ => _,

        getViewPortHeight:            _ => _,
        setViewPortHeight:            _ => _,
        onViewPortHeightChanged:      _ => _,

        getRowHeight:                 _ => _,
        setRowHeight:                 _ => _,
        onRowHeightChanged:           _ => _,

        getNumberOfRenderedRows:      _ => _,
        setNumberOfRenderedRows:      _ => _,
        onNumberOfRenderedRowsChanged:_ => _,

        getNumberOfVisibleRows:       _ => 8,
        setNumberOfVisibleRows:       _ => _,
        onNumberOfVisibleRowsChanged: _ => _,

        setTotalDataSize:             _ => _,
        getTotalDataSize:             _ => _,

        getColumnWidths:              _ => _,
        setColumnWidths:              _ => _,
        onColumnWidthsChanged:        _ => _,

        getEntryKeys:                 () => entryKeys,
        setEntryKeys:                 _ => _,
        onEntryKeysChanged:           _ => _
    };
};

/**
 * Stub: service with no dataset
 */
const noService = () => {
    let currentEntries = [];

    const SIMULATED_FETCH_DELAY = 100;

    // set initial data
    const totalData = [];

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
        if (filteredData.length < endIndex + 1) {
            const filteredDataPromise     = new Promise((resolve) => setTimeout(() => resolve(filteredData), SIMULATED_FETCH_DELAY));
            const filteredDataSizePromise = new Promise((resolve) => setTimeout(() => resolve(filteredData.length), SIMULATED_FETCH_DELAY));

            return Promise.all([filteredDataPromise, filteredDataSizePromise]);
        }
        let filteredDataSubset = filteredData.slice(startIndex, endIndex);

        const filteredDataSubsetPromise     = new Promise((resolve) => setTimeout(() => resolve(filteredDataSubset), SIMULATED_FETCH_DELAY));
        const filteredDataSubsetSizePromise = new Promise((resolve) => setTimeout(() => resolve(filteredData.length), SIMULATED_FETCH_DELAY));

        return Promise.all([filteredDataSubsetPromise, filteredDataSubsetSizePromise]);
    }

    const getSingleDataEntry = (index) => {
        return new Promise((resolve) => setTimeout(() => resolve(currentEntries[index]), SIMULATED_FETCH_DELAY));
    }

    return {
        getDataWithFilter,
        getSingleDataEntry,
        getData:            () => new Promise((resolve) => setTimeout(() => resolve(currentEntries), SIMULATED_FETCH_DELAY)),
        getTotalDataSize:   () => currentEntries.length
    }
}