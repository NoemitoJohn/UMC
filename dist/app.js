"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const constant_1 = require("./constant");
const routes_1 = require("./routes");
const helmet_1 = __importDefault(require("helmet"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const auth_1 = require("./routes/auth");
const user_1 = require("./routes/user");
const church_1 = require("./routes/church");
const users_1 = require("./routes/admin/users");
const app = (0, express_1.default)();
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use((0, helmet_1.default)({
    contentSecurityPolicy: {
        directives: {
            'script-src': ["'self'", 'https://cdn.jsdelivr.net/', 'https://cdnjs.cloudflare.com/', 'https://cdn.datatables.net/'],
            'img-src': ["'self'", 'data:', 'blob:'],
            'default-src': ["'self'", 'blob:', 'https:']
        }
    }
}));
const PORT = process.env.PORT || 8000;
app.set('view engine', 'ejs');
app.set('views', constant_1.VIEW_PATH);
app.use('/public', express_1.default.static(constant_1.PUBLIC_PATH));
app.use('/', routes_1.indexRoute);
app.use('/auth', auth_1.authRouter);
app.use('/church', church_1.churchRoute);
app.use('/admin/users', users_1.adminUserRouter);
app.use('/user', user_1.userRouter);
app.use((req, res, next) => {
    res.render('404');
    console.log('Not found!');
});
app.listen(PORT, () => {
    // connection.destroy()
    // connection.connect((err) => {
    //   if(err) { 
    //     console.error('error connecting database: ' + err.stack)
    //     return;
    //   }
    //   console.log('database connected as id ' + connection.threadId);
    // })
    console.log(`running server in port http://localhost:${PORT}`);
});
