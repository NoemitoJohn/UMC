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
exports.adminUserRouter = void 0;
const express_1 = __importDefault(require("express"));
const middleware_1 = require("../../lib/middleware");
const db_1 = require("../../db/db");
const sharp_1 = __importDefault(require("sharp"));
const adminUserRouter = express_1.default.Router();
exports.adminUserRouter = adminUserRouter;
adminUserRouter.use(middleware_1.isAuthenticate);
adminUserRouter.get('/', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log(res.locals)
    const user = res.locals.token;
    const getUsers = yield db_1.db.execute(`
    SELECT u.id, u.umc_id, last_name, first_name, l_c.name as local_church, church_position FROM users_info u_i 
    INNER JOIN users u on u.id = u_i.user_id
    INNER JOIN local_church l_c on l_c.id = u_i.local_church
    WHERE u.has_info = 1
    `);
    res.render('pages/admin/users/index', { user: { type: user.type }, users: getUsers.rows });
}));
adminUserRouter.get('/list', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const getUsers = yield db_1.db.execute('SELECT * FROM users_info');
    }
    catch (error) {
        next(error);
    }
}));
adminUserRouter.get('/print/:id', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const getUser = yield db_1.db.execute(`
      SELECT id_picture_blob as img, 
        u_i.church_position as position,
        u_i.contact_number,
        u.email,
        u_i.emergency_contact_number as e_number,
        u_i.emergency_contact_name as e_name,
        concat_ws(', ', address, barangay, city, province) as address,
        concat_ws(' ', u.last_name, u.first_name) as name
      FROM users_info u_i 
      INNER JOIN users u ON u.id = u_i.user_id WHERE user_id = ${id} `);
        const user = getUser.rows[0];
        const bufferImg = Buffer.from(user.img);
        const img = yield (0, sharp_1.default)(bufferImg).resize({ width: 295, height: 303 }).toBuffer();
        const data = Object.assign(Object.assign({}, user), { img: img.toString('base64') });
        res.render('pages/admin/users/print-id', data);
    }
    catch (error) {
        console.log(error);
    }
}));
adminUserRouter.get('/create', (req, res, next) => {
    const user = res.locals.token;
    res.render('pages/admin/users/create-user', { user: {
            type: user.type
        } });
});
