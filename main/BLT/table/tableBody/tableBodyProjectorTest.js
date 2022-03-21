import {asyncTest}              from "../../../../kolibri/util/test.js";
import {testService}            from "../service/testService.js";
import {TablePresentationModel} from "../tablePresentationModel.js";
import {TableBodyProjector}     from "./tableBodyProjector.js";
import {TableFooterProjector}   from "./tableFooterProjector.js";
import {getTableConfig}         from "../../util/testUtils.js";
import {TableController}        from "../tableController.js";
import {sleep}                  from "../../util/util.mjs";
import {tableConfig}            from "../../config.js";


/**
 * Body
 */
asyncTest("tableBodyProjector-init (async)", async assert => {

    //given
    const service         = testService();
    const model           = TablePresentationModel(getTableConfig());
    const tableController = TableController(model, service);
    const rootElement     = document.createElement("div");
    tableController.init();

    //when
    await sleep(tableConfig.testing.TEST_FETCH_DELAY);
    TableBodyProjector(tableController, rootElement);

    //then
    assert.is(rootElement.querySelectorAll("#prefill")   .length, 1);
    assert.is(rootElement.querySelectorAll("#postfill")  .length, 1);
    assert.is(rootElement.querySelectorAll(".table-cell").length, 54);
    assert.is(rootElement.querySelectorAll(".table-row") .length, 9);

    assert.is(rootElement.querySelectorAll(".table-cell")[0].textContent, "0");
    assert.is(rootElement.querySelectorAll(".table-cell")[0].style.width, "100px");
});

/**
 * Footer
 */
asyncTest("tableFooterProjector-init (async)", async assert => {

    //given
    const service         = testService();
    const model           = TablePresentationModel(getTableConfig());
    const tableController = TableController(model, service);
    const rootElement     = document.createElement("div");

    //when
    await sleep(tableConfig.testing.TEST_FETCH_DELAY);
    TableFooterProjector(tableController, rootElement);

    //then
    assert.is(rootElement.querySelectorAll("#table-footer")   .length, 1);
    assert.is(rootElement.querySelectorAll("#entries-display").length, 1);
    //assert.is(rootElement.querySelector("#entries-display").textContent.localeCompare("( 1 - 8 / 100 )"), true);
});



