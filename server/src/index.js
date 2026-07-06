require(`dotenv`).config();

const express = require(`express`);
const app = express();
const passport = require('passport');
const cors = require(`cors`);
require('./config/passport');


const connectDB = require(`./config/db.js`);
const userRoutes = require(`./routes/authRoutes.js`);
const msgRoutes = require(`./routes/msgRoutes.js`);
const requestLogger = require(`./middlewares/logger.js`);

app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));


app.use(express.json());
app.use(passport.initialize());
app.use(requestLogger);


app.use("/users", userRoutes);
app.use("/messages", msgRoutes);



connectDB();

const PORT = process.env.PORT || 6000

app.listen(PORT, () => {
    console.log(`Server is listening on ${PORT}`);
})

