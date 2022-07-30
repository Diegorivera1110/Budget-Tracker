// const { response } = require("express");

// variable to hold db
let db;

// creates connection to IndexdDB
const request = indexedDB.open('budget_tracker', 1);

// this will emit if the database version is changed
request.onupgradeneeded = function(event) {
    const db = event.target.result;

    // creates an object store (table) called 'transaction' that has an auto incrementing primary key
    db.createObjectStore('new_transaction', { autoIncrement: true });
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

// saveRecord funtion will save submitted data if no internet connection is established
function saveRecord(record) {
    // opens new transaction with database
    const transaction = db.transaction(['new_transaction'], 'readwrite');

    // access the object store for 'new_transaction'
    const accountObjectStore = transaction.objectStore('new_transaction');
    
    // add record to your store with add method
    accountObjectStore.add(record);
};

function uploadTransaction() {
    // open a transaction on db
    const transaction = db.transaction(['new_transaction'], 'readwrite');

    // access object store
    const accountObjectStore = transaction.objectStore('new_transaction');

    // get all records from store
    const getAll = accountObjectStore.getAll();

    // if successful .getAll() execution, run below function
    getAll.onsuccess = function() {
        // if there was stored data, send to api server
        if (getAll.result.length > 0) {
            fetch('/api/transaction', {
                method: 'POST',
                body: JSON.stringify(getAll.result),
                headers: {
                    Accept: 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                }
            })
            .then(response => response.json())
            .then(serverResponse => {
                if (serverResponse.message) {
                    throw new Error(serverResponse);
                }
                // open one more transaction
                const transaction = db.transaction(['new_transaction'], 'readwrite');
                // access the new_transaction object store
                const accountObjectStore = transaction.objectStore('new_transaction');
                // clear all items in your store
                accountObjectStore.clear();

                alert('All saved transactions have been submitted!');
            })
            .catch(err => {
                console.log(err);
            });
        }
    }
}

window.addEventListener('online', uploadTransaction)