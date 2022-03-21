import {domElement} from "../../util/util.mjs";

export { TableBodyProjector };

/**
 * Projector for the table body elements.
 * @param tableController
 * @param rootElement
 */
const TableBodyProjector = (tableController, rootElement) => {

    const tableBody = domElement("div",null, 'table-body', "table-body");
    const prefill   = domElement("div",null, 'prefill');
    const postfill  = domElement("div", {height: tableController.getPostfillHeight() + 'px'}, "postfill");
    const tableRowList = [];

    /**
     * Creates table Body.
     */
    const buildTableBody = () => {
        const existingTableBodyElement = rootElement.querySelector('#table-body');

        if (null !== existingTableBodyElement) {
            while (existingTableBodyElement.firstChild) {
                existingTableBodyElement.removeChild(existingTableBodyElement.firstChild);
            }
        } else rootElement.appendChild(tableBody);

        tableBody.appendChild(prefill);

        const tableBodyFragment = document.createDocumentFragment();

        const generateRows = () => {
            for (let rowIndex = 0; rowIndex < tableController.getNumberOfRenderedRows(); rowIndex++) {

                const row = domElement("div", {overflow: "hidden"}, null, `table-row${rowIndex}`, "table-row");

                for (let columnIndex = 0; columnIndex < tableController.getKeysLength(); columnIndex++) {
                    let isLastRenderedRow = rowIndex === tableController.getNumberOfRenderedRows() - 1;
                    const cell = domElement("div", {height: (isLastRenderedRow ? tableController.getRowHeight() - 5 : tableController.getRowHeight()) + 'px'}, null, "table-cell", `cell${rowIndex}${columnIndex}`)
                    row.appendChild(cell);
                    // @TODO needs to be set by user via tableconfig
                    cell.style.minWidth = "50px";

                }

                tableBodyFragment.appendChild(row);
                tableRowList.push(row);
            }
            tableBody.appendChild(tableBodyFragment);
        }
        generateRows();

        tableBody.appendChild(postfill);

        updateTableBodyColWidths();
    }

    /**
     * Handler for visible rows count change.
     */
    tableController.onNumberOfRenderedRowsChanged(() => {
        // @TODO handle increasing rendered rows by one
        // update last item index
        // wait for service to return new data
        // increase viewport by (number of added rows) * rowheight
        // create row elements and add them to rows[]
        tableRowList.forEach(row => {
            row.style.height = tableController.getRowHeight() + 'px';
        });
        tableBody.style.height = tableController.getViewPortHeight() + 'px';
    });

    /**
     * Handler for viewport height change.
     */
    tableController.onViewPortHeightChanged(() => {
        tableRowList.forEach(row => {
            row.style.height = tableController.getViewPortHeight() + 'px';
        });
        tableBody.style.height = tableController.getViewPortHeight() + 'px';
    });

    /**
     * Redraws the view of everything related to the Scroller Viewport.
     */
    const updateScrollPosition = () => {
        updateTableFillSizes();
        tableBody.scrollTo({top: tableController.getScrollTop(), behavior:"instant"});
    }

    /**
     * Scrolls to the Top of the Table.
     */
    const scrollToTop = () => {
        const tableBody = rootElement.querySelector("#table-body");

        tableBody.scrollTo({
            top: 0
        });
    }

    /**
     * Fills table Body with updated content.
     */
    const updateTableBodyContent = () => {
        for (let rowIndex = 0; rowIndex < tableController.getNumberOfRenderedRows(); rowIndex++){
            updateSingleRowContent(rowIndex);
        }
    }

    const updateSingleRowContent = rowIndex => {
        const dataIndex     = tableController.getItemIndex() + rowIndex;
        const rowEle        = tableBody.getElementsByClassName(`table-row${rowIndex}`)[0];
        const dataAvailable = tableController.hasDataEntry(dataIndex);

        if (dataIndex < tableController.getCurrentDataSetSize()) {
            if (dataAvailable) {
                rowEle.classList.remove("loading");
            } else {
                rowEle.classList.add("loading");
            }
        }

        for (let columnIndex = 0; columnIndex < tableController.getKeysLength(); columnIndex++) {

            const cells = rootElement.getElementsByClassName(`cell${rowIndex}${columnIndex}`);

            for (let cell of cells) {
                cell.textContent = tableController.getEntryValueByIndexAndKey(tableController.getItemIndex() + rowIndex, columnIndex);
            }
        }
    }

    const updateTableFillSizes = () => {
        prefill .style.height = tableController.getPrefillHeight() + "px";
        postfill.style.height = tableController.getPostfillHeight() + "px";
    }

    /**
     * ...
     */
     // @TODO breaks on windows resize: add resize event to handle window resizing
     const updateTableBodyColWidths = () => {

         for (let rowIndex = 0; rowIndex < tableController.getNumberOfRenderedRows(); rowIndex++){
             for (let columnIndex = 0; columnIndex < tableController.getKeysLength(); columnIndex++){

                 const cells = rootElement.getElementsByClassName(`cell${rowIndex}${columnIndex}`);

                 for (let cell of cells){
                     cell.style.width    = tableController.getColumnWidths()[columnIndex];
                     cell.style.maxWidth = tableController.getColumnWidths()[columnIndex];
                 }
             }
         }
     }

    /**
     * All listeners relevant for Table Body.
     */

    const tableBodyListeners = () => {

        /**
         * Scroll Listener.
         */
        tableBody.addEventListener("scroll", _ => {
            tableController.scrollTopChangeHandler(tableBody.scrollTop);
        });

        /**
         * Updates table column widths.
         */
        tableController.onColumnWidthsChanged(() => {
            updateTableBodyColWidths();
        });

        /**
         * Updates table scroll position and content based on current itemIndex.
         */
        tableController.onItemIndexChanged(() => {
            updateScrollPosition();
            // @TODO should only update rows if the data entry exists, if the entry for that row does not exist, it is automatically updated via onNewDataChanged (controller must handle this check)
            updateTableBodyContent();
        });

        // @TODO we should rebuild tablebody when nr rendered rows changes
        // tableController.onNumberOfRenderedRowsChanged(() => buildTableBody());

        /**
         * Updates table-body content and properties when table data is reset.
         */
        tableController.onDataReset(() => {
            // @TODO buildTableBody might be unnecessary here (see todo above)
            buildTableBody();
            updateTableFillSizes();
            scrollToTop();
            updateTableBodyContent();
        });

        tableController.onDataChanged((dataIndex, _) => {
            const rowIndex = dataIndex - tableController.getItemIndex();
            if (rowIndex >= 0 && rowIndex <= tableController.getNumberOfRenderedRows() - 1) updateSingleRowContent(rowIndex);
        });
    }

    buildTableBody();
    //init call
    tableBodyListeners();
}