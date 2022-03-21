import { TableController }        from "./table/tableController.js";
import { inputBox }               from "./inputBox/inputBox.js";
import { outputBox }              from "./OutputBox/outputBox.js";
import { TablePresentationModel } from "./table/tablePresentationModel.js";
import { TableHeadersProjector }  from "./table/tableHeaders/tableHeadersProjector.js";
import { FiltersProjector }       from "./table/tableFilters/filtersProjector.js";
import { TableBodyProjector }     from "./table/tableBody/tableBodyProjector.js";
import {TableFooterProjector}     from "./table/tableBody/tableFooterProjector.js";
import {testService}              from "./table/service/testService.js";
import {tableConfig}              from "./config.js";

/**
 * Define which services are used.
 */
const service           = testService();
const presentationModel = TablePresentationModel(tableConfig);
const tableController   = TableController(presentationModel, service);

/**
 * Initialize data...
 */
tableController.init();

/**
 * Initialize HTML rootElement.
 */
const rootElement = document.getElementById('table');

/**
 * Initialize table View.
 */
TableHeadersProjector(tableController, rootElement);
FiltersProjector     (tableController, rootElement);
TableBodyProjector   (tableController, rootElement);
TableFooterProjector (tableController, rootElement);

/**
 * Initialize separate views.
 */
inputBox (tableController);
outputBox(tableController);