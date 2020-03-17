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

  if(navigator.onLine){
    checkDatabase();
  };
};

request.onerror = function(event){
  console.log("Something went wrong! " + event.target.errorCode)
}