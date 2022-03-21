
export { rowProjector }

const rowTextProjector = row => {

    let rowElement = document.createElement('td');
    rowElement.type = "text";
    rowElement.size = 42;

    rowElement.oninput = _ => row.setText(rowElement.value);

    row.onTextChanged(_ => rowElement.value = row.getText());

    row.onTextEditableChanged(
        isEditable => isEditable
        ? rowElement.removeAttribute("readonly")
        : rowElement.setAttribute("readonly", true));

    return rowElement;
};

// const todoDoneProjector = todo => {
//
//     const checkboxElement = document.createElement("INPUT");
//     checkboxElement.type = "checkbox";
//
//     checkboxElement.onclick = _ => todo.setDone(checkboxElement.checked);
//
//     todo.onDoneChanged(
//         done => done
//         ? checkboxElement.setAttribute("checked", true)
//         : checkboxElement.removeAttribute("checked")
//     );
//
//     return checkboxElement;
// };

const rowProjector = (tableController, rootElement, row) => {
    let rowElementContainer = document.createElement('tr');
    let deleteButtonCell = document.createElement('td');
    const deleteButton      = document.createElement("Button");
    deleteButton.setAttribute("class","delete");
    deleteButton.innerHTML  = "&times;";
    deleteButton.onclick    = _ => tableController.removeRow(row);

    deleteButtonCell.appendChild(deleteButton);
    const textCell      = rowTextProjector(row);
    // const checkboxElement   = todoDoneProjector(todo);

    rowElementContainer.appendChild(textCell);
    rowElementContainer.appendChild(deleteButtonCell);

    tableController.onRowRemove( (removeRow, removeMe) => {
        if (removeRow !== row) return;
        rootElement.removeChild(rowElementContainer);
        removeMe();
    } );

    rootElement.appendChild(rowElementContainer);
};
