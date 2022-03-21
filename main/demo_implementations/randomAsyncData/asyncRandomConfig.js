const tableConfig = {

    app: {
        rowHeight: 100,
        nrVisibleRows: 50,
        filterObj: {
            ColumnFilters: ['', '', '', '', '', ''],
            ColumnSorter:
                {
                    column: undefined,
                    state:  ''
                }
        },
        columnWidths: [150, 560, 250, 150, 560, 250, 560, 540]
    },
    testing: {
        SIMULATED_FETCH_DELAY: 150,
    }
};

export {tableConfig};