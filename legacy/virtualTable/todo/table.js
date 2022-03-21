import { ObservableList }           from "../observable/observable.js";
import { Attribute, VALUE }  from "../presentationModel/presentationModel.js";
import { rowProjector }        from "./rowProjector.js";
import { Scheduler }                from "../dataflow/dataflow.js";
import { fortuneService }           from "./fortuneService.js";

export { TableController, TableView, TableTotalView}

const TableController = () => {
    const Row = () => {
        const textAttr = Attribute("text");// facade
        return {
            getText:            textAttr.getObs(VALUE).getValue,
            setText:            textAttr.setConvertedValue,
            onTextChanged:      textAttr.getObs(VALUE).onChange,
            // onTextValidChanged: textAttr.getObs(VALID).onChange,
            onTextEditableChanged: textAttr.getObs("EDITABLE").onChange,
        }
    };

    const tableModel = ObservableList([]); // observable array of Rows, this state is private
    const scheduler = Scheduler();

    const addRow = () => {
        const newRow = Row();
        tableModel.add(newRow);
        return newRow;
    };

    const addFortuneRow = () => {
        const newRow = Row();
        tableModel.add(newRow);
        newRow.setText('...');
        scheduler.add( ok =>
           fortuneService( text => {
                   newRow.setText(text);
                   ok();
               }
           )
        );
    };

    return {
        numberOfRows:      tableModel.count,
        // numberOfOpenTasks:  () => tableModel.countIf( row => ! row.getDone() ), // not needed for now(nik)
        addRow:            addRow,
        addFortuneRow:     addFortuneRow,
        removeRow:         tableModel.del,
        onRowAdd:          tableModel.onAdd,
        onRowRemove:       tableModel.onDel,
        // removeRowRemoveListener: tableModel.removeDeleteListener,
    }
};


// View-specific parts

const TableView = (tableController, rootElement) => {

    const render = row =>
        rowProjector(tableController, rootElement, row);

    // binding

  tableController.onRowAdd(render);

    // we do not expose anything as the view is totally passive.
};

const TableTotalView = (tableController, numberOfTasksElement) => {

    const render = () =>
        numberOfTasksElement.innerText = "" + tableController.numberOfRows();

    // binding

    tableController.removeRow(render);
    tableController.onRowRemove(render);
};