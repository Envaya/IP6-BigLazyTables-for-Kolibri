# Project Diary

IDLL = ID-based Lazy Loading

## 24.9.2021 - Kickoff Meeting
test

### 19.10.2021 - Working on a prototype for (IDLL)
Niki: For IDLL we need all 1 million empty rows in the table on page load. 
Testing multiple ways to inject large amount of DOM elements into HTML.
Conclusion: even when using very performance optimized methods, 
adding large amount of DOM elements (e.g. 100k +) always results in long (5s+) page load times and an unresponsive DOM. 
The verdict is that we cannot preload all rows on pageload but need to continuously add elements while scrolling.
Problems:
-> how to fake the height of the table when not all rows can be preloaded

Found a way to overwrite certain scrollbar properties (https://css-tricks.com/almanac/properties/s/scrollbar-color/)

Found the very promising Intersection Observer API that detects when an element enters/exits a viewport (https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)

### 20.10.2021 - Working on a prototype for (IDLL)
Testing Intersection Observer API

### 21.10.2021 - Working on a prototype for (IDLL)
Ives: Learned and tested Intersection Observer with generated Table. Tried things with «isIntersecting» behaviour and started to find a way to obsereve all generated rows.
Helpful video for understanding the basics:
Introduction to the Intersection Observer JavaScript API (https://www.youtube.com/watch?v=T8EYosX4NOo)

### 22.10.2021 - Working on a prototype for (IDLL)
Ives: Improved Intersection Observer: all cells are observed, preloadCell Function started (Needs to be combined with initial Cell loading structure -> Help from König?).
Helpful video for lazyloading images with intersection observer (no video found for lazyloading cells/rows with intersction observer):
(https://www.youtube.com/watch?v=mC93zsEsSrg)

### 23.10.2021 - WebClients Refresh
Ives: Dirty State/ Clean State: Week3 Präsentation von Dario

### 6.11.2021 - Table Scrolling Coding Session
(see recording)<br><br>
**0:00 scrollTop:**<br>
scrollTop property returns the distance of an elements top to its topmost visible content. Can only be used with elements that generate a scrollbar, otherwise the value will always be zero.<br>We found out, that we cannot use scrollTop on items inside the table to check their y Coordinate relative to their table container. This is due to the fact, that scrollTop works only on elements that are "scrollable", so we are limited to using it on the table (container).
<br><br>
(see recording)<br><br>
~32:00 Prof. König visualizing concept of scroll reseting with padding rows, a mixture of id and window based lazyloading.
<br><br>
~45:00: prototype for scroll reset concept
findings:
- browser scroll Event is asynchronous, meaning that scrolling at a faster pace will quickly lead to gaps between view and scrollposition, since updating the view takes too long. this resulted in our table displaying various undesired results. (interesting article: https://engineering.monday.com/our-journey-to-understand-scrolling-across-different-browsers/)
- requestAnimationFrame:
- the scroll reset method could not be implemented with satisfying results due to limitation of the scroll event. Instead, another approach should be used where all rows are fixed, and through scrolling we update the values of those rows depending on the scrollTop value.
- method to simulate "scrollability": an empty container with the height of number rows * row height that sits in the background of the table.

### 16.11.2021 - Biweekly
Next steps:
- Step 1: develop data model, use an array that contains the data objects. Create a TableModel that serves as a widget model; the widget model only knows what our table is currently showing.<br>
- Step 2: thinking about how to build our api, what endpoints do we need, e.g. "give me the next n entries start from #47"<br>
- Changes UI:make the table body the scroller, make column width adjustable. <br>
- Step 3: think about how to sort tables, sorting attribute in th-element. sort by A then by B -> what happens? must be sorted by A and B. --> research "Stabile Sortierverfahren". BUT: for this paper it's enough if the user can only sort by one column.
In a next step, the data can be imported from a Json file.<br>

#### Sorting
Our Table only has to know which n entries are being shown at the moment. The sorting function asks the service for the entries it needs. Sorting is more important than filtering for the user: Telefonbuchsuche phenomenom<br>
--> find out how users search<br>
Sorting can be complex: e.g. sorting by zip code (show me all cities with zip 7***, all entries with year in 20th century, etc.)<br>
important distinction: semantic vs technical data types
<br>
suggestion: find a dataset or use the one the other team is using<br>
####Filtering
must be possible to filter per column: an input field on each column header, the input field differs depending on the data type of the column, like dropdown for enums. Complexer filter methods, e.g. "> 50"<br>
Our service must contain some sort of FilterModel which saves/knows the filter method. Then we can pass e.g. a regex.<br>
Combining multiple filter methods to a "final" "total" filter.
use Excel as an example<br>

### 02.12.2021
(Niki) Working on Bugs that occur on lazy table. Testing has shown, that Chrome browser starts showing bugs start when scrolling past 16777200 pixels.<br>
To that end, pre and postfill has been scaled down to reduce height of the table. This caused issues when using the scrollbar. Thus a delayed handling of such events has been implemented.<br>
Current lazy table solution is not working in Safari.

### 03.12.2021
- urgent need to start implementing testcases. Crucial in identifying errors: e.g. if our filter has an error, it could be on the data model or in the view. If we see the error only in the view, we won't know where it occurs.<br>
- for halftime-presentation: mention that we work with webrowsers and that there or no good table components yet. We need to care about and implement a lot of things that usually come out of the box. (...)<br>
- view: currently we are still using multiple <table> elements. Try out different solutions and find the best:<br>
best solutions in their order:<br>
1. Using native html <table> with table cells that have variable table width (user can drag at the edge of a column to expand it)<br>
2. div and display table<br>
3. current solution with multiple tables<br>
- Current state of the Kolibri Repo: git@github.com:WebEngineering-FHNW/Kolibri.git, we should decide on our own when to switch to the repo. (the church director of our project is the stdlib directory). Instead of making a coyp of the WebCl files it's better to directly copy the Kolibri structure<br>
- Inputs for the projector pattern (see: incomplete)
- Inputs how to approach the filtering: ask service to return data of line 23256 (see recording)