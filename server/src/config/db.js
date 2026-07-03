const mongoose = require(`mongoose`);

const connectDB = async function(){
    try{
        const conn = await mongoose.connect(process.env.MONGODB_URL);
        console.log(`Database successfully connected`);


    }catch(err){
        console.error(`Connection unsuccessful : ${err}`);
        process.exit(1);
    }
}

module.exports = connectDB;