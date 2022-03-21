import {addThousandsSeparator, domElement} from "../../util/util.mjs";

export { TableFooterProjector };

/**
 * Projector for the table footer elements.
 * @param tableController
 * @param rootElement
 */
const TableFooterProjector = (tableController, rootElement) => {

    const footer         = domElement("div", null, "table-footer");
    const entriesDisplay = domElement("div", null, "entries-display");

    rootElement.appendChild(footer);
    footer     .appendChild(entriesDisplay);

    /**
     * Fills table footer with updated content.
     */
    const updateTableFooterContent = () => {

        if (tableController.getCurrentDataSetSize() <= 0){
            entriesDisplay.textContent = "( no entries found )";
        } else {
            entriesDisplay.textContent = `( 
                ${addThousandsSeparator(tableController.getItemIndex() + 1 )} - 
                ${addThousandsSeparator(tableController.getItemIndex() + (tableController.getItemIndex() === 0 ? tableController.getRenderedRowsCount() : tableController.getRenderedRowsCount() + 1))} / 
                ${addThousandsSeparator(tableController.getCurrentDataSetSize())}
                
            ) --- Total data size: ${addThousandsSeparator(tableController.getTotalDataSize())} `;
        }
    }

    /**
     * All listeners relevant for Table Footer.
     */
    const tableFooterListeners = () => {
        /**
         * Updates table footer content based on current itemIndex.
         */
        tableController.onItemIndexChanged(() => {
            updateTableFooterContent();
        });

        /**
         * Updates table footer content when data changes.
         */
        tableController.onDataReset(() => {
            updateTableFooterContent();
        });
    }

    //init call
    updateTableFooterContent();
    tableFooterListeners();
}