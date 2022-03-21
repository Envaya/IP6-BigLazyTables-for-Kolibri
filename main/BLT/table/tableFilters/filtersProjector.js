import {domElement} from "../../util/util.mjs";

export { FiltersProjector };

/**
 * Projector for the table filter elements.
 * @param tableController
 * @param rootElement
 */
const FiltersProjector = (tableController, rootElement) => {

    const filters   = domElement("div", null, null, "filters");
    const filterRow = domElement("div", null, null, "filter-row");

    /**
     * Creates all filterInputFields.
     */
    const buildFilters = () => {

        const existingFiltersElement = rootElement.querySelector('.filters');

        if (null !== existingFiltersElement) {
            existingFiltersElement.querySelectorAll('*').forEach(n => n.remove());
        } else rootElement.appendChild(filters);

        filters.appendChild(filterRow);

        for (let columnIndex = 0; columnIndex < tableController.getKeysLength(); columnIndex++) {
            const filterCell       = domElement("div",   null, null, "filter-cell", `filter-cell${columnIndex}`);
            const filterInputField = domElement("input", null, null, "filter-input-field", `filter${columnIndex}`);
            filterCell.appendChild(filterInputField)
            filterRow.appendChild(filterCell);
            filterCell      .style.minWidth = "50px";
            filterInputField.style.minWidth = "50px";
        }
    }

    /**
     * Fills filter input fields with initial content.
     */
    const initFilterInputContent = () => {
        const filterInputFields = rootElement.querySelectorAll('.filter-input-field');

        let columnIndex = 0;
        for (const inputField of filterInputFields) {
            inputField.placeholder = "Filter by " + tableController.getEntryKeys()[columnIndex++];
        }
    }

    /**
     * Filtering listener.
     */
    const initFilterListeners = () => {
        for (let columnIndex = 0; columnIndex < tableController.getKeysLength(); columnIndex++){
            const filterInputFields = rootElement.getElementsByClassName(`filter${columnIndex}`);
            for (const filterInputField of filterInputFields){
                filterInputField.addEventListener("keyup", _ => {
                    tableController.setColumnFilter(columnIndex, filterInputField.value);
                });
            }
        }
    }

    /**
     * Updates the columnWidths of the filterInputFields.
     */
    const updateFilterColumnWidths = () => {
        for (let columnIndex = 0; columnIndex < tableController.getKeysLength(); columnIndex++){
            const filterCells = rootElement.getElementsByClassName(`filter-cell${columnIndex}`);
            for (const filterCell of filterCells){
                filterCell.style.width    = tableController.getColumnWidths()[columnIndex];
                filterCell.style.maxWidth = tableController.getColumnWidths()[columnIndex];
            }

            const filterInputFields = rootElement.getElementsByClassName(`filter${columnIndex}`);
            for (const filterInputField of filterInputFields){
                filterInputField.style.width    = tableController.getColumnWidths()[columnIndex];
                filterInputField.style.maxWidth = tableController.getColumnWidths()[columnIndex];
            }
        }
    }

    tableController.onColumnWidthsChanged(() => {
        updateFilterColumnWidths();
    });

    tableController.onEntryKeysChanged(() => {
        buildFilters();
        initFilterInputContent();
        updateFilterColumnWidths();
        initFilterListeners();
    });
}