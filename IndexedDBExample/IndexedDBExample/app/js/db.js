/*
Available properties:
	databaseName
	databaseVersion
	databaseSupported

Available functions:
	Init(name, callback);
	createDatabase(callback);
	getDatabase(callback);
	checkForDatabase(callback);
	removeDatabase(callback);
	createObjectStore(sName, sKeyPath, bKeyGen, callback);
	addIndex(sName, idxName, idxColumn, bUnique, callback);
	addData(sName, dataObject, callback);
	getDataByKey(sName, sKey, callback);
	deleteDataByKey(sName, sKey, callback);
	getAll(sName, callback);
	updateDataByKey(sName, sKey, dataObject, callback);

Description:
	Init -> “name” will be the name for your database. “callback” is a function that will return an object that contains log and error messages.
	createDatabase -> “callback” is a function that will return an object with log and error messages.
	getDatabase -> “callback” is a function that will return an object with log an error messages. It may also contain the database if one exists.
	checkForDatabase -> “callback” is a function that will return an object with log an error messages.
	removeDatabase -> “callback” is a function that will return an object with log an error messages.
	createObjectStore -> “sName” is the name for the table. “sKeyPath” used for the key column. If using bKeyGen pass an empty string. “bKeyGen” is a Boolean used for auto incrementing the key column. “callback” is a function that will return an object with log an error messages.
	addIndex -> “sName” is the name of the table. “idxName” is the name for the index. “idxColumn” is the column used for the index. “bUnique” is used to specify if the index is unique. “callback” is a function that will return an object with log an error messages.
	addData -> “sName” is the name of the table. “dataObject” is json data for adding to the table. “callback” is a function that will return an object with log an error messages.
	getDataByKey -> “sName” is the name of the table. “sKey” is the key for the table. “callback” is a function that will return an object with log an error messages. It will also contain the data in the “data” field.
	deleteDataByKey -> “sName” is the name of the table. “sKey” is the key for the table. “callback” is a function that will return an object with log an error messages.
	getAll -> “name” will be the name for your database. “callback” is a function that will return an object that contains log and error messages. It will also contain the data in the “oData” field.
	updateDataByKey -> “sName” is the name of the table. “sKey” is the key for the table. “dataObject” is json data with the updated data. “callback” is a function that will return an object that contains log and error messages.

Usage:
    //make sure to open the browser console to view the callbacks
    var db = new DB(); //create new db

    //call the initialize passing the name for the database you want to use
    db.init("test",function(ret){console.dir(ret);});

    //if that database didn't exist run this
    db.createDatabase(function(ret){console.dir(ret);});

    //create the table
    db.createObjectStore("table1","id",false,function(ret){console.dir(ret);});

    //add an index to the id and set to unique by passing true in 4th param
    db.addIndex("table1","idxID","id",true,function(ret){console.log(ret);});

    //add some data
    var dataObject = [
      { id: 1, name: "Bill", age: 35, email: "bill@company.com" },
      { id: 2, name: "Donna", age: 32, email: "donna@home.org" }
    ];
    db.addData("table1",dataObject,function(ret){console.log(ret);});

    //get data using key 2
    db.getDataByKey("table1",2,function(ret){console.log(ret);});

    //let's update the age for Bill
    var dataObject = [
      { age: 59 }
    ];
    db.updateDataByKey("table1",1,dataObject,function(ret){console.dir(ret);});

    //finally lets get all the records for table1
    db.getAll("table1",function(ret){console.dir(ret);});

*/

var DB = (function(){
    /*******************************************************************************************************************
                                                      Constructor
    *******************************************************************************************************************/
    function DB(){

        /***************************************************************************************************************
                                                        Properties
        ***************************************************************************************************************/
        var _dbName = "";
        Object.defineProperty(this,"databaseName",{
            get: function(){return _dbName;},
            set: function(value){
                _dbName = value;
            }
        });

        var _dbVersion = 0;
        Object.defineProperty(this, "databaseVersion",{
            get: function(){return _dbVersion;},
            set: function(value){
                _dbVersion = value;
            }
        });

        var _browserSupported = true;
        Object.defineProperty(this, "databaseSupported",{
            get: function(){
                if(!window.indexedDB){
                    _browserSupported = false;
                }
                return _browserSupported;
            }
        });

        /***************************************************************************************************************
                                                     Private Methods
        ***************************************************************************************************************/
    };

    /*******************************************************************************************************************
                                                      Public Methods
    *******************************************************************************************************************/
    DB.prototype.init = function(name, callback){
        var ret = {
            result: false,
            error: "",
            log: ""
        };

        if(name != undefined){
            //create database
            var $$request = window.indexedDB.open(name);
            var that = this;

            $$request.onerror = function(event){
                var eString = event.target.error.toString();
                var bAbort = eString.includes("AbortError");

                if(bAbort){
                 ret.result = false;
                 ret.error = "";
                 ret.log = "Database does not exist! Run DB.createDatabase";

                 if(callback){
                    callback(ret);
                 }

                } else {
                    ret.result = false;
                    ret.error = eString;
                    ret.log = "Error in init.";

                    if(callback){
                        callback(ret);
                    }
                }
            }

            $$request.onsuccess = function(event){
                var $$database = event.target.result;
                that.databaseName = $$database.name;
                that.databaseVersion = $$database.version;
                $$database.close();
                ret.result = true;
                ret.error = "";
                ret.log = "Database exists";
                ret.database = $$database;

                if(callback)
                    callback(ret);
            }

            $$request.onupgradeneeded = function(event){
                 event.target.transaction.abort();
            }
        } else {
            ret.result = false;
            ret.error = "Must pass database name";
            ret.log = "pass in database name";

            if(callback)
                callback(ret);
        }
    };

    DB.prototype.createDatabase = function(callback){
        var ret = {
            result: false,
            error: "",
            log: ""
        };

        if(this.databaseName != undefined){
            //create database
            var $$request = window.indexedDB.open(this.databaseName);
            var that = this;

            $$request.onerror = function(event){
                var eString = event.target.error.toString();
                ret.result = false;
                ret.error = eString;
                ret.log = "Error in createDatabase";

                if(callback)
                    callback(ret);
            }

            $$request.onsuccess = function(event){
                var $$database = event.target.result;
                that.databaseVersion = $$database.version;
                $$database.close();
                ret.result = true;
                ret.error = "";
                ret.log = "Database created!";

                if(callback)
                    callback(ret);
            }

            $$request.onupgradeneeded = function(event){
            }
        } else {
            ret.result = false;
            ret.error = "Must run init";
            ret.log = "Run db.init()!";

            if(callback)
                callback(ret);
        }

    };

    DB.prototype.getDatabase = function(callback){
        var ret = {
            result: false,
            error: "",
            log: ""
        };

        if(this.databaseName != undefined){
            //create database
            var $$request = window.indexedDB.open(this.databaseName);

            $$request.onerror = function(event){
                var eString = event.target.error.toString();
                ret.result = false;
                ret.error = eString;
                ret.log = "Error in getDatabase.";

                if(callback)
                    callback(ret);
            }

            $$request.onsuccess = function(event){
                var $$database = event.target.result;
                this.databaseVersion = $$database.version;
                $$database.close();
                ret.result = true;
                ret.error = "";
                ret.database = $$database;
                ret.log = "see database...";

                if(callback)
                    callback(ret);
            }

            $$request.onupgradeneeded = function(event){
            }
        } else {
            ret.result = false;
            ret.error = "Must run init";
            ret.log = "run db.init()";

            if(callback)
                callback(ret);
        }
    };

    DB.prototype.checkForDatabase = function(callback){
        var ret = {
            result: false,
            error: "",
            log: ""
        };

         if(this.databaseName != undefined && this.databaseVersion != undefined){
             var dbExists = true;
             var request = window.indexedDB.open(this.databaseName);

             request.onerror = function(e){
                 var eString = e.target.error.toString();
                 var bAbort = eString.includes("AbortError");

                 if(bAbort){
                     dbExists = false;
                     ret.result = true;
                     ret.error = "";
                     ret.log = "Database does not exist!";

                     if(callback)
                         callback(ret);
                 } else {
                     ret.result = false;
                     ret.error = eString;
                     ret.log = "Error in checkForDatabase.";

                     if(callback)
                        callback(ret);
                 }

             };

             request.onupgradeneeded = function(e){
                 e.target.transaction.abort();
                 dbExists = false;
             };

             request.onsuccess = function(e){
                 var thisDB = e.target.result;
                 thisDB.close();
                 ret.result = true;
                 ret.error = "";
                 ret.log = "Database exists!!";

                 if(callback)
                     callback(ret);
             };
         } else {
             ret.result = false;
             ret.error = "Must run init";
             ret.log = "Run db.init()";

             if(callback)
                 callback(ret);
         }
    };

    DB.prototype.removeDatabase = function(callback){
        var ret = {
            result: false,
            error: "",
            log: ""
        };

        if(this.databaseName != undefined){
            var dbDeleted = false;
            var request = window.indexedDB.deleteDatabase(this.databaseName);

            request.onerror = function(e){
                var eString = e.target.error.toString();
                ret.result = false;
                ret.error = eString;
                ret.log = "Couldn't delete the database!!!";

                if(callback)
                    callback(ret);
            };

            request.onsuccess = function(){
                dbDeleted = true;
                ret.result = dbDeleted;
                ret.error = "";
                ret.log = "Deleted database successfully!";

                if(callback)
                    callback(ret);
            };

            request.onblocked = function(e){
                var eString = e.target.error.toString();
                ret.result = false;
                ret.error = eString;
                ret.log = "Couldn't delete database due to the operation being blocked";

                if(callback)
                    callback(ret);
            };
        } else {
             ret.result = false;
             ret.error = "Must run init";
             ret.log = "Run db.init()";

             if(callback)
                 callback(ret);
        }
    };

    DB.prototype.createObjectStore = function(sName, sKeyPath, bKeyGen, callback){
        var ret = {
            result: false,
            error: "",
            log: ""
        };

        if(this.databaseName != undefined){
            var that = this;

            //update database version
            this.databaseVersion += 1;
            var $$request = window.indexedDB.open(this.databaseName, this.databaseVersion);

            $$request.onerror = function(event){
                var eString = event.target.error.toString();
                ret.result = false;
                ret.error = eString;
                ret.log = "check error string";

                if(callback)
                    callback(ret);
            }

            $$request.onsuccess = function(event){
                var $$database = event.target.result;
                $$database.close();

                if(callback)
                    callback(ret);
            }

            $$request.onupgradeneeded = function(event){
                var db = event.target.result;

                //check for existing object store
                if(!db.objectStoreNames.contains(sName)){

                    if(bKeyGen){
                        var objectStore = db.createObjectStore(sName, { autoIncrement: true });
                    } else {
                        var objectStore = db.createObjectStore(sName, { keyPath: sKeyPath });
                    }

                    objectStore.transaction.oncomplete = function(event) {
                        ret.log = "Object store created. Next you may create an index.";
                        ret.result = true;
                        ret.error = "";
                    };

                    objectStore.transaction.onerror = function(event){
                        var eString = e.target.error.toString();
                        ret.log = "Error in createObjectStore in the transaction for creating objectStore.";
                        ret.result = false;
                        ret.error = eString;
                    };
                } else {
                    ret.log = "Object store already exists. Remove or update";
                }

            }
        } else {
            ret.result = false;
            ret.error = "Must run init";

            if(callback)
                callback(ret);
        }
    };

    DB.prototype.addIndex = function(sName, idxName, idxColumn, bUnique, callback){
        var ret = {
            result: false,
            error: "",
            log: ""
        };
        var that = this;

        if(that.databaseName != undefined && sName != undefined){
            //update database version
            this.databaseVersion += 1;
            var $$request = window.indexedDB.open(that.databaseName, that.databaseVersion);

            $$request.onerror = function(event){
                var eString = event.target.error.toString();
                ret.result = false;
                ret.error = eString;
                ret.log = "Failed to create index.";

                if(callback)
                    callback(ret);
            }

            $$request.onsuccess = function(event){
                var $$database = event.target.result;
                $$database.close();
                ret.log = "Index created!!!";

                if(callback)
                    callback(ret);
            }

            $$request.onupgradeneeded = function(event){
                var db = event.target.result;

                //check for existing object store
                if(db.objectStoreNames.contains(sName)){
                    var objectStore = event.currentTarget.transaction.objectStore(sName);

                    objectStore.createIndex(idxName, idxColumn, { unique: bUnique});
                } else {
                    ret.log = "Object store does not contain that name";
                }

            }
        } else {
            ret.result = false;
            ret.error = "databaseName or sName is undefined";
            ret.log = "databaseName or sName is undefined";
        };

    };

    DB.prototype.addData = function(sName, dataObject, callback){
        var ret = {
            result: false,
            error: "",
            log: "",
            addedCount: 0,
            failCount: 0
        };
        var that = this;

        if(that.databaseName != undefined && sName != undefined){
            //update database version
            this.databaseVersion += 1;
            var $$request = window.indexedDB.open(that.databaseName, that.databaseVersion);

            /*** used for testing ***/
            /*
            dataObject = [
              { ssn: "444-44-4444", name: "Bill", age: 35, email: "bill@company.com" },
              { ssn: "555-55-5555", name: "Donna", age: 32, email: "donna@home.org" }
            ];
            */

            $$request.onerror = function(event){
                var eString = event.target.error.toString();
                ret.result = false;
                ret.error = eString;
                ret.log = "Failed to add data.";

                if(callback)
                    callback(ret);
            }

            $$request.onsuccess = function(event){
                var $$database = event.target.result;
                $$database.close();
                ret.log = "Data added!!!";

                if(callback)
                    callback(ret);
            }

            $$request.onupgradeneeded = function(event){
                var db = event.target.result;

                //check for existing object store
                if(db.objectStoreNames.contains(sName)){
                    var objectStore = event.currentTarget.transaction.objectStore(sName);

                    for(var i in dataObject){
                        var request = objectStore.add(dataObject[i]);

                        request.onsuccess = function(event){
                            var total = ret.addedCount + 1;
                            ret.addedCount = total;
                        };

                        request.onerror = function(event){
                            var total = ret.failCount + 1;
                            ret.failCount = total;
                        };
                    }

                } else {
                    ret.log = "Object store does not contain that name";
                }

            }
        } else {
            ret.result = false;
            ret.error = "databaseName or sName is undefined";
            ret.log = "databaseName or sName is undefined";
        };

    };

    DB.prototype.getDataByKey = function(sName, sKey, callback){
        var ret = {
            result: false,
            error: "",
            log: ""
        };
        var that = this;

        if(that.databaseName != undefined && sName != undefined){
            var $$request = window.indexedDB.open(that.databaseName, that.databaseVersion);

            $$request.onerror = function(event){
                var eString = event.target.error.toString();
                ret.result = false;
                ret.error = eString;
                ret.log = "Failed to get data.";

                if(callback)
                    callback(ret);
            }

            $$request.onsuccess = function(event){
                var $$database = event.target.result;
                var transaction = $$database.transaction([sName]);
                var objectStore = transaction.objectStore(sName);
                var request = objectStore.get(sKey);

                request.onerror = function(event){
                    ret.requestError = event;
                };

                request.onsuccess = function(event){
                    ret.data = request.result;
                    $$database.close();
                };

                ret.log = "Look in data.";

                if(callback)
                    callback(ret);
            }

            $$request.onupgradeneeded = function(event){};
        } else {
            ret.result = false;
            ret.error = "databaseName or sName is undefined";
            ret.log = "databaseName or sName is undefined";
        };
    };

    DB.prototype.deleteDataByKey = function(sName, sKey, callback){
        var ret = {
            result: false,
            error: "",
            log: ""
        };
        var that = this;

        if(that.databaseName != undefined && sName != undefined){
            var $$request = window.indexedDB.open(that.databaseName, that.databaseVersion);

            $$request.onerror = function(event){
                var eString = event.target.error.toString();
                ret.result = false;
                ret.error = eString;
                ret.log = "Failed to delete data.";

                if(callback)
                    callback(ret);
            }

            $$request.onsuccess = function(event){
                var $$database = event.target.result;
                var transaction = $$database.transaction([sName], "readwrite");
                var objectStore = transaction.objectStore(sName);
                var request = objectStore.delete(sKey);

                request.onerror = function(event){
                    ret.requestError = event;
                };

                request.onsuccess = function(event){
                    ret.log = "Data deleted";
                    $$database.close();
                };

                if(callback)
                    callback(ret);
            }

            $$request.onupgradeneeded = function(event){};
        } else {
            ret.result = false;
            ret.error = "databaseName or sName is undefined";
            ret.log = "databaseName or sName is undefined";
        };
    };

    DB.prototype.getAll = function(sName, callback){
        var ret = {
            result: false,
            error: "",
            log: "",
            oData: []
        };
        var that = this;

        if(that.databaseName != undefined && sName != undefined){
            var $$request = window.indexedDB.open(that.databaseName, that.databaseVersion);

            $$request.onerror = function(event){
                var eString = event.target.error.toString();
                ret.result = false;
                ret.error = eString;
                ret.log = "Failed to fetch data.";

                if(callback)
                    callback(ret);
            }

            $$request.onsuccess = function(event){
                var $$database = event.target.result;
                var transaction = $$database.transaction([sName]);
                var objectStore = transaction.objectStore(sName);
                var request = objectStore.openCursor();

                request.onerror = function(event){
                    ret.requestError = event;
                };

                request.onsuccess = function(event){
                    var cursor = event.target.result;

                    if(cursor){
                        ret.oData.push(cursor.value);
                        cursor.continue();
                    } else {
                        ret.log = "Finished fetching data: look in oData";
                    }
                };

                $$database.close();

                if(callback)
                    callback(ret);
            }

            $$request.onupgradeneeded = function(event){};
        } else {
            ret.result = false;
            ret.error = "databaseName or sName is undefined";
            ret.log = "databaseName or sName is undefined";
        };
    };

    DB.prototype.updateDataByKey = function(sName, sKey, dataObject, callback){
        var ret = {
            result: false,
            error: "",
            log: ""
        };
        var that = this;

        /*** used for testing ***/
        /*
        dataObject = [
          { age: 59 }
        ];
        */

        if(that.databaseName != undefined && sName != undefined){
            var $$request = window.indexedDB.open(that.databaseName, that.databaseVersion);

            $$request.onerror = function(event){
                var eString = event.target.error.toString();
                ret.result = false;
                ret.error = eString;
                ret.log = "Failed to delete data.";

                if(callback)
                    callback(ret);
            }

            $$request.onsuccess = function(event){
                var $$database = event.target.result;
                var transaction = $$database.transaction([sName], "readwrite");
                var objectStore = transaction.objectStore(sName);
                var request = objectStore.get(sKey);

                request.onerror = function(event){
                    ret.requestError = event;
                };

                request.onsuccess = function(event){
                    var oData = event.target.result;

                    for(var i in oData){
                        // i == key
                        for(var x in dataObject[0]){
                            // x == key
                            if(i === x){
                                var newValue = dataObject[0][x];
                                oData[i] = newValue;
                            }
                        }
                    };

                    var requestUpdate = objectStore.put(oData, sKey);

                    requestUpdate.onerror = function(event){
                        ret.log = "Failed to update data";
                    };

                    requestUpdate.onsuccess = function(event){
                        ret.result = true;
                        ret.log = "Data updated";
                    };

                    $$database.close();
                };

                if(callback)
                    callback(ret);
            }

            $$request.onupgradeneeded = function(event){};
        } else {
            ret.result = false;
            ret.error = "databaseName or sName is undefined";
            ret.log = "databaseName or sName is undefined";
        };
    };

    return DB;
}());