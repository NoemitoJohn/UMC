import { createClient } from "@libsql/client";
// NOTE: no promise base in mysql only callback
import mysql from 'mysql'

export const db = createClient({
  // url: 'file:UMC.db',
  url: process.env.TURSO_URL as string,
  authToken : process.env.TURSO_TOKEN,
});


// export const connection = mysql.createConnection({
//   host : 'localhost',
//   user : 'root',
//   database : 'UMC',
//   dateStrings : true,
// })