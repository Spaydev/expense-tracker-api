const mongoose = require('mongoose');
const MongoConnect  = async(MONGO_URL_CONNECT) => {  
    try {
        await mongoose.connect(MONGO_URL_CONNECT)
        .then((data) => {console.log('MONGOOSE_CONNECT : '+data.connections[0].name); }).catch(err => console.log(err));
    } catch (error) {
        console.log(error);
    }

}
module.exports = MongoConnect;