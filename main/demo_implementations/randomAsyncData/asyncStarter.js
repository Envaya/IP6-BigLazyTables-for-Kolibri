import { asyncRandomService } from "./asyncRandomService.js";
import { TableController }  from "../../BLT/table/tableController.js";
import { inputBox }         from "../../BLT/inputBox/inputBox.js";
import { outputBox }        from "../../BLT/OutputBox/outputBox.js";
import { TablePresentationModel } from "../../BLT/table/tablePresentationModel.js";
import {TableHeadersProjector} from "../../BLT/table/tableHeaders/tableHeadersProjector.js";
import {FiltersProjector} from "../../BLT/table/tableFilters/filtersProjector.js";
import {TableBodyProjector} from "../../BLT/table/tableBody/tableBodyProjector.js";
import {TableFooterProjector} from "../../BLT/table/tableBody/tableFooterProjector.js";
import {tableConfig} from "./asyncRandomConfig.js";

/**
 * Initialize service, model and controller.
 */
const services          = asyncRandomService(100);
const presentationModel = TablePresentationModel(tableConfig);
const tableController   = TableController(presentationModel, services);

tableController.init();

/**
 * Fetching the DOM element for hosting the table.
 */
const rootElement = document.getElementById('table');

/**
 * Initializing the views.
 */
TableHeadersProjector(tableController, rootElement);
FiltersProjector     (tableController, rootElement);
TableBodyProjector   (tableController, rootElement);
TableFooterProjector (tableController, rootElement);

/**
 * Initializing separate views for development and demonstration purposes.
 */
inputBox (tableController);
outputBox(tableController);