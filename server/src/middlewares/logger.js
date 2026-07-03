const requestLogger = (req, res, next) => {
    const time = new Date().toLocaleTimeString();
    console.log(`${time} ${req.method} request made to: ${req.url}`);   

    next();
}

module.exports = requestLogger;