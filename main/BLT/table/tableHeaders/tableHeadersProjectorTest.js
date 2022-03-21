import {asyncTest}              from "../../../../kolibri/util/test.js";
import {TableHeadersProjector}  from "./tableHeadersProjector.js";
import {testService}            from "../service/testService.js";
import {TablePresentationModel} from "../tablePresentationModel.js";
import {TableController}        from "../tableController.js";
import {getTableConfig}         from "../../util/testUtils.js";
import {sleep}                  from "../../util/util.mjs";
import {tableConfig}            from "../../config.js";


/**
 *
 */
asyncTest("tableHeadersProjector-init (async)", async assert => {

    //given
    const service         = testService();
    const model           = TablePresentationModel(getTableConfig());
    const tableController = TableController(model, service);
    const rootElement     = document.createElement("div");
    tableController.init();

    //when
    await sleep(tableConfig.testing.TEST_FETCH_DELAY);
    TableHeadersProjector(tableController, rootElement);

    //then
    assert.is(rootElement.querySelectorAll(".table-header-cell")           .length, 6);
    assert.is(rootElement.querySelectorAll(".table-header-content-wrapper").length, 6);
    assert.is(rootElement.querySelectorAll(".sort-icon")                   .length, 6);
    assert.is(rootElement.querySelectorAll(".table-header-row")            .length, 1);

    assert.is(rootElement.querySelectorAll(".table-header-cell")[0].textContent, "id");
    assert.is(rootElement.querySelectorAll(".table-header-cell")[0].style.width, "100px");
});