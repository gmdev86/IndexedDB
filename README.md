## IndexedDB
IndexedDB Example

#####Available properties:
	databaseName
	databaseVersion
	databaseSupported
#####Available functions:
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
#####Description:
	*Init -> “name” will be the name for your database. “callback” is a function that will return an object that contains log and error messages.
	*createDatabase -> “callback” is a function that will return an object with log and error messages.
	*getDatabase -> “callback” is a function that will return an object with log an error messages. It may also contain the database if one exists.
	*checkForDatabase -> “callback” is a function that will return an object with log an error messages.
	*removeDatabase -> “callback” is a function that will return an object with log an error messages.
	*createObjectStore -> “sName” is the name for the table. “sKeyPath” used for the key column. If using bKeyGen pass an empty string. “bKeyGen” is a Boolean used for auto incrementing the key column. “callback” is a function that will return an object with log an error messages.
	*addIndex -> “sName” is the name of the table. “idxName” is the name for the index. “idxColumn” is the column used for the index. “bUnique” is used to specify if the index is unique. “callback” is a function that will return an object with log an error messages.
	*addData -> “sName” is the name of the table. “dataObject” is json data for adding to the table. “callback” is a function that will return an object with log an error messages.
	*getDataByKey -> “sName” is the name of the table. “sKey” is the key for the table. “callback” is a function that will return an object with log an error messages. It will also contain the data in the “data” field.
	*deleteDataByKey -> “sName” is the name of the table. “sKey” is the key for the table. “callback” is a function that will return an object with log an error messages.
	*getAll -> “name” will be the name for your database. “callback” is a function that will return an object that contains log and error messages. It will also contain the data in the “oData” field.
	*updateDataByKey -> “sName” is the name of the table. “sKey” is the key for the table. “dataObject” is json data with the updated data. “callback” is a function that will return an object that contains log and error messages.
#####Usage:
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
