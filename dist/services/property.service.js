"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RTServer = exports.CCServer = exports.GraphAPI = exports.Application = exports.HttpMethod = exports.Property = exports.PropertyService = void 0;
const path_1 = __importDefault(require("path"));
const logger_service_1 = require("./logger.service");
class PropertyService {
    /**
     * CONSTRUCTOR
     */
    constructor() { }
    /**
     * FETCHES PROPERTIES
     * @returns
     */
    getProperties() {
        try {
            var property = new Property();
            property.application = this.getAppProperties();
            return property;
        }
        catch (error) {
            console.log(`Failed to fetch properties.`, error);
            return new Property();
        }
    }
    getAppProperties() {
        var application = new Application();
        application.port = parseInt(process.env.PORT) || 10001;
        application.serveLogFiles = process.env.SERVE_LOG_FILES?.toUpperCase() === "TRUE" ? true : false;
        application.enableUserAgent = process.env.PRINT_USER_AGENT?.toUpperCase() === "TRUE" ? true : false;
        application.graphApi = this.getAppGraphApiProperties();
        application.logAppender = this.getAppLogProperties();
        application.ccServer = this.getAppCCServerProperties();
        application.rtServer = this.getAppRTServerProperties();
        return application;
    }
    getAppGraphApiProperties() {
        var graphApi = new GraphAPI();
        graphApi.authToken = process.env.GRAPH_API_TOKEN;
        graphApi.verifyToken = process.env.GRAPH_API_WEBHOOK_VERIFY_TOKEN;
        return graphApi;
    }
    getAppCCServerProperties() {
        var ccServer = new CCServer();
        ccServer.ipAddress = process.env.CC_SERVER_IPADDRESS;
        ccServer.port = parseInt(process.env.CC_SERVER_PORT);
        ccServer.suLoginId = process.env.CC_SERVER_SU_LOGIN_ID;
        ccServer.suPassword = process.env.CC_SERVER_SU_PASSWORD;
        return ccServer;
    }
    getAppRTServerProperties() {
        var rtServer = new RTServer();
        rtServer.ipAddress = process.env.RT_SERVER_IPADDRESS;
        rtServer.port = parseInt(process.env.RT_SERVER_PORT);
        return rtServer;
    }
    getAppLogProperties() {
        var logAppender = new logger_service_1.LogAppender();
        logAppender.consoleAppender = this.getAppConsoleLogProperties();
        logAppender.rollingFileAppender = this.getAppRollingFileLogProperties();
        return logAppender;
    }
    getAppConsoleLogProperties() {
        var consoleAppender = new logger_service_1.ConsoleAppender();
        consoleAppender.type = 'stdout';
        consoleAppender.layout = new logger_service_1.AppenderLayout();
        consoleAppender.layout.pattern = process.env.LOG_PATTERN;
        consoleAppender.layout.type = 'pattern';
        return consoleAppender;
    }
    getAppRollingFileLogProperties() {
        var rollingFileAppender = new logger_service_1.RollingFileAppender();
        rollingFileAppender.filename = path_1.default.join(process.cwd(), `logs/${process.env.LOG_FILE_NAME}`);
        rollingFileAppender.maxLogSize = parseInt(process.env.LOG_FILE_SIZE);
        rollingFileAppender.backups = parseInt(process.env.LOG_FILE_BACKUPS);
        rollingFileAppender.type = 'file';
        rollingFileAppender.compress = true;
        rollingFileAppender.layout = new logger_service_1.AppenderLayout();
        rollingFileAppender.layout.pattern = process.env.LOG_PATTERN;
        rollingFileAppender.layout.type = 'pattern';
        return rollingFileAppender;
    }
}
exports.PropertyService = PropertyService;
/**
 * PROPERTY CLASS
 */
class Property {
    application;
}
exports.Property = Property;
class HttpMethod {
    static GET = 'GET';
    static POST = 'POST';
    static PUT = 'PUT';
    static PATCH = 'PATCH';
    static DELETE = 'DELETE';
}
exports.HttpMethod = HttpMethod;
class Application {
    port;
    graphApi;
    logAppender;
    serveLogFiles;
    enableUserAgent;
    ccServer;
    rtServer;
}
exports.Application = Application;
class GraphAPI {
    authToken;
    verifyToken;
}
exports.GraphAPI = GraphAPI;
class CCServer {
    ipAddress;
    port;
    isSsl = true;
    strictSsl = false;
    suLoginId;
    suPassword;
}
exports.CCServer = CCServer;
class RTServer {
    ipAddress;
    port;
    isSsl = true;
    strictSsl = false;
}
exports.RTServer = RTServer;
//# sourceMappingURL=property.service.js.map