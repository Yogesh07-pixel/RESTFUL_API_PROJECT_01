const mongoose = require("mongoose");

async function connectmongoDB(url){
    return mongoose.connect(url);
      
}

module.exports = {
    connectmongoDB,
}