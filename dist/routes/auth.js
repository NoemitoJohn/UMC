"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("../controller/auth_controller");
const express_validator_1 = require("express-validator");
const authRouter = express_1.default.Router();
exports.authRouter = authRouter;
// middleware check if already had a valid token and redirect to index
// authRouter.use(authMiddleware)
authRouter.get('/login', auth_controller_1.authMiddleware, auth_controller_1.getLogin);
authRouter.post('/login', [
    (0, express_validator_1.body)('email').isEmail(),
    (0, express_validator_1.body)('password').notEmpty()
], 
//handler
auth_controller_1.authMiddleware, auth_controller_1.postLogin);
authRouter.get('/register', auth_controller_1.authMiddleware, auth_controller_1.getRegister);
authRouter.post('/register', [
    // sanitizing inputs
    (0, express_validator_1.body)('first_name').notEmpty().escape(),
    (0, express_validator_1.body)('last_name').notEmpty().escape(),
    (0, express_validator_1.body)('email').isEmail(),
    (0, express_validator_1.body)('password').isLength({ min: 8 }).escape().withMessage('password must be 8 characters'),
    (0, express_validator_1.body)('confirm_password').custom((value, { req }) => {
        return value === req.body.password;
    }).withMessage('password not match')
], auth_controller_1.authMiddleware, auth_controller_1.postRegister);
authRouter.post('/logout', auth_controller_1.logOut);
