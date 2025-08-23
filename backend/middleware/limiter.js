const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
    windowMs: 60 * 1000,
    max: 5,
    message: { error: "vous avez dépassé la quantité maximale de requêtes permises, essayez plus tard" },
    standardHeaders: true,
    legacyHeaders: false,
});

module.exports = limiter;
