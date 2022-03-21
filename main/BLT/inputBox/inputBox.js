import {domElement} from "../util/util.mjs";

export { inputBox }

/**
 * Component to test the mvc structure (active).
 */
const inputBox = mainController => {

    //View
    const inputBoxContainer = document.getElementById("input-box");

    const scrollToItemIndexButton    = domElement("button");
    const filterTestInputField       = domElement("input");
    const incrementRenderedTableRows = domElement("button");
    const sortButton                 = domElement("button");
    const colWidthChanger            = domElement("input");

    scrollToItemIndexButton.textContent    = "Scroll to ItemIndex 42";
    filterTestInputField.placeholder       = "Filter by name";
    incrementRenderedTableRows.textContent = "Increase visible Rows (WIP)";
    sortButton.textContent                 = "Sort column 3 asc";
    colWidthChanger.placeholder            = "Change ColWidth of Col1";

    inputBoxContainer.appendChild(scrollToItemIndexButton);
    inputBoxContainer.appendChild(filterTestInputField);
    inputBoxContainer.appendChild(incrementRenderedTableRows);
    inputBoxContainer.appendChild(sortButton);
    inputBoxContainer.appendChild(colWidthChanger);

    scrollToItemIndexButton.onclick = () => {
        mainController.updateItemIndex(42);
    }

    incrementRenderedTableRows.onclick = () => {
        mainController.setNumberOfVisibleRows(mainController.getNumberOfVisibleRows() + 1);
    }

    filterTestInputField.addEventListener("keyup", _ => {
        mainController.setColumnFilter(1, filterTestInputField.value);
    });

    sortButton.onclick = () => {
        mainController.setColumnSorter(3, "asc");
    }
    
    colWidthChanger.addEventListener("keyup", _ => {
        mainController.setColumnWidths(1, colWidthChanger.value);
    });
}
