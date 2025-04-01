"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postUser = exports.getUser = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const db_1 = require("../db/db");
const sharp_1 = __importDefault(require("sharp"));
const getUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const token = res.locals.token;
    try {
        const getUserById = yield db_1.db.execute({
            sql: 'SELECT users.first_name, users.last_name, users.email, users.has_info, users.umc_id, users_info.*, DATE(users_info.birthday) as atay FROM users LEFT JOIN users_info ON users.id = users_info.user_id WHERE users.id = ?',
            args: [token['id']]
        });
        const user = getUserById.rows[0];
        console.log(user);
        res.render('pages/user/index', {
            user: user,
            region: user['region_code'],
            provinces: user['province_code'],
            cities: user['city_code'],
            barangay: user['barangay_code'],
            local_church: user['local_church'],
            episcopal_area: user['episcopal_area']
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getUser = getUser;
const postUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userData = req.body;
    // res.send('yawa')
    // return
    const tx = yield db_1.db.transaction('write');
    if (!tx)
        return next(new Error('Something went wrong'));
    try {
        const fileBuffer = yield (0, sharp_1.default)((_a = req.file) === null || _a === void 0 ? void 0 : _a.buffer)
            // .resize({width : 305, height : 305})
            .toBuffer();
        const getLatestId = yield tx.execute('SELECT IFNULL(MAX(id), 0) as latest_id from users_info');
        const latestIdNumber = getLatestId.rows[0].latest_id;
        const UMCId = `UMC-${new Date().getFullYear()}-${latestIdNumber + 1}`;
        const hash = yield bcrypt_1.default.hash('12345@!', 12);
        const addUser = yield tx.execute({
            sql: 'INSERT INTO users (first_name, last_name, email, password, umc_id, has_info, middle_name ) VALUES (?, ?, ?, ?, ?, ?, ?)',
            args: [
                userData['first_name'],
                userData['last_name'],
                userData['email'],
                hash,
                UMCId,
                1,
                userData['middle_name']
            ]
        });
        const userId = Number(addUser.lastInsertRowid);
        const sql = `INSERT INTO users_info (
      user_id,
      birthday,
      region_code,
      province_code,
      city_code,
      barangay_code,
      address,
      zipcode,
      local_church, 
      local_church_address,
      episcopal_area,
      annual_conference,
      district_conference,
      contact_number,
      emergency_contact_number,
      emergency_contact_name,
      id_picture_blob,
      gender,
      church_position,
      region,
      province,
      city,
      barangay
      )
    VALUES (? , DATE(?), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        const addUserInfo = yield tx.execute({ sql: sql, args: [
                userId,
                userData['birthday'],
                userData['region_code'],
                userData['province_code'],
                userData['city_code'],
                userData['barangay_code'],
                userData['address'],
                userData['zipcode'],
                userData['local_church'],
                userData['local_church_address'],
                userData['episcopal_area'],
                userData['annual_conference'],
                userData['district_conference'],
                userData['contact_number'],
                userData['emergency_contact_number'],
                userData['emergency_contact_name'],
                fileBuffer,
                userData['gender'],
                userData['church_position'],
                userData['region_name'],
                userData['province_name'],
                userData['city_name'],
                userData['barangay_name'],
            ]
        });
        yield tx.commit();
        res.json({ success: true });
    }
    catch (error) {
        yield tx.rollback();
        next(error);
    }
});
exports.postUser = postUser;
