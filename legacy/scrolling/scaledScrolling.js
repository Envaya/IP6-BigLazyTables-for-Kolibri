// const scrollListener = () => {
//
//   let table = {
//     ignoreScrolling: false, // mutable state that we need in the surrounding scope - to be better organized later
//     lastItemIndex: 0, // index of the last item that we placed in the viewport top and scrolled to
//     viewPortHeight: 480,
//     rowHeight: 60,
//     numberOfRows: entries.length,
//   }
//
//   const numberOfVisibleRows = Math.ceil(table.viewPortHeight / table.rowHeight);
//   const numberOfNotVisibleRows = table.numberOfRows - numberOfVisibleRows;
//   const lastVisibleRowOverflow = Math.abs(table.viewPortHeight - numberOfVisibleRows * table.rowHeight);
//   // @TODO calculate postfill height correctly
//   const postfillheight = numberOfNotVisibleRows * (table.rowHeight / 10) - 13;
//
//   postfill.style.height = postfillheight + "px";
//
//   scroller.addEventListener("scroll", event => {
//     if (table.ignoreScrolling) {
//       // assert that our use of scrollTo does not trigger our own scroll handler again.
//       // we should only enter this when user scrolls a large distance very quickly by using the scrollbar
//       // then we ignore all scroll events and only process the last one
//       return;
//     }
//     table.ignoreScrolling = true;
//     requestAnimationFrame(t => {
//       let scrollTop = scroller.scrollTop; // cache the value to make sure it does not change while processing
//       const scrollTopLast = table.lastItemIndex * (table.rowHeight / 10);
//
//       if (Math.abs(scrollTop - scrollTopLast) >= table.rowHeight) {
//
//         if (Math.abs(scrollTop - scrollTopLast) >= table.rowHeight * 2) {
//           // update scrollTop with the position where the scrollbar stopped
//           scrollTop = scroller.scrollTop;
//           itemIndex = table.lastItemIndex + Math.floor((scrollTop - scrollTopLast) / (table.rowHeight / 10));
//           updateTableViewAfterScroll(scrollTop, itemIndex);
//
//         } else {
//           itemIndex = table.lastItemIndex + Math.floor((scrollTop - scrollTopLast) / table.rowHeight);
//           updateTableViewAfterScroll(scrollTop, itemIndex);
//         }
//       } else {
//         table.ignoreScrolling = false;
//       }
//     });
//
//     const updateTableViewAfterScroll = (scrollTop, itemIndex) => {
//       table.lastItemIndex = itemIndex;
//       const newPrefillHeight = itemIndex * (table.rowHeight / 10);
//       prefill.style.height = newPrefillHeight + "px";
//       // @TODO find solution to prevent tablescroll from reaching end too soon or too late
//       postfill.style.height = itemIndex >= table.numberOfRows - numberOfVisibleRows ? 0 : (postfillheight - itemIndex * (table.rowHeight / 10)) + "px";
//
//       output.textContent = `
//                 scrollTop:     ${scrollTop}
//                 newPrefillHeight: ${newPrefillHeight}
//                 itemIndex:     ${itemIndex}
//                 lastItemIndex: ${table.lastItemIndex}
//             `;
//
//       scroller.scrollTo({top: newPrefillHeight, behavior: "instant"});
//
//       tableProjector.updateTableContent(itemIndex, keysLength, numberOfRenderedRows, entries, rootElement);
//       table.ignoreScrolling = false;
//     }
//   });
// }