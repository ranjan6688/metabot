"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WIDGET_NAME = exports.CommonService = void 0;
const express_1 = __importDefault(require("express"));
const moment_1 = __importDefault(require("moment"));
const property_service_1 = require("./property.service");
const request_processor_1 = require("../processors/request.processor");
const response_processor_1 = require("../processors/response.processor");
const logger_service_1 = require("./logger.service");
const api_service_1 = require("./api.service");
const cc_service_1 = require("./cc.service");
const express_service_1 = require("./express.service");
const graphapi_controller_1 = require("./../controllers/graphapi.controller");
class CommonService {
    /**
     * COMMON VARIABLES
     */
    router = express_1.default.Router();
    property;
    ipAddress;
    /**
     * PROCESSORS
     */
    requestProcessor;
    responseProcessor;
    /**
     * CONTROLLERS
     */
    graphApiController;
    /**
     * SERVICES
     */
    apiSvc;
    expressSvc;
    ccSvc;
    /**
     * LOGGER
     */
    logger;
    /**
     * CONSTRUCTOR
     */
    constructor() {
        this.initialize();
    }
    /**
     * INITIATES ALL SERVICES | CONTROLLERS | PROCESSORS
     * @returns
     */
    async initialize() {
        console.log(`ABANDON >>> COMMON SERVICE >>> Initiating Property Service and Reading Properties`);
        this.property = new property_service_1.PropertyService().getProperties();
        console.log(`ABANDON >>> COMMON SERVICE >>> Properties`, this.property);
        console.log(`ABANDON >>> COMMON SERVICE >>> Initiating Logger Service`);
        this.logger = new logger_service_1.LoggerService();
        console.log(`ABANDON >>> COMMON SERVICE >>> Initiating Application Logger`);
        if (!this.initializeLogger(this.property?.application?.logAppender, this.logger))
            return console.log(`COMMON SERVICE >>> Failed to initialize Application Logger! Check log configuration!!`);
        this.logger?.debug(`Initiating Request Processor`);
        this.requestProcessor = new request_processor_1.RequestProcessor(this);
        this.logger?.debug(`Initiating Response Processor`);
        this.responseProcessor = new response_processor_1.ResponseProcessor(this);
        this.logger?.debug(`Initiating Controllers`);
        this.graphApiController = new graphapi_controller_1.GraphApiController(this);
        this.logger?.debug(`Initiating Services`);
        this.apiSvc = new api_service_1.APIService(this);
        this.ccSvc = new cc_service_1.CCService(this);
        this.expressSvc = new express_service_1.ExpressService(this);
        this.expressSvc.init();
    }
    /**
     * INITILIZES LOGGER
     * @param logAppender
     * @param logger
     * @returns
     */
    initializeLogger(logAppender, logger, customFormat = true) {
        if (!logAppender)
            return false;
        var config = new logger_service_1.LogConfig();
        config.customFormat = customFormat;
        config.type = logger_service_1.LogType.Multi;
        config.options = new logger_service_1.LogOptions();
        config.options.console = new logger_service_1.ConsoleLogOptions();
        config.options.file = new logger_service_1.FileLogOptions();
        config.options.file.filename = logAppender.rollingFileAppender.filename;
        config.options.file.maxfiles = logAppender.rollingFileAppender.backups;
        config.options.file.maxsize = logAppender.rollingFileAppender.maxLogSize;
        return logger.configure(config);
    }
    getUniqueArray(arrayObject, property) {
        return [...new Map(arrayObject.map((item) => [item[property], item])).values()];
    }
    /**
     * SORT ARRAY OF OBJECTS BY A PROPERTY
     * @param arrayObject
     * @param property
     * @returns
     */
    sortByProperty(arrayObject, property) {
        return arrayObject.sort((a, b) => (a[property] > b[property]) ? 1 : ((b[property] > a[property]) ? -1 : 0));
    }
    ;
    /**
     * SORT ASC ARRAY OF OBJECTS BY DATE
     * @param arrayObject
     * @param property
     * @returns
     */
    sortAscByDate(arrayObject, property) {
        return arrayObject.sort((a, b) => (0, moment_1.default)(a[property], 'MMM DD, YYYY hh:mm:ss A').valueOf() - (0, moment_1.default)(b[property], 'MMM DD, YYYY hh:mm:ss A').valueOf());
    }
    ;
    /**
     * SORT DESC ARRAY OF OBJECTS BY DATE
     * @param arrayObject
     * @param property
     * @returns
     */
    sortDescByDate(arrayObject, property) {
        return arrayObject.sort((a, b) => (0, moment_1.default)(b[property], 'MMM DD, YYYY hh:mm:ss A').valueOf() - (0, moment_1.default)(a[property], 'MMM DD, YYYY hh:mm:ss A').valueOf());
    }
    ;
}
exports.CommonService = CommonService;
class WIDGET_NAME {
    static AbandonCallHistory = 'abandoncallhistory';
    static CampaignStatus = 'campaignstatus';
    static CampaignSummary = 'campaignsummary';
    static AgentStatus = 'agentstatus';
    static OtherAgentStatus = 'otheragentstatus';
    static AgentSummary = 'agentsummary';
    static AgentSummaryChannelWise = 'agentsummarychannelwise';
    static CallStatus = 'callstatus';
    static CallSummary = 'callsummary';
    static ChatStatus = 'chatstatus';
    static ChatSummary = 'chatsummary';
    static EmailStatus = 'emailstatus';
    static EmailSummary = 'emailsummary';
    static QueueStatus = 'queuestatus';
}
exports.WIDGET_NAME = WIDGET_NAME;
//# sourceMappingURL=common.service.js.map