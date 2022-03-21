import { isEqual, PositiveNumber, pxMapper } from "../util/util.mjs";

export { TableController };


const TableController = (presentationModel, service) => {

    let ignoreScrollEvent;
    let currentItemIndex;
    let dataInitListeners = [];
    let isInitialFilterChange = true;

    const getFilteredData = () => {
        const startIndex = presentationModel.getItemIndex();
        const endIndex   = startIndex + presentationModel.getNumberOfRenderedRows();
        service.getDataWithFilter(presentationModel.getFilter(), startIndex, endIndex)
            .then(promises => {
                const batchData          = promises[0];
                const currentDataSetSize = promises[1];
                const totalDataSize      = promises[2];

                presentationModel.setTotalDataSize(totalDataSize);
                presentationModel.setCurrentDataSetSize(currentDataSetSize);
                if (batchData.length > 0) {
                    if (!isEqual(Object.keys(batchData[0]), presentationModel.getEntryKeys())) presentationModel.setEntryKeys(Object.keys(batchData[0]));
                }
                presentationModel.initData(presentationModel.getItemIndex(), batchData);
            })
            .catch(e => console.error(`The following error occurred while updating table data: ${e.message}`));
    }

    const updateData = () => {
        const indexOfBottomMostRenderedRow = presentationModel.getItemIndex() + presentationModel.getNumberOfRenderedRows();
        for(let renderedRowIndex = presentationModel.getItemIndex();
            renderedRowIndex < indexOfBottomMostRenderedRow; renderedRowIndex++) {
            if (!presentationModel.hasEntry(renderedRowIndex) && renderedRowIndex < presentationModel.getCurrentDataSetSize()) {

                service.getSingleDataEntry(presentationModel.getFilter(), renderedRowIndex)
                    .then(data => presentationModel.setDataEntry(renderedRowIndex, data))
                    .catch(e => console.error(`The following error occurred while updating the data of a table row: ${e.message}`));
            }
        }
    }

    /**
     * Requests data from the service matching a new filter
     */
    presentationModel.onFilterChanged(() => {
        if (!isInitialFilterChange) getFilteredData();
        isInitialFilterChange = false;
    });

    /**
     * Updates dataModel with current filters.
     * @param {Number} columnIndex
     * @param {String} queryValue
     */
    const setColumnFilter = (columnIndex, queryValue) => {

        const newFilterObject = { ...presentationModel.getFilter() }; //create shallow copy to trigger onFilterChanged()

        //column handling
        if (columnIndex < 0 || columnIndex >= presentationModel.getEntryKeys().length) {
            console.warn(`received illegal columnIndex in setColumnFilter: ${columnIndex} -> filter does not change instead`);
            return;
        } else {
            newFilterObject.ColumnFilters[columnIndex] = queryValue.toString().toLowerCase();
        }

        //set new filter
        presentationModel.setFilter(newFilterObject);
    }

    /**
     * Updates dataModel with current sorting state.
     * @param {Number} columnIndex
     * @param {String} state
     */
    const setColumnSorter = (columnIndex, state) => {

        const newFilterObject = { ...presentationModel.getFilter() }; //create shallow copy to trigger onFilterChanged()

        //column handling
        if (columnIndex < 0 || columnIndex >= presentationModel.getEntryKeys().length) {
            console.warn(`received illegal columnIndex in setColumnSorter: ${columnIndex} -> was instead set to 0`);
            newFilterObject.ColumnSorter.column = 0;
        } else {
            newFilterObject.ColumnSorter.column = columnIndex;
        }

        //state handling
        if (state !== "desc" && state !== "asc") {
            console.warn(`received illegal state in setColumnSorter: ${state} -> was instead set to ""`);
            newFilterObject.ColumnSorter.state = "";
        } else {
            newFilterObject.ColumnSorter.state = state;
        }

        //set new filter
        presentationModel.setFilter(newFilterObject);
    }

    /**
     * getRenderedRowsCount.
     */
    const getRenderedRowsCount = () => {
        if (presentationModel.getDataSize() < presentationModel.getNumberOfVisibleRows()){
            return presentationModel.getDataSize();
        } else {
            return presentationModel.getNumberOfVisibleRows();
        }
    }

    /**
     * Returns one value of a single entry.
     * @param {number} itemIndex    Index of current entry.
     * @param {number} columnIndex  Index of current column.
     * @example
     * "Hans Muster"
     */
    const getEntryValueByIndexAndKey = (itemIndex, columnIndex) => {
        try {
            if(columnIndex < 0 || columnIndex > presentationModel.getEntryKeys().length || isNaN(columnIndex)){
                return "";
            }
            const key = presentationModel.getEntryKeys()[columnIndex];

            if (presentationModel.hasEntry(itemIndex)) {
                return presentationModel.getSingleDataEntry(itemIndex)[key];
            }
            return "";

        } catch (e) {
            console.warn(`Error in getEntryValueByIndexAndKey: ${e}`);
            return "";
        }
    }

    /**
     * Sets the width of target column and adjusts the column next to it.
     * @param {Number} columnIndex Index of target column.
     * @param {Number} columnWidth Width of target column.
     */
    const setColumnWidths = (columnIndex, columnWidth) => {
        const newColumnWidths = [ ...presentationModel.getColumnWidths() ];
        newColumnWidths[columnIndex] = columnWidth;
        newColumnWidths[columnIndex + 1] = presentationModel.getColumnWidths()[columnIndex + 1] + (presentationModel.getColumnWidths()[columnIndex] - columnWidth);
        presentationModel.setColumnWidths(newColumnWidths);
    }

    const setNumberOfRenderedRows = () => {
        if (presentationModel.getCurrentDataSetSize() <= presentationModel.getNumberOfVisibleRows()) {
            presentationModel.setNumberOfRenderedRows(presentationModel.getNumberOfVisibleRows());
        } else {
            presentationModel.setNumberOfRenderedRows(presentationModel.getNumberOfVisibleRows() + 1);
        }
    }

    const scrollTopChangeHandler = scrollTop => {
        presentationModel.setScrollTop(scrollTop);
        /**
         * assert that our use of scrollTo does not trigger our own scroll handler again.
         */
        if (ignoreScrollEvent) {
            return;
        }
        ignoreScrollEvent = true;

            /**
             * Calculate the itemIndex based on the current scroll position.
             * Cache the value locally to make sure it does not change while processing.
             * @example
             * (itemIndex) 3 = (scrollTop) 180 / (rowHeight) 60
             */
            const itemIndex = Math.floor(scrollTop / presentationModel.getRowHeight());

            /**
             * Skip updating the view if we haven't scrolled a full row height.
             */
            if (itemIndex === currentItemIndex) {
                ignoreScrollEvent = false;
                return;
            }

            currentItemIndex = itemIndex;

            updateItemIndex(itemIndex);

            ignoreScrollEvent = false;
    }

    const handleIllegalItemIndex = index => {
        /**
         * Error Handling of illegal itemIndex.
         *
         * ItemIndex is a Double Value
         */
        if (index % 1 !== 0) {
            console.warn("illegal itemIndex: " + index);
            index = Math.round(index);
        }

        /**
         * ItemIndex < 0 || ItemIndex != Number
         */
        if (index < 0 || isNaN(index)) {
            console.warn("illegal itemIndex: " + presentationModel.getItemIndex());
            index = 0;
        }

        if (presentationModel.getCurrentDataSetSize() > 0) {
            /**
             * ItemIndex > entries.length
             */
            //todo: needs to wait until data is in model and THEN change the index
            if (index >= presentationModel.getCurrentDataSetSize()) {
                console.warn("illegal itemIndex: " + index);
                index = 0;
            }
        }
        return index;
    }

    const updateItemIndex = (index, isExternalChange = false) => {
        index = handleIllegalItemIndex(index);

        /**
         * Set new ScrollTop when itemIndex changes from other than scrolling
         * i.e.: InputBox Button "Scroll to itemIndex 42"
         */
        if (isExternalChange) {
            const newScrollTop = Math.floor(index * presentationModel.getRowHeight());
            presentationModel.setScrollTop(newScrollTop);
        }

        /**
         * ...
         */
        const newPrefillHeight  = index * presentationModel.getRowHeight();
        const newPostfillHeight = presentationModel.getPostfillInitialHeight() - newPrefillHeight;

        presentationModel.setPrefillHeight(newPrefillHeight);
        presentationModel.setPostfillHeight(PositiveNumber(newPostfillHeight));
        presentationModel.setItemIndex(index);
        updateData();
    }

    // render one more row that there is space in the viewport
    // @TODO if number of visible rows is <= total data length, we dont render 1 additional row, otherwise one can scroll even if there are only 1-8 data entries
    presentationModel.onNumberOfVisibleRowsChanged(_ => {
        //setNumberOfRenderedRows();
        presentationModel.setViewPortHeight(presentationModel.getNumberOfVisibleRows() * presentationModel.getRowHeight());
    });

    // @TODO not fully implemented yet
    presentationModel.onRowHeightChanged(_ => {
        presentationModel.setNumberOfVisibleRows(Math.ceil(presentationModel.getViewPortHeight() / presentationModel.getRowHeight()));
    });

    const resetPostFillSize = () => {
        presentationModel.setPrefillHeight(0);
        presentationModel.setPostfillInitialHeight(
            PositiveNumber(presentationModel.getRowHeight() * presentationModel.getCurrentDataSetSize() -
                        presentationModel.getRowHeight() * presentationModel.getNumberOfRenderedRows())
        );
        presentationModel.setPostfillHeight(presentationModel.getPostfillInitialHeight());
    }

    presentationModel.onDataInit(_ => {
        handleIllegalItemIndex(presentationModel.getItemIndex());
        setNumberOfRenderedRows();
        resetPostFillSize();
        dataInitListeners.forEach(listener => listener(presentationModel.getPostfillHeight()));
    });

    const onDataReset = listener => {
        dataInitListeners.push(listener)
    }

    // fetch initial set of data
    const init = () => {
        getFilteredData();
    }

    return {
        init,
        setColumnFilter,
        setColumnSorter,
        getRenderedRowsCount,
        scrollTopChangeHandler,
        updateItemIndex:       index => updateItemIndex(index, true),

        // data getters
        getEntryKeys:          () => presentationModel.getEntryKeys(),
        getKeysLength:         () => presentationModel.getEntryKeys().length,
        onEntryKeysChanged:        presentationModel.onEntryKeysChanged,
        getEntryValueByIndexAndKey,
        getFilter:             () => presentationModel.getFilter(),
        onDataChanged:         presentationModel.onDataChanged,
        onFilterChanged:       presentationModel.onFilterChanged,
        hasDataEntry:          presentationModel.hasDataEntry,

        // view setters
        setPostfillInitialHeight:   value => presentationModel.setPostfillInitialHeight(value),
        setTotalDataSize:           value => presentationModel.setTotalDataSize        (value),
        setCurrentDataSetSize:      value => presentationModel.setCurrentDataSetSize   (value),
        setNewScrollPosition:       value => presentationModel.setNewScrollPosition    (value),
        setPrefillHeight:           value => presentationModel.setPrefillHeight        (value),
        setPostfillHeight:          value => presentationModel.setPostfillHeight       (value),
        setNumberOfVisibleRows:     value => presentationModel.setNumberOfVisibleRows  (value),

        // view getters
        getPostfillInitialHeight:() => presentationModel.getPostfillInitialHeight(),
        getItemIndex:            () => presentationModel.getItemIndex(),
        getNumberOfRenderedRows: () => presentationModel.getNumberOfRenderedRows(),
        getTotalDataSize:        () => presentationModel.getTotalDataSize(),
        getCurrentDataSetSize:   () => presentationModel.getCurrentDataSetSize(),
        getScrollTop:            () => presentationModel.getScrollTop(),
        getPostfillHeight:       () => presentationModel.getPostfillHeight(),
        getRowHeight:            () => presentationModel.getRowHeight(),
        getViewPortHeight:       () => presentationModel.getViewPortHeight(),
        getPrefillHeight:        () => presentationModel.getPrefillHeight(),
        getNewScrollPosition:    () => presentationModel.getNewScrollPosition(),
        getNumberOfVisibleRows:  () => presentationModel.getNumberOfVisibleRows(),
        onItemIndexChanged:            presentationModel.onItemIndexChanged,
        onNumberOfRenderedRowsChanged: presentationModel.onNumberOfRenderedRowsChanged,
        onViewPortHeightChanged:       presentationModel.onViewPortHeightChanged,
        onScrollTopChanged:            presentationModel.onScrollTopChanged,
        onNumberOfVisibleRowsChanged:  presentationModel.onNumberOfVisibleRowsChanged,
        onDataReset,

        setColumnWidths,
        getColumnWidths:               () => pxMapper(presentationModel.getColumnWidths()),
        onColumnWidthsChanged:         presentationModel.onColumnWidthsChanged
    }
}