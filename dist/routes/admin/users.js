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
const adminUserRouter = express_1.default.Router();
exports.adminUserRouter = adminUserRouter;
adminUserRouter.use(middleware_1.isAuthenticate);
adminUserRouter.get('/', (req, res, next) => {
    // console.log(res.locals)
    const user = res.locals.token;
    res.render('pages/admin/users/index', { user: { type: user.type } });
});
adminUserRouter.get('/list', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
}));
adminUserRouter.get('/create', (req, res, next) => {
    const user = res.locals.token;
    res.render('pages/admin/users/create-user', { user: {
            // has_info : null,
            type: user.type
        } });
});
