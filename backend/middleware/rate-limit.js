const rateLimit = require('express-rate-limit')

const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, //10 minutes
    max: 2, //Limit each IP to 100 requests per `window` (here, per 10 minutes)
    message: 'Trop de tentatives de connexion, compte bloqué pour 10 minutes',
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

// Apply the rate limiting middleware to all requests
module.exports = {limiter}