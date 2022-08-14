const rateLimit = require('express-rate-limit')

//blocks requests based on IP address!
const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, //10 minutes
    max: 5, //Limit each IP to 5 requests per `window` (here, per 10 minutes)
    message: 'Trop de tentatives de connexion, compte bloqué pour 10 minutes',
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

// Apply the rate limiting middleware to all requests
module.exports = {limiter}