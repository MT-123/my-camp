declare module 'express' {
    interface ErrorRequestHandler {
        // add properties to original ErrorRequestHandler interface
        statusCode?: number;
        message?: string;
    }
}

// module mode is required. Otherwise, the express will be overwritten by this definition instead of augmentation
export { };
