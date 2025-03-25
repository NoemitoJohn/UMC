import { createClient } from "@libsql/client";
// NOTE: no promise base in mysql only callback
import mysql from 'mysql'

export const db = createClient({
  // url: 'file:UMC.db',
  url: 'libsql://umc-noemitojohn.turso.io',
  authToken : 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NDI4ODY5OTIsImlkIjoiZGNlMDc3NWYtM2FjZS00MDcyLThmMTgtOTRjYzRjMmM1NTAyIn0.o6_PTIehl0CUTD5xGQrg25NBGOv3OObOOCkKA2vsmbVdtFj5R3a7RepHjhhz91iByV5u8axYbN64WKRKnhx6DQ'
});


// export const connection = mysql.createConnection({
//   host : 'localhost',
//   user : 'root',
//   database : 'UMC',
//   dateStrings : true,
// })