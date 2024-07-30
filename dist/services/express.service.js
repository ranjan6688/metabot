"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpressService = void 0;
const express_1 = __importDefault(require("express"));
const useragent = __importStar(require("express-useragent"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const path = __importStar(require("path"));
const serve_index_1 = __importDefault(require("serve-index"));
class ExpressService {
    common;
    /**
     * COMMON VARIABLES
     */
    app;
    router = express_1.default.Router();
    /**
     * CONSTRUCTOR
     * @param common
     */
    constructor(common) {
        this.common = common;
    }
    /**
     * INITIALIZES EXPRESS
     */
    init() {
        this.common.logger.log(`Initiating express server with CORS | UserAgent | JSON body parser enabled`);
        this.app = (0, express_1.default)();
        this.app.use(express_1.default.json());
        this.app.use(useragent.express());
        this.app.use((0, cors_1.default)());
        this.app.use(body_parser_1.default.json());
        this.common.logger.log(`Initiating APIs with express server`);
        this.common.apiSvc.intializeAPIs(this.router);
        this.common.apiSvc.intializeWebHooks(this.app);
        this.app.use(`/logs`, express_1.default.static(path.resolve(process.cwd(), "logs")), (0, serve_index_1.default)(path.resolve(process.cwd(), "logs"), { 'icons': true }));
        this.app.listen(this.common.property.application.port, () => {
            this.common?.logger?.debug(`App listening at *:${this.common.property.application.port}`);
        });
    }
}
exports.ExpressService = ExpressService;
//# sourceMappingURL=express.service.js.map