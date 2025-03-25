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
exports.churchRoute = void 0;
const express_1 = __importDefault(require("express"));
const db_1 = require("../db/db");
const churchRoute = express_1.default.Router();
exports.churchRoute = churchRoute;
churchRoute.get('/', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const getLocalChurch = yield db_1.db.execute('SELECT * from local_church');
        res.status(200).json(getLocalChurch.rows);
    }
    catch (error) {
        next(error);
    }
}));
churchRoute.post('/', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const addLocalChurch = yield db_1.db.execute({ sql: 'INSERT INTO local_church (name) VALUES (?)', args: [req.body.name] });
        res.status(200).json({ id: Number(addLocalChurch.lastInsertRowid), name: req.body.name });
    }
    catch (error) {
        next(error);
    }
}));
churchRoute.post('/episcopal_area', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const addEpiscopalArea = yield db_1.db.execute({ sql: 'INSERT INTO episcopal_area (name) VALUES (?)', args: [req.body.name] });
        res.status(200).json({ id: Number(addEpiscopalArea.lastInsertRowid), name: req.body.name });
    }
    catch (error) {
        next(error);
    }
}));
churchRoute.get('/episcopal_area', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const getEpiscopalArea = yield db_1.db.execute('SELECT * FROM episcopal_area');
        res.status(200).json(getEpiscopalArea.rows);
    }
    catch (error) {
        next(error);
    }
}));
churchRoute.get('/annual_conference', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const getAnnualConference = yield db_1.db.execute('SELECT * FROM annual_conference');
        res.status(200).json(getAnnualConference.rows);
    }
    catch (error) {
        next(error);
    }
}));
churchRoute.post('/annual_conference', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const addAnnualConference = yield db_1.db.execute({ sql: 'INSERT INTO annual_conference (name) VALUES (?)', args: [req.body.name] });
        res.status(200).json({ id: Number(addAnnualConference.lastInsertRowid), name: req.body.name });
    }
    catch (error) {
        next(error);
    }
}));
churchRoute.post('/district_conference', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const addDistrictConference = yield db_1.db.execute({ sql: 'INSERT INTO district_conference (name) VALUES (?)', args: [req.body.name] });
        res.status(200).json({ id: Number(addDistrictConference.lastInsertRowid), name: req.body.name });
    }
    catch (error) {
        next(error);
    }
}));
churchRoute.get('/district_conference', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const getDistrictConference = yield db_1.db.execute('SELECT * FROM district_conference');
    res.status(200).json(getDistrictConference.rows);
}));
