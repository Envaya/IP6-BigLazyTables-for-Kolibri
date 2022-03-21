(() => {

  // DATA
  const testDataSize = 20;
  const testData = [];
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const table = document.getElementById("table");
  const cities = ["Tokyo", "Osaka", "Kyoto", "Kobe", "Nagano"];

  const randomNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  const randomString = length => {
    let result = '';
    let charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() *
          charactersLength));
    }
    return result;
  }

  for (let i = 0; i < testDataSize; i++) {
    let person = {
      name: randomString(randomNumber(3, 13)),
      age: randomNumber(1, 80),
      city: cities[Math.floor(Math.random() * cities.length)],
    }
    testData.push(person);
  }
  // DOM GENERATION
  let c = document.createDocumentFragment();
  const tableBody = table.getElementsByClassName("table-body")[0];

  for (let i = 0; i < testData.length; i++) {
    let row = document.createElement("div");
    row.className = "table-row";
    // e.innerHTML = string;
    let cell1 = document.createElement("div");
    let cell2 = document.createElement("div");
    let cell3 = document.createElement("div");
    cell1.className = "table-cell";
    cell2.className = "table-cell";
    cell3.className = "table-cell";
    cell1.innerText = testData[i].name;
    cell2.innerText = testData[i].age;
    cell3.innerText = testData[i].city;
    row.appendChild(cell1);
    row.appendChild(cell2);
    row.appendChild(cell3);
    c.appendChild(row);
  }
  tableBody.appendChild(c);

  // resizable column widths

  // @TODO cleanup variables, variable scopes
  let rows = tableBody.children;

  const updateTableBodyColWidths = (colIndex, width) => {
    for (let i = 0; i < rows.length; i++) {
      let rowCol = rows[i].children[colIndex];
      rowCol.style.width = width + 'px';
    }
  }

  const createDiv = height => {
    let div = document.createElement('div');
    div.style.top = "0";
    div.style.right = "0";
    div.style.width = '5px';
    div.style.position = 'absolute';
    div.style.cursor = 'col-resize';
    div.style.backgroundColor = 'red';
    div.style.userSelect = 'none';
    div.style.height = height + 'px';
    return div;
  }

  const resizableGrid = table => {
    let headerRow = table.getElementsByClassName('table-header-row')[0];
    let cols = headerRow ? headerRow.children : undefined;

    for (let i = cols.length-1; i >= 0; i--) {
      updateTableBodyColWidths(i, cols[i].offsetWidth);
    }

    if (!cols) return;

    for (let k = 0; k < cols.length; k++) {
      let div = createDiv(cols[k].offsetHeight);
      cols[k].appendChild(div);
      cols[k].style.position = 'relative';
      setListeners(div);
    }
  }

  const setListeners = div => {
    let pageX, curCol, nxtCol, curColWidth, nxtColWidth;
    div.addEventListener('mousedown', e => {
      curCol = e.target.parentElement;
      nxtCol = curCol.nextElementSibling;
      pageX = e.pageX;
      curColWidth = curCol.offsetWidth;
      if (nxtCol)
        nxtColWidth = nxtCol.offsetWidth;
    });

    document.addEventListener('mousemove', e => {
      if (curCol) {
        let diffX = e.pageX - pageX;

        if (nxtCol) {
          nxtCol.style.width = (nxtColWidth - (diffX)) + 'px';
          updateTableBodyColWidths(nxtCol.dataset.columnIndex, (nxtColWidth - (diffX)));
        }
        curCol.style.width = (curColWidth + diffX) + 'px';
        updateTableBodyColWidths(curCol.dataset.columnIndex, (curColWidth + diffX));
      }

    });

    document.addEventListener('mouseup', e => {
      curCol = undefined;
      nxtCol = undefined;
      pageX = undefined;
      nxtColWidth = undefined;
      curColWidth = undefined;
    });
  }

  resizableGrid(table);
})();