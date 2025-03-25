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
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuthenticate = exports.accessOnly = void 0;
const lib_1 = require("./lib");
const accessOnly = (type) => {
    return function (req, res, next) {
        const token = req.cookies['token'];
        if (!token) {
            if (req.xhr) {
                res.status(401).json({ msg: 'Unauthorized' });
                return;
            }
            res.send('Unauthorized!');
        }
        (0, lib_1.verifyToken)(token)
            .then((jwt) => {
            if (jwt.payload.type == type) {
                next();
                return;
            }
            if (req.xhr) {
                res.status(401).json({ msg: 'Unauthorized' });
                return;
            }
            res.send('Unauthorized');
        }).catch(() => {
            if (req.xhr) {
                res.status(401).json({ msg: 'Unauthorized' });
                return;
            }
            res.send('Unauthorized');
            // res.status(401).json({msg : 'Unauthorized'})
        });
    };
};
exports.accessOnly = accessOnly;
const isAuthenticate = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.cookies['token'];
    if (!token) {
        if (req.xhr) {
            res.status(401).json({ msg: 'Unauthorized!' });
            return;
        }
        res.redirect('/auth/login');
        return;
    }
    try {
        const { payload } = yield (0, lib_1.verifyToken)(token);
        res.locals.token = payload;
        res.locals.user_type = payload['type'];
        next();
    }
    catch (error) {
        next(error);
    }
});
exports.isAuthenticate = isAuthenticate;
