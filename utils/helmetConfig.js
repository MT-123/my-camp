const helmet = require("helmet");

module.exports= helmet.contentSecurityPolicy({
    directives: {
        "script-src": [
            "'self'",
            "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/"
        ],
        "img-src": [
            "'self'",
            "data:",
            "https://images.unsplash.com",
            "https://res.cloudinary.com/",
        ],
    },
})
