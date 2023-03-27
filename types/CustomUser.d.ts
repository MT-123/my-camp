declare global {
    namespace Express {
        interface User {
            id?: string;
            username?: string;
        }
    }
}

// the pattern is based on passport merging interface User to the Express
// ref @types/passport/index.d.ts
export { };
