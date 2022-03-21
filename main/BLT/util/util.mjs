/**
 * @author bezel: https://github.com/KDuss/bezel
 */

/**
 * Adds delay to the execution of subsequent code.
 * Used for UI tests, because click events run asynchronously.
 * Usage in test: await sleep(10);
 * @param {number} millis - Duration of delay
 */
const sleep = millis => new Promise(
    res => setTimeout(_ => res(), millis),
);

const addThousandsSeparator = nr => nr.toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, '\'');

export {
    addThousandsSeparator, sleep
};

/**
 * @author blt: https://gitlab.fhnw.ch/niki.voegtli/IP6-BigLazyTables-for-Kolibri/
 */

/**
 * Creating a new domElement.
 * @param type
 * @param styles
 * @param id
 * @param classes
 */
const domElement = (type, styles, id, ...classes) => {
    const newElement = document.createElement(type);
    if (styles) {
        for(let prop of Object.keys(styles)){
            newElement.style[prop.toString()] = styles[prop.toString()];
        }
    }
    if (id) newElement.id = id;
    if (classes.length !== 0) newElement.classList.add(...classes);
    return newElement;
};

/**
 * Takes an array and adds 'px' to each element.
 * @param {Array} arr
 */
const pxMapper = arr => {
    return arr.map(e => e + 'px');
}

/**
 * Visual element for resizing the columns.
 * @param tableHeaderHeight
 */
const columnResizerElement = tableHeaderHeight => {
    const styles = {
        top             : "0",
        right           : "0",
        width           : '2px',
        position        : 'absolute',
        cursor          : 'col-resize',
        backgroundColor : 'black',
        userSelect      : 'none',
        height          : tableHeaderHeight + 'px'
    }
    return domElement("div", styles);
}

/**
 * all needed listeners for resizing the columns.
 * @param controller
 * @param rootElement
 * @param {HTMLElement} columnResizer
 */
const addListenersToColumnResizer = (controller, rootElement, columnResizer) => {

    let pageX, curCol, nxtCol, curColWidth, nxtColWidth;

    /**
     * Select columnResizer.
     */
    columnResizer.addEventListener('mousedown', e => {
        curCol      = e.target.parentElement;
        nxtCol      = curCol.nextElementSibling;
        pageX       = e.pageX;
        curColWidth = curCol.offsetWidth;

        if (nxtCol) nxtColWidth = nxtCol.offsetWidth;
    });

    /**
     * Move selected columnResizer.
     */
    rootElement.addEventListener('mousemove', e => {
        if (curCol) {
            const diffX = e.pageX - pageX;

            if (nxtCol) {
                controller.setColumnWidths(nxtCol.dataset.columnIndex, (nxtColWidth - (diffX)));
            }
            controller.setColumnWidths(curCol.dataset.columnIndex,  (curColWidth + diffX));
        }
    });

    /**
     * Release selected columnResizer.
     */
    rootElement.addEventListener('mouseup', _ => {
        curCol      = undefined;
        nxtCol      = undefined;
        pageX       = undefined;
        nxtColWidth = undefined;
        curColWidth = undefined;
    });
}

/**
 * Generates a random Integer Number between a given minimal and maximal value.
 * @param {Number} min
 * @param {Number} max
 * @returns Number
 */
const RandomNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Converts a given Number into a positive Number by converting negative Numbers to 0.
 * @param { Number | String } value
 * @returns Number
 */
const PositiveNumber = value => {
    const number = Number(value.valueOf());
    if (isNaN(number)) {
        throw new TypeError("Object '" + number + "' is not a valid number.");
    }
    return number < 0 ? 0 : number;
}

/**
 * Generates a random String with a given length
 * @param {String} stringSet
 * @param {Number} length
 * @returns String
 */
const RandomString = (stringSet, length) => {
    if (typeof stringSet !== 'string') {
        throw new TypeError("Object '" + stringSet + "' is not a valid string.");
    }
    const number = PositiveNumber(Number(length.valueOf()));
    if (isNaN(number)) {
        throw new TypeError("Object '" + number + "' is not a valid number.");
    }
    let result = '';
    let charactersLength = stringSet.length;
    for (let i = 0; i < length; i++) {
        result += stringSet.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    return result;
}

const ObservableMap = map => {
    const addListeners = [];
    const delListeners = [];
    const changeListeners = [];
    const clearListeners = [];
    const initListeners = [];
    const removeAddListener    = addListener => addListeners.removeItem(addListener);
    const removeDeleteListener = delListener => delListeners.removeItem(delListener);
    return {
        onAdd: listener => {
            addListeners.push(listener);
            changeListeners.push(listener);
        },
        onDel: listener => {
            delListeners.push(listener);
            changeListeners.push(listener);
        },
        onChange: callback => {
            changeListeners.push(callback);
        },
        onInit: listener => {
            initListeners.push(listener);
        },
        onClear: listener => clearListeners.push(listener),
        add: (key, value) => {
            map.set(key, value);
            addListeners.forEach( listener => listener(key, value));
            changeListeners.forEach( listener => listener(key, value));
        },
        has: key => map.has(key),
        del: key => {
            const value = map.get(key);
            map.delete(key);
            const safeIterateDelete = [...delListeners]; // shallow copy as we might change listeners array while iterating
            const safeIterateChange = [...changeListeners]; // shallow copy as we might change listeners array while iterating
            safeIterateDelete.forEach( listener => listener(key, value, () => removeDeleteListener(listener) ));
            safeIterateChange.forEach( listener => listener(key, value));
        },
        init: (startKey, valueArray) => {
            map.clear();
            valueArray.forEach((value, index) => map.set(startKey + index, value));
            initListeners.forEach( listener => listener(map));
        },
        getItem: key => map.get(key),
        get: () => map,
        removeAddListener,
        removeDeleteListener,
        clear: () => {
            map.clear();
            changeListeners.forEach( listener => listener())
            clearListeners.forEach( listener => listener())
        },
        size:   ()   => map.size,
        addListeners
    }
};

const isEqual = (obj1, obj2) => {
    if (Object.keys(obj1).length !== Object.keys(obj2).length) return false;
    if (typeof obj1 !== 'object' && typeof obj1 !== 'function' || typeof obj2 !== 'object' && typeof obj2 !== 'function') return obj1 === obj2;
    for (let p in obj1) {
        if (obj1.hasOwnProperty(p) !== obj2.hasOwnProperty(p)) return false;

        switch (typeof (obj1[p])) {
            case 'object':
                if (!isEqual(obj1[p], obj2[p])) return false;
                break;
            case 'function':
                if (typeof (obj2[p]) == 'undefined' || (p !== 'compare' && obj1[p].toString() !== obj2[p].toString())) return false;
                break;
            default:
                if (obj1[p] !== obj2[p]) return false;
        }
    }
    return true;
};

export {
    domElement,
    pxMapper,
    columnResizerElement,
    addListenersToColumnResizer,
    RandomString,
    RandomNumber,
    PositiveNumber,
    ObservableMap,
    isEqual
};