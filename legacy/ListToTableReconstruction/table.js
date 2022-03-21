// mutable state that we need in the surrounding scope - to be better organized later
let ignore = false;
let lastItemIndex = 0; // index of the last item that we placed in the viewport top and scrolled to
scroller.addEventListener("scroll", event => {
    if (ignore) {
        // assert that our use of scrollTo does not trigger our own scroll handler again.
        console.error("we should never reach here!!!", lastItemIndex, scroller.scrollTop);
        return;
    }
    ignore = true;
    requestAnimationFrame( t => {
        const scrollTop = scroller.scrollTop; // cache the value to make sure it does not change while processing
        // without this check, we have an endless list
        if (scrollTop > 30_000_000) { // nothing to do since we have hit the end of data
            ignore = false;
            return;
        }
        const itemIndex = Math.floor(scrollTop / 150);
        if (itemIndex === lastItemIndex) {
            ignore = false;
            return; // nothing to do since we still display the same data
        }
        output.textContent = `
                scrollTop:     ${scrollTop}
                itemIndex:     ${itemIndex}
                lastItemIndex: ${lastItemIndex}
            `;
        lastItemIndex = itemIndex;
        const newPrefillHeight = itemIndex * 150;
        const newScrollPosition = scrollTop;
        prefill.style.height = newPrefillHeight + "px";
        postfill.style.height = ( 30_000_000 - newPrefillHeight) + "px";
        scroller.scrollTo({top: newScrollPosition, behavior:"instant"});

        //Update Data

        //Cell1 content
        cell1a.textContent = itemIndex + 1 + "a";
        cell1b.textContent = itemIndex + 1 + "b";
        cell1c.textContent = itemIndex + 1 + "c";
        cell1d.textContent = itemIndex + 1 + "d";
        cell1e.textContent = itemIndex + 1 + "e";

        //Cell2 content
        cell2a.textContent = itemIndex + 2 + "a";
        cell2b.textContent = itemIndex + 2 + "b";
        cell2c.textContent = itemIndex + 2 + "c";
        cell2d.textContent = itemIndex + 2 + "d";
        cell2e.textContent = itemIndex + 2 + "e";

        //Cell1 content
        cell3a.textContent = itemIndex + 3 + "a";
        cell3b.textContent = itemIndex + 3 + "b";
        cell3c.textContent = itemIndex + 3 + "c";
        cell3d.textContent = itemIndex + 3 + "d";
        cell3e.textContent = itemIndex + 3 + "e";

        //Cell4 content
        cell4a.textContent = itemIndex + 4 + "a";
        cell4b.textContent = itemIndex + 4 + "b";
        cell4c.textContent = itemIndex + 4 + "c";
        cell4d.textContent = itemIndex + 4 + "d";
        cell4e.textContent = itemIndex + 4 + "e";

        //Cell5 content
        cell5a.textContent = itemIndex + 5 + "a";
        cell5b.textContent = itemIndex + 5 + "b";
        cell5c.textContent = itemIndex + 5 + "c";
        cell5d.textContent = itemIndex + 5 + "d";
        cell5e.textContent = itemIndex + 5 + "e";

        ignore = false;
    });
});

//Sorting
const tableHeader = document.querySelectorAll('th')

tableHeader.forEach(e => e.addEventListener("click", function() {

    const column    = e.getAttribute("data-column")
    const order     = e.getAttribute("data-order")

    if(order === 'desc'){
        e.setAttribute("data-order", 'asc')
        e.setAttribute("class",  "fa fa-sort-desc")
    }
    else{
        e.setAttribute("data-order", 'desc')
        e.setAttribute("class",  "fa fa-sort-asc")
    }

    console.log(column, order)
}));