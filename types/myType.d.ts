// d.ts file treated as ambient(global) so no need to us 'global'
declare module Express {
    interface User {
        id?: string;
        username?:string;
    }

}

// for .ts file
// declare global {
//     module Express {
//         interface User {
//             id?: string;
//             username?:string;
//         }
//     }
// }
