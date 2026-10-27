const sequelize = require('./src/config/db');
const app = require('./src/app');
require('dotenv').config();

const PORT = process.env.PORT || 3000;

const startServer = async()=>{
    try {
        await sequelize.sync({alter: true});
        console.log('Database connected successfully...');

        app.listen(PORT,()=>{
            console.log(`Server is running on PORT ${PORT}`);
            
        })
        
    } catch (error) {
        console.log("Failed to connect db...");
        
    }
}

startServer();