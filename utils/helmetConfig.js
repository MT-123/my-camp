const helmet = require("helmet");

module.exports.contentSecurityPolicy = helmet.contentSecurityPolicy({
    directives: {
        "script-src": [
            "'self'"
        ],
        "img-src": [
            "'self'",
            "data:",
            "https://images.unsplash.com",
            "https://res.cloudinary.com/",
        ],
    },
});

module.exports.crossOriginEmbedderPolicy = helmet.crossOriginEmbedderPolicy({
    policy: "credentialless"
});
