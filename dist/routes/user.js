"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("../controller/user_controller");
const middleware_1 = require("../lib/middleware");
const lib_1 = require("../lib/lib");
const userRouter = express_1.default.Router();
exports.userRouter = userRouter;
userRouter.use(middleware_1.isAuthenticate);
// userRouter.use('/')
userRouter.get('/info', user_controller_1.getUser);
userRouter.post('/info', lib_1.upload.single('id_img_1x1'), user_controller_1.postUser);
