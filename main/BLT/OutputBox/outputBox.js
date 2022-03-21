import {domElement} from "../util/util.mjs";

export {outputBox};

/**
 * Displays values from table.
 * Component to test the mvc structure (passive).
 */
const outputBox = tableController => {

    const outPutContainer = document.getElementById("output");
    const itemIndexOutput = domElement("div");
    const rowsOutput      = domElement("div");

    outPutContainer.appendChild(itemIndexOutput);
    outPutContainer.appendChild(rowsOutput);

    tableController.onItemIndexChanged(() => {
        itemIndexOutput.textContent = `
                 scrollTop:      ${tableController.getScrollTop()}
                 prefillHeight:  ${tableController.getPrefillHeight()}
                 itemIndex:      ${tableController.getItemIndex()}
                 `;
    });

    tableController.onNumberOfRenderedRowsChanged(() => {
        rowsOutput.textContent = `
                 nrOfVisibleRows    ${tableController.getNumberOfVisibleRows()}
                 `;
    });
}