import {asyncTest, TestSuite}   from "../../../kolibri/util/test.js";
import {TableController}        from "./tableController.js";
import {testService}            from "./service/testService.js";
import {TablePresentationModel} from "./tablePresentationModel.js";
import {sleep}                  from "../util/util.mjs";
import {getTableConfig, stubModel} from "../util/testUtils.js";
import {tableConfig}            from "../config.js";


const tableControllerSuite = TestSuite("tableController");


/**
 * Unit Test: setColumnFilter & setColumnSorter.
 */
tableControllerSuite.add("filter-object-management", assert => {

    //given
    const service     = testService();
    const model       = stubModel();
    const tableController = TableController(model, service);

    //when
    tableController.setColumnFilter(1, "John");

    //then
    assert.is(model.getFilter().ColumnFilters[1], "john");

    //when
    tableController.setColumnSorter(1, "asc");

    //then
    assert.is(model.getFilter().ColumnSorter.column,1);
    assert.is(model.getFilter().ColumnSorter.state, "asc");

    //when
    tableController.setColumnFilter(5, "United");

    //then
    assert.is(model.getFilter().ColumnFilters[1],   "john");
    assert.is(model.getFilter().ColumnFilters[5],   "united");
    assert.is(model.getFilter().ColumnSorter.column,1);
    assert.is(model.getFilter().ColumnSorter.state, "asc");

    /**
     * Illegal values: filter.
     */
    //when
    tableController.setColumnFilter(-5, "minus");

    //then
    assert.is(model.getFilter().ColumnFilters[-5], undefined);

    //when
    tableController.setColumnFilter(500, "overKeysLength");

    //then
    assert.is(model.getFilter().ColumnFilters[500], undefined);
    assert.is(model.getFilter().ColumnFilters.length, 6);

    /**
     * Illegal values: sorter.
     */
    //when
    tableController.setColumnSorter(-1, "asc");

    //then
    assert.is(model.getFilter().ColumnSorter.column, 0);

    //when
    tableController.setColumnSorter(500, "asc");

    //then
    assert.is(model.getFilter().ColumnSorter.column, 0);

    //when
    tableController.setColumnSorter(1, "undefinedState");

    //then
    assert.is(model.getFilter().ColumnSorter.state, "");
});

/**
 * Async Unit Test: getEntryByIndexAndKey.
 */
asyncTest("getEntryByIndexAndKey (async)", async assert => {

    //given
    const service         = testService();
    const model           = TablePresentationModel(getTableConfig());
    const tableController = TableController(model, service);
    tableController.init();

    /**
     * ItemIndex test.
     */
    //when
    await sleep(tableConfig.testing.TEST_FETCH_DELAY);
    const cell1Content            = tableController.getEntryValueByIndexAndKey(1,1);
    const cell2Content            = tableController.getEntryValueByIndexAndKey(1,4);
    const minusIndexValue         = tableController.getEntryValueByIndexAndKey(-10,1);
    const higherThanEntriesLength = tableController.getEntryValueByIndexAndKey(1500,1);

    //then
    assert.is(cell1Content,            "Grant Dawson");
    assert.is(cell2Content,            "Khyber Pakhtoonkhwa");
    //getEntryValueByIndexAndKey() should return nothing
    assert.is(minusIndexValue,         "");
    assert.is(higherThanEntriesLength, "");

    /**
     * ColumnIndex test.
     */
    //when
    const minusColumnValue     = tableController.getEntryValueByIndexAndKey(1,-5);
    const higherThanKeysLength = tableController.getEntryValueByIndexAndKey(1,15);
    const nan                  = tableController.getEntryValueByIndexAndKey(1,"asdf");

    //then
    assert.is(minusColumnValue,     "");
    assert.is(higherThanKeysLength, "");
    assert.is(nan,                  "");
});

/**
 * Unit Test: ItemIndex gets changed (from anywhere).
 * @use-case:
 * User or function wants to jump to a specific row in the table.
 */
tableControllerSuite.add("ItemIndex-management", assert => {

    //given
    const service           = testService();
    const presentationModel = TablePresentationModel(getTableConfig());
    const tableController   = TableController(presentationModel, service);

    /**
     * Legal ItemIndex
     */
    //when
    tableController.updateItemIndex(42);

    //then
    assert.is(tableController.getItemIndex(), 42);
    assert.is(tableController.getScrollTop(), 2520);

    /**
     * ItemIndex is a Double Value
     */
    //when
    tableController.updateItemIndex(10.3);

    //then
    assert.is(tableController.getItemIndex(), 10);
    assert.is(tableController.getScrollTop(), 600);

    //when
    tableController.updateItemIndex(9.945);

    //then
    assert.is(presentationModel.getItemIndex(), 10);
    assert.is(presentationModel.getScrollTop(), 600);

    /**
     * ItemIndex < 0
     */
    //when
    tableController.updateItemIndex(-5);

    //then
    assert.is(presentationModel.getItemIndex(), 0);
    assert.is(presentationModel.getScrollTop(), 0);

    /**
     * ItemIndex != Number
     */
    //when
    tableController.updateItemIndex("asdf");

    //then
    assert.is(presentationModel.getItemIndex(), 0);
    assert.is(presentationModel.getScrollTop(), 0);
});

/**
 * Async Unit Test: ItemIndex is set to value bigger than totalData.
 */
asyncTest("ItemIndex > entries.length (async)", async assert => {

    //given
    const service           = testService();
    const presentationModel = TablePresentationModel(getTableConfig());
    const tableController   = TableController(presentationModel, service);
    tableController.init();

    await sleep(tableConfig.testing.TEST_FETCH_DELAY);
    /**
     * ItemIndex > entries.length
     */
    //when
    tableController.updateItemIndex(150);

    //then
    assert.is(presentationModel.getItemIndex(), 0);
    assert.is(presentationModel.getScrollTop(), 0);
});

/**
 * Unit Test: ColumnWidth of target column gets changed (from anywhere).
 * @use-case:
 * User or function changes target columnWidth.
 */
tableControllerSuite.add("columnWidth-management", assert => {

    //given
    const service           = testService();
    const presentationModel = TablePresentationModel(getTableConfig());
    const tableController   = TableController(presentationModel, service);

    //then
    assert.is(presentationModel.getColumnWidths()[1], 240);
    assert.is(presentationModel.getColumnWidths()[2], 350);

    //when
    tableController.setColumnWidths(1, 200);
    //then
    assert.is(presentationModel.getColumnWidths()[1], 200);
    assert.is(presentationModel.getColumnWidths()[2], 390);

    //when
    tableController.setColumnWidths(1, 300);
    //then
    assert.is(presentationModel.getColumnWidths()[1], 300);
    assert.is(presentationModel.getColumnWidths()[2], 290);
});

/**
 * Unit Test: Get correct count of rendered rows.
 */
tableControllerSuite.add("get-rendered-rows-count", assert => {

    //given
    const service         = testService();
    const model           = stubModel();
    const tableController = TableController(model, service);

    //then
    assert.is(tableController.getRenderedRowsCount(), 8);

    //when
    model.setData([{
        id: 0,
        name: "Charity Freeman",
        email: "maecenas@outlook.edu",
        address: "P.O. Box 129, 2221 Molestie Avenue",
        region: "Upper Austria",
        country: "United Kingdom"
    }]);

    //then
    assert.is(tableController.getRenderedRowsCount(), 1);
});

tableControllerSuite.run();