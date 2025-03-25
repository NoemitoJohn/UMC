"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.indexRoute = void 0;
const express_1 = __importDefault(require("express"));
const controller_1 = require("../controller");
const middleware_1 = require("../lib/middleware");
const indexRoute = express_1.default.Router();
exports.indexRoute = indexRoute;
indexRoute.get('/', middleware_1.isAuthenticate, controller_1.getIndex);
