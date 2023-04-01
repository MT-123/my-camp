//setup types and interfaces
import { Request, Response, NextFunction } from "express";
type Fn = (req: Request, res: Response, next: NextFunction) => any;

function wrapAsync(fn: Fn) {
    return (req: Request, res: Response, next: NextFunction) => {
        fn(req, res, next).catch((e: any) => {
            return next(e);
        });
    }
};

module.exports = wrapAsync;
export { };
