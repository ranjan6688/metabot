"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CCServer = exports.GraphAPI = exports.Application = exports.HttpMethod = exports.Property = exports.PropertyService = void 0;
const path_1 = __importDefault(require("path"));
const logger_service_1 = require("./logger.service");
const { GRAPH_API_WEBHOOK_VERIFY_TOKEN, GRAPH_API_TOKEN, PORT, CC_SERVER_IPADDRESS, CC_SERVER_PORT, CC_SERVER_SU_LOGIN_ID, CC_SERVER_SU_PASSWORD, LOG_FILE_NAME, LOG_PATTERN, LOG_FILE_SIZE, LOG_FILE_BACKUPS, SERVE_LOG_FILES, PRINT_USER_AGENT } = process.env;
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
        application.port = parseInt(PORT);
        application.serveLogFiles = SERVE_LOG_FILES?.toUpperCase() === "TRUE" ? true : false;
        application.enableUserAgent = PRINT_USER_AGENT?.toUpperCase() === "TRUE" ? true : false;
        application.graphApi = this.getAppGraphApiProperties();
        application.logAppender = this.getAppLogProperties();
        application.ccServer = this.getAppCCServerProperties();
        return application;
    }
    getAppGraphApiProperties() {
        var graphApi = new GraphAPI();
        graphApi.authToken = GRAPH_API_TOKEN;
        graphApi.verifyToken = GRAPH_API_WEBHOOK_VERIFY_TOKEN;
        return graphApi;
    }
    getAppCCServerProperties() {
        var ccServer = new CCServer();
        ccServer.ipAddress = CC_SERVER_IPADDRESS;
        ccServer.port = parseInt(CC_SERVER_PORT);
        ccServer.suLoginId = CC_SERVER_SU_LOGIN_ID;
        ccServer.suPassword = CC_SERVER_SU_PASSWORD;
        return ccServer;
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
        consoleAppender.layout.pattern = LOG_PATTERN;
        consoleAppender.layout.type = 'pattern';
        return consoleAppender;
    }
    getAppRollingFileLogProperties() {
        var rollingFileAppender = new logger_service_1.RollingFileAppender();
        rollingFileAppender.filename = path_1.default.join(process.cwd(), `logs/${LOG_FILE_NAME}`);
        rollingFileAppender.maxLogSize = parseInt(LOG_FILE_SIZE);
        rollingFileAppender.backups = parseInt(LOG_FILE_BACKUPS);
        rollingFileAppender.type = 'file';
        rollingFileAppender.compress = true;
        rollingFileAppender.layout = new logger_service_1.AppenderLayout();
        rollingFileAppender.layout.pattern = LOG_PATTERN;
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
    defAdminLoginId;
    defAdminPassword;
}
exports.CCServer = CCServer;
//# sourceMappingURL=property.service.js.map