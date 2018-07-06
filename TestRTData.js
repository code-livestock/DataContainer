var RTData = require("./Data");
var DataContainer = require("./DataContainer");
var container = new DataContainer();

container.on("dataAdded",function(data){
    console.log(data.getID()+", "+data.getValue("classID") +" is added");
});
container.on("dataPropertyChanged",function(data,pro,oldValue,nValue){
    console.log(data.getID()+", "+pro+" changed, ov:"+oldValue+", nv:"+nValue);
});
for(var i=0;i<100;i++){
    var data = new RTData();
    console.info(data)
    data.setValue("classID","class "+i);
    container.addData(data);
}


var mdata = container.getAllData();
console.info("mdata ......",mdata)

var da = container.getDataBy("classID","class 0");
if(da){
    var length = da.length;
    for(var i=0;i<length;i++){
        var data = da[i];
        console.info("data is ....."+ JSON.stringify(data))
        console.log(data.getID()+" classID "+data.getValue("classID"));
        data.setValue("classID","fasdfas");
    }
}

