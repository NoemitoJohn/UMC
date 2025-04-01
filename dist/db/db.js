"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const client_1 = require("@libsql/client");
exports.db = (0, client_1.createClient)({
    // url: 'file:UMC.db',
    url: process.env.TURSO_URL,
    authToken: process.env.TURSO_TOKEN,
});
// export const connection = mysql.createConnection({
//   host : 'localhost',
//   user : 'root',
//   database : 'UMC',
//   dateStrings : true,
// })
