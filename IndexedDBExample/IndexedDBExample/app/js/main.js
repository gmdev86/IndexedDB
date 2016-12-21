var ModCreateDB = (function(){

    function ModCreateDB(oDB){
        var _that = this;
        var _dbName = "";
        var _oDB = oDB;
        var txtDatabaseName = document.getElementById("txtDatabaseName");
        var btnCreateDB = document.getElementById('btnCreateDB');

        txtDatabaseName.value = _dbName;

        Object.defineProperty(this,"dbName",{
            get: function(){
                return _dbName;
            },
            set: function(value){
                _dbName = value;
                txtDatabaseName.value = value;
            }
        });

        txtDatabaseName.onchange = function(){
            _dbName = txtDatabaseName.value;
        };

        btnCreateDB.addEventListener('click',function(e){
            e.preventDefault();
            _that.createDB();
        });
    };

    ModCreateDB.prototype.createDB = function(){
        /*
        t.oDB.init(this.dbName,function(ret){
            console.dir(ret);
        });
        */
        console.log(that);
    };

    return ModCreateDB;
}());