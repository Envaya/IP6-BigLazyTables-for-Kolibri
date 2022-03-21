
import {TableController, TableTotalView, TableView} from './table.js';

const tableController = TableController();

// binding of the main view

document.getElementById('plus').onclick    = _ => tableController.addRow();
document.getElementById('fortune').onclick = _ => tableController.addFortuneRow();

// create the sub-views, incl. binding

TableView(tableController, document.getElementById('tableContainer'));
TableTotalView(tableController, document.getElementById('numberOfRows'));

// init the model

tableController.addRow();
