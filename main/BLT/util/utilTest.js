import { isEqual, ObservableMap, PositiveNumber, RandomNumber, RandomString, pxMapper } from "./util.mjs";
import { TestSuite } from "../../../kolibri/util/test.js";

const utilSuite = TestSuite("util");

/**
 * Unit Tests for util.js
 */

utilSuite.add("methods under test: add, has, getItem", assert => {

    //given
    const obsMap = ObservableMap(new Map());

    //when
    obsMap.add(1234, { name: "test" });

    //then
    assert.is(obsMap.has(1234), true);
    assert.is(obsMap.getItem(1234).name, "test");

    //when
    obsMap.add(1234, { name: "another test" });
    assert.is(obsMap.getItem(1234).name, "another test");
});

utilSuite.add("initialising map with direct values", assert => {

    //given
    const obsMap = ObservableMap(new Map([[1,"one"],[2,"two"],[3,"three"]]));

    //then
    assert.is(obsMap.has(1), true);
    assert.is(obsMap.has(2), true);
    assert.is(obsMap.has(3), true);
    assert.is(obsMap.getItem(1), "one");
    assert.is(obsMap.getItem(2), "two");
    assert.is(obsMap.getItem(3), "three");
});

utilSuite.add("method under test: init", assert => {

    //given
    const obsMap = ObservableMap(new Map());
    const data  = ["one", "two", "three"];

    //when
    obsMap.init(1, data);

    //then
    assert.is(obsMap.has(1), true);
    assert.is(obsMap.has(2), true);
    assert.is(obsMap.has(3), true);
    assert.is(obsMap.getItem(1), "one");
    assert.is(obsMap.getItem(2), "two");
    assert.is(obsMap.getItem(3), "three");
});

utilSuite.add("method under test: onAdd", assert => {

    //given
    const obsMap = ObservableMap(new Map());
    let testKey = null;
    let testValue = null;
    obsMap.onAdd((key, value) => {
        testKey = key;
        testValue = value;
    });

    //when
    obsMap.add(2345, { name: "test" });

    //then
    assert.is(testKey, 2345);
    assert.is(testValue.name, "test");
});


utilSuite.add("method under test: del", assert => {

    //given
    const obsMap = ObservableMap(new Map([[1,"one"],[2,"two"],[3,"three"]]));

    //then
    assert.is(obsMap.has(1), true);

    //when
    obsMap.del(1);

    //then
    assert.is(obsMap.has(1), false);

    //when
    obsMap.del(16);

    //then
    assert.is(obsMap.has(2), true);
    assert.is(obsMap.has(3), true);
});

utilSuite.add("method under test: onDel", assert => {

    //given
    const obsMap = ObservableMap(new Map([[1, "one"]]));
    let testKey = null;
    let testValue = null;
    obsMap.onDel((key, value, x) => {
        testKey = key;
        testValue = value;
    });

    //when
    obsMap.del(1);

    //then
    assert.is(testKey, 1);
    assert.is(testValue, "one");
});

utilSuite.add("method under test: size", assert => {

    //given
    const obsMap = ObservableMap(new Map([[1,"one"],[2,"two"],[3,"three"]]));

    //then
    assert.is(obsMap.size(), 3);

    //when
    obsMap.del(1);

    //then
    assert.is(obsMap.size(), 2);

    //when
    obsMap.add(2345);

    //then
    assert.is(obsMap.size(), 3);
});

utilSuite.add("method under test: onChange", assert => {

    //given
    const obsMap = ObservableMap(new Map());
    let testKey = null;
    let testValue = null;
    obsMap.onChange((key, value) => {
        testKey = key;
        testValue = value;
    });

    //when
    obsMap.add(2345, { name: "onChange 1" });
    obsMap.add(3456, { name: "onChange 2" });

    //then
    assert.is(testKey, 3456);
    assert.is(testValue.name, "onChange 2");

    //when
    obsMap.del(2345);

    //then
    assert.is(testKey, 2345);
    assert.is(testValue.name, "onChange 1");
});

utilSuite.add("method under test: get", assert => {

    const map = new Map([[1,"one"],[2,"two"],[3,"three"]]);
    //given
    const obsMap = ObservableMap(map);

    //then
    assert.is(obsMap.get(), map);
});

utilSuite.add("method under test: clear", assert => {

    //given
    const obsMap = ObservableMap(new Map([[1,"one"],[2,"two"],[3,"three"]]));

    //then
    assert.is(obsMap.size(), 3);

    //when
    obsMap.clear();

    //then
    assert.is(obsMap.size(), 0);
});

utilSuite.add("methods under test: remove listeners", assert => {

    //given
    const obsMap = ObservableMap(new Map());
    let nrOfChangeCalls = 0;
    const nrOfOnChangeCallsIncrement = () => nrOfChangeCalls = nrOfChangeCalls + 1;
    obsMap.onAdd(nrOfOnChangeCallsIncrement);

    //when
    obsMap.add(1, "one");

    //then
    assert.is(nrOfChangeCalls, 2);

    //when
    obsMap.removeAddListener(nrOfOnChangeCallsIncrement);
    obsMap.add(2, "two");

    //then
    assert.is(nrOfChangeCalls, 3);

    //when
    obsMap.onDel(nrOfOnChangeCallsIncrement);
    obsMap.del(1);

    //then
    assert.is(nrOfChangeCalls, 6);

    //when
    obsMap.removeDeleteListener(nrOfOnChangeCallsIncrement);
    obsMap.del(2);

    //then
    assert.is(nrOfChangeCalls, 8);
});

utilSuite.add("method under test: onClear", assert => {

    //given
    const obsMap = ObservableMap(new Map([[1,"one"],[2,"two"],[3,"three"]]));
    let test = null;
    obsMap.onClear(() => {
        test = "test";
    });

    //when
    obsMap.clear();

    //then
    assert.is(test, "test");
});


utilSuite.add("method under test: PositiveNumber", assert => {

    assert.is(PositiveNumber(1), 1);
    assert.is(PositiveNumber(-1), 0);
    assert.is(PositiveNumber("999"), 999);
    assert.is(PositiveNumber("-999"), 0);
    try {
        PositiveNumber({})();
        assert.is("must not reach here", true);
    } catch (typeError) {
        assert.is(typeError.message, "Object 'NaN' is not a valid number.");
    }

    try {
        PositiveNumber("not a number")();
        assert.is("must not reach here", true);
    } catch (typeError) {
        assert.is(typeError.message, "Object 'NaN' is not a valid number.");
    }
});


utilSuite.add("method under test: RandomNumber", assert => {

    let allTrue1 = false;
    let possibleRange1 = [0,1];
    for(let index = 0; index < 99; index++) {
        allTrue1 = possibleRange1.includes(RandomNumber(0,1));
        if (!allTrue1) return;
    }
    assert.is(allTrue1, true);


    let allTrue2 = false;
    let possibleRange2 = [-5,-4,-3,-2,-1,0,1,2,3];
    for(let index = 0; index < 99; index++) {
        allTrue2 = possibleRange2.includes(RandomNumber(-5,"3"));
        if (!allTrue2) return;
    }
    assert.is(allTrue2, true);

    assert.is(RandomNumber(-5, "not a number").toString(), NaN.toString());
});

utilSuite.add("method under test: RandomString", assert => {


    assert.is(RandomString("AAAAA", 20).length, 20);
    assert.is(RandomString("AAAAA", 20), "AAAAAAAAAAAAAAAAAAAA");

    let allTrue1 = false;
    let possibleRange1 = "ABCabc";
    const longRandomString = RandomString("ABCabc", 400);
    for(let index = 0; index < longRandomString.length; index++) {
        allTrue1 = possibleRange1.includes(longRandomString.charAt(index));
        if (!allTrue1) return;
    }

    try {
        RandomString(null, 2);
        assert.is("must not reach here", true);
    } catch (typeError) {
        assert.is(typeError.message, "Object 'null' is not a valid string.");
    }

    try {
        RandomString("test", "not a string");
        assert.is("must not reach here", true);
    } catch (typeError) {
        assert.is(typeError.message, "Object 'NaN' is not a valid number.");
    }
});

utilSuite.add("pxMapper", assert => {

    //given
    const array = [1, 2, 3, 4];

    //then
    assert.is(pxMapper(array)[0], "1px");
    assert.is(pxMapper(array)[3], "4px");
});

utilSuite.run();
