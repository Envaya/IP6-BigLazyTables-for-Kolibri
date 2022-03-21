const numberOfRenderedRows = 30; //number of rows in order to use the table in a user-friendly manner (depends on data)

const buildTable = numberOfPropertiesPerEntry => {
    //generate main parts
    const table              = document.querySelector(".table");
    const horizontalScroller = document.createElement("div");
    const tableHeaders       = document.createElement("div");
    const filters            = document.createElement("div");
    const scroller           = document.createElement("div");

    tableHeaders        .setAttribute("id", "table-headers");
    horizontalScroller  .setAttribute("id", "horizontal-scroller");
    filters             .setAttribute("id", "filters");
    scroller            .setAttribute("id", "scroller");

    table.appendChild(horizontalScroller);
    horizontalScroller.appendChild(tableHeaders);
    horizontalScroller.appendChild(filters);
    horizontalScroller.appendChild(scroller);

    //tableHeaders specifics
    const generateTableHeaders = () => {
        //generate as many tableHeader as an entry has properties
        for (let i = 0; i < numberOfPropertiesPerEntry; i++){
            const tableHeader = document.createElement('th');
            tableHeader.setAttribute("id", `th-in-column${i}`);
            tableHeader.textContent = `TH ${i}`;
            tableHeaders.appendChild(tableHeader);
        }
    };
    generateTableHeaders();

    //filters specifics
    const generateFilterInputFields = () => {
        //generate as many inputFields as an entry has properties
        for (let i = 0; i < numberOfPropertiesPerEntry; i++){
            const filterInputField = document.createElement('input');
            filterInputField.setAttribute("class", "filterInputField");
            filterInputField.setAttribute("id", `filterInputField-in-column${i}`);
            filterInputField.placeholder = `Filter by ${i}`;
            filters.appendChild(filterInputField);
        }
    };
    generateFilterInputFields();


    //scroller specifics
    const prefill  = document.createElement("div");
    prefill .setAttribute("id", "prefill");
    scroller.appendChild(prefill);

    const generateCells = () => {
        //generate as many cells as an entry has properties
        for (let i = 0; i < numberOfRenderedRows; i++){
            const row = document.createElement("table");
            scroller.appendChild(row);
            for (let j = 0; j < numberOfPropertiesPerEntry; j++){
                const cell = document.createElement('td');
                cell.setAttribute("class", `cell-in-row${i}`);
                cell.setAttribute("class", `cell-in-column${j}`);
                cell.textContent = "Cell " + j + " : " + i; //in updateTableContent()
                row.appendChild(cell)
            }
        }
    };
    generateCells();

    const postfill = document.createElement("div");
    postfill.setAttribute("id", "postfill");
    scroller.appendChild(postfill);
}

buildTable(9);






//just for demonstration, does not need to be included in BLT
const columnNumberInputField = document.querySelector('#columnNumberInputField');

columnNumberInputField.addEventListener("keyup", query => {
    deleteTable();
    buildTable(query.target.value);
});

const deleteTable = () => {
    const table              = document.querySelector(".table");
    const horizontalScroller = document.querySelector("#horizontal-scroller");
    const tableHeaders       = document.querySelector("#table-headers");
    const filters            = document.querySelector("#filters");
    const scroller           = document.querySelector("#scroller");

    table.removeChild(horizontalScroller);
    horizontalScroller.removeChild(tableHeaders);
    horizontalScroller.removeChild(filters);
    horizontalScroller.removeChild(scroller);
}