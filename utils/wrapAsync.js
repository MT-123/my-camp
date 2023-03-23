"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function wrapAsync(fn) {
    return (req, res, next) => {
        fn(req, res, next).catch((e) => {
            return next(e);
        });
    };
}
;
module.exports = wrapAsync;
//# sourceMappingURL=wrapAsync.js.map