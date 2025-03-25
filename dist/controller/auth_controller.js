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
exports.logOut = exports.postLogin = exports.getLogin = exports.postRegister = exports.getRegister = exports.authMiddleware = void 0;
const express_validator_1 = require("express-validator");
const lib_1 = require("../lib/lib");
const db_1 = require("../db/db");
const bcrypt_1 = __importDefault(require("bcrypt"));
const client_1 = require("@libsql/client");
//TODO: Change auth to express session
// redirect to index if already have a valid token
const authMiddleware = (req, res, next) => {
    const token = req.cookies['token'];
    if (token) {
        (0, lib_1.verifyToken)(token)
            .then((jwt) => {
            res.redirect('/');
        }).catch(() => {
            next();
        });
        return;
    }
    next();
};
exports.authMiddleware = authMiddleware;
const getRegister = (req, res) => {
    res.render('pages/auth/sign-up');
};
exports.getRegister = getRegister;
const postRegister = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const validation = (0, express_validator_1.validationResult)(req);
    if (!validation.isEmpty()) {
        const errors = (0, lib_1.formatValidationError)(validation.array());
        res.status(200).json({ success: false, errors: errors });
        return;
    }
    const data = (0, express_validator_1.matchedData)(req);
    const transaction = yield db_1.db.transaction('write');
    try {
        const lastest_id = yield transaction.execute('SELECT IFNULL(MAX(id), 0) as latest_id from users');
        const latestIdNumber = lastest_id.rows[0].latest_id;
        const formatId = `UMC-${new Date().getFullYear()}-${latestIdNumber + 1}`;
        const hash = yield bcrypt_1.default.hash(data.password, 12);
        const insertUser = yield transaction.execute({
            sql: `INSERT INTO users (first_name, last_name, password, email, umc_id) VALUES (?, ?, ? ,?, ?)`,
            args: [data.first_name, data.last_name, hash, data.email, formatId]
        });
        yield transaction.commit();
        const id = Number(insertUser.lastInsertRowid);
        (0, lib_1.signToken)({ email: data.email, id: id, type: 'user' }).then(jwt => {
            res.cookie('token', jwt, {
                httpOnly: true
            });
            res.location('/');
            res.status(200).json({ success: true });
        })
            .catch(err => next(err));
    }
    catch (error) {
        yield transaction.rollback();
        if (error instanceof client_1.LibsqlError) {
            if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
                res.status(200).json({ success: false, errors: { email: { msg: 'Email already exist!' } } });
            }
        }
        next(error);
        console.log(error);
    }
    finally {
        // transaction.close()
    }
});
exports.postRegister = postRegister;
const getLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.render('pages/auth/login');
});
exports.getLogin = getLogin;
const postLogin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const validation = (0, express_validator_1.validationResult)(req);
    if (!validation.isEmpty()) {
        const errors = (0, lib_1.formatValidationError)(validation.array());
        res.status(200).json({ success: false, code: 'VALIDATION', errors: errors });
        return;
    }
    const data = (0, express_validator_1.matchedData)(req);
    const getUserEmail = yield db_1.db.execute({ sql: 'select * from users where email = ?', args: [data.email] });
    if (getUserEmail.rows.length <= 0) {
        res.status(200).json({ success: false, code: 'CREDENTIAL', msg: 'Invalid Credentials' });
        return;
    }
    const user = getUserEmail.rows[0];
    const match = yield bcrypt_1.default.compare(data.password, user.password);
    if (!match) {
        res.status(200).json({ success: false, code: 'CREDENTIAL', msg: 'Invalid Credentials' });
        return;
    }
    (0, lib_1.signToken)({ email: user.email, id: user.id, type: user.account_type })
        .then(jwt => {
        res.cookie('token', jwt, {
            httpOnly: true
        });
        res.location('/');
        res.status(200).json({ success: true });
    });
    // get user by email
    // connection.query('select * from users where email = ?', [data.email], (err, rows) => {
    //   if(err) { next(err) }
    //   // return fail if no email match
    //   if(rows.length <= 0) {
    //     res.status(200).json({success : false, code : 'CREDENTIAL', msg : 'Invalid Credentials' })
    //     return
    //   }
    //   const user = rows[0]
    //   // compare password
    //   bcrypt.compare(data.password, user.password, (err, match) => {
    //     if(err) { next(err) }
    //     if(!match) {
    //       res.status(200).json({success : false, code : 'CREDENTIAL', msg : 'Invalid Credentials' })
    //       return  
    //     }
    //     // sign token
    //     signToken({email : user.email,  id : user.id, type : user.account_type })
    //       .then(jwt => {
    //         res.cookie('token', jwt, {
    //           httpOnly : true
    //         })
    //         res.location('/')
    //         res.status(200).json({success : true})
    //       })
    //   })
    // })
});
exports.postLogin = postLogin;
const logOut = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('logout');
    res.clearCookie('token');
    res.location('/auth/login');
    res.status(200).json({ success: true });
});
exports.logOut = logOut;
