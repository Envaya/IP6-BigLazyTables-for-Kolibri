import {Observable} from "../../../kolibri/observable.js";
import { ObservableMap } from "../util/util.mjs";

export { TablePresentationModel };

/**
 * Create {@link TablePresentationModel}.
 * @param {TableConfig} tableConfig
 * @returns {TablePresentationModel}
 */
const TablePresentationModel = tableConfig => {

    const data = ObservableMap(new Map())

    const filter = Observable(tableConfig.app.filterObj);

    const totalDataSize      = Observable(0);
    const currentDataSetSize = Observable(0);

    const itemIndex = Observable(0);

    let postfillInitialHeight = 0;

    //scrolling
    const scrollTop            = Observable(0);
    const prefillHeight        = Observable(0);
    const postfillHeight       = Observable(0);

    //Table View specs
    const viewPortHeight       = Observable(0);
    const rowHeight            = Observable(tableConfig.app.rowHeight);
    const numberOfVisibleRow   = Observable(tableConfig.app.nrVisibleRows);
    const numberOfRenderedRows = Observable(tableConfig.app.nrVisibleRows + 1);
    const columnWidths         = Observable(tableConfig.app.columnWidths);
    const entryKeys            = Observable([]);

    return {
        initData:            data.init,
        getSingleDataEntry:        data.getItem,
        getData:             data.get,
        setDataEntry:        data.add,
        deleteDataEntry:     data.del,
        hasDataEntry:        data.has,
        onDataEntryClear:    data.onClear,
        getDataSize:         data.size,
        onDataInit:          data.onInit,
        onDataChanged:       data.onChange,
        hasEntry:            data.has,

        setPostfillInitialHeight:      height => postfillInitialHeight = height,
        getPostfillInitialHeight:      () => postfillInitialHeight,

        getFilter:                     filter.getValue,
        setFilter:                     filter.setValue,
        onFilterChanged:               filter.onChange,

        getItemIndex:                  itemIndex.getValue,
        setItemIndex:                  itemIndex.setValue,
        onItemIndexChanged:            itemIndex.onChange,

        getScrollTop:                  scrollTop.getValue,
        setScrollTop:                  scrollTop.setValue,
        onScrollTopChanged:            scrollTop.onChange,

        getPrefillHeight:              prefillHeight.getValue,
        setPrefillHeight:              prefillHeight.setValue,
        onPrefillHeightChanged:        prefillHeight.onChange,

        getPostfillHeight:             postfillHeight.getValue,
        setPostfillHeight:             postfillHeight.setValue,
        onPostfillHeightChanged:       postfillHeight.onChange,

        getViewPortHeight:             viewPortHeight.getValue,
        setViewPortHeight:             viewPortHeight.setValue,
        onViewPortHeightChanged:       viewPortHeight.onChange,

        getRowHeight:                  rowHeight.getValue,
        setRowHeight:                  rowHeight.setValue,
        onRowHeightChanged:            rowHeight.onChange,

        getNumberOfRenderedRows:       numberOfRenderedRows.getValue,
        setNumberOfRenderedRows:       numberOfRenderedRows.setValue,
        onNumberOfRenderedRowsChanged: numberOfRenderedRows.onChange,

        getNumberOfVisibleRows:       numberOfVisibleRow.getValue,
        setNumberOfVisibleRows:       numberOfVisibleRow.setValue,
        onNumberOfVisibleRowsChanged: numberOfVisibleRow.onChange,

        setTotalDataSize:              totalDataSize.setValue,
        getTotalDataSize:              totalDataSize.getValue,

        setCurrentDataSetSize:         currentDataSetSize.setValue,
        getCurrentDataSetSize:         currentDataSetSize.getValue,

        getColumnWidths:               columnWidths.getValue,
        setColumnWidths:               columnWidths.setValue,
        onColumnWidthsChanged:         columnWidths.onChange,

        getEntryKeys:                   entryKeys.getValue,
        setEntryKeys:                   entryKeys.setValue,
        onEntryKeysChanged:             entryKeys.onChange
    }
}