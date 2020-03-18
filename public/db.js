// add code for indexedDB here and add a script tag for this file above index.js in index.html
let db;
//request opens a indexed database called "budget" with a version number of 1
const request  = indexedDB.open("budget", 1);

//request.onupgradeneeded asks what version of the indexDatabse we are on, depending on version we can do if statements if(event.oldVersion < (version number), you can create more indexes within a database or a new database.
request.onupgradeneeded = function(event){
  const db = event.target.result;
  //createObjectStore creates a indexed DB with the name "pending" with autoincrement
  db.createObjectStore("pending", { autoincrement: true});
}

request.onsuccess = function(event){
  db = event.target.result;
  //if we are online we run the function checkDatabase
  if(navigator.onLine){
    checkDatabase();
  };
};

request.onerror = function(event){
  console.log("Something went wrong! " + event.target.errorCode)
}

function saveRecord(record) {
  //set the variable transaction equal to the indexDB "pending" with a readwrite
  const transaction = db.transaction(["pending"], "readwrite");
  //store is set to equal to the open indexDB to store something into "pending"
  const store = transaction.objectStore("pending");
  //adds a record to the store which is the pending indexDB
  store.add(record);
}

function checkDatabase() {
  const transaction = db.transaction(["pending"], "readwrite");
  const store = transaction.objectStore("pending");
  // getAll is set to store.getAll which pulls all entries out of the indexDB pending
  const getAll = store.getAll();
  
  getAll.onsuccess = function() {
    if (getAll.result.length > 0) {
      fetch("/api/transaction/bulk", {
        method: "POST",
        body: JSON.stringify(getAll.result),
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json"
        }
      })
      .then(response => response.json())
      .then(() => {
        const transaction = db.transaction(["pending"], "readwrite");
        const store = transaction.objectStore("pending");
  
        // clear all items in your store
        store.clear();
      });
    }
  };
}