// variable to hold db
let db;

// creates connection to IndexdDB
const request = indexedDB.open('budget', 1);

// this will emit if the database version is changed
request.onupgradeneeded = function(event) {
    const db = event.target.result;

    // creates an object store (table) called 'transaction' that has an auto incrementing primary key
    db.createObjectStore('transaction', { autoIncrement: true });
};

request.onsuccess = function(event) {
    db = event.target.result;

    // checks if app is online and if it is uploadTransaction will send all local data to api
    if (navigator.onLine) {
        uploadTransaction();
    }
};

request.onerror = function(event) {
    // logs error
    console.log(event.target.errorCode);
};