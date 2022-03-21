// stand-in for an asynchronous service

export { fortuneService }

const fortunes = [
    "Hello from IP6",
    "constructing BigLazyTables, stand by... ",
    "And another row",
    "Why was the JavaScript developer sad? a. Because they didn't Node how to Express himself",
    "read you dont know js",
    "How do you comfort a JavaScript bug? a. You console it"
];

function fortuneService(whenDone) {
    setTimeout(
        () => {
            let fortuneString = fortunes[Math.floor((Math.random() * fortunes.length))];
            console.warn(fortuneString)
            whenDone(fortuneString);
        },
        // Math.floor((Math.random() * 3000))
        Math.floor((Math.random() * 300)) // lowering the timeout for now
    );
}