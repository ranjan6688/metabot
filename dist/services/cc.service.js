"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpResultType = exports.HttpResult = exports.CCClient = exports.CCService = void 0;
const request_1 = __importDefault(require("request"));
const request_processor_1 = require("./../processors/request.processor");
class CCService {
    common;
    /**
     * CONSTRUCTOR
     * @param common
     */
    constructor(common) {
        this.common = common;
    }
    /**
     * REGISTERS TO CC
     * @returns
     */
    register() {
        return new Promise((resolve) => {
            var result = new HttpResult();
            var ccServer = this.common.property.application.ccServer;
            var protocol = ccServer.isSsl === true ? 'https:' : 'http:';
            var domain = ccServer.ipAddress + (ccServer.port ? ':' + ccServer.port : '');
            let options = {
                url: `${protocol}//${domain}/radius/cc/aws/register`,
                headers: {
                    'Content-Type': 'application/json'
                },
                strictSSL: this.common.property.application.ccServer.strictSsl
            };
            (0, request_1.default)(options, (error, response, body) => {
                if (error) {
                    this.common.logger.error(`CC >> Failed to register`, error);
                    result.ResultType = HttpResultType.Failed;
                    result.Exception = error;
                    resolve(result);
                }
                if (response) {
                    this.common.logger.log(`CC >> Registered`, response);
                    response = JSON.parse(response?.body);
                    if (response.RespType === "Failed" || response.EvType === "Failed") {
                        result.ResultType = HttpResultType.Failed;
                        result.Exception = response;
                    }
                    else {
                        result.ResultType = HttpResultType.Success;
                        result.Response = response;
                    }
                    resolve(result);
                }
            });
        });
    }
    /**
     * LOGIN TO CC
     * @param sessionId
     * @param reqId
     * @param client
     * @returns
     */
    login(sessionId, client) {
        return new Promise((resolve) => {
            var result = new HttpResult();
            var ccServer = this.common.property.application.ccServer;
            var protocol = ccServer.isSsl === true ? 'https:' : 'http:';
            var domain = ccServer.ipAddress + (ccServer.port ? ':' + ccServer.port : '');
            request_processor_1.Request.Id++;
            let options = {
                url: `${protocol}//${domain}/radius/cc/aws/login`,
                headers: {
                    'Content-Type': 'application/json',
                    'SessionId': sessionId
                },
                strictSSL: this.common.property.application.ccServer.strictSsl,
                json: {
                    ReqId: request_processor_1.Request.Id,
                    ReqType: request_processor_1.Request.Type.Auth,
                    ReqCode: request_processor_1.Request.Code.Login,
                    LoginId: client.Username,
                    Password: client.Password,
                    ClientCode: client.ClientCode,
                    ApplicationCode: client.ApplicationCode,
                    RemoteIP: "127.0.0.1",
                    Device: "Chrome"
                }
            };
            request_1.default.post(options, (error, response, body) => {
                if (error) {
                    this.common.logger.error(`CC >> Failed to login`, error);
                    result.ResultType = HttpResultType.Failed;
                    result.Exception = error;
                    resolve(result);
                }
                if (response) {
                    this.common.logger.log(`CC >> Logged in`, response);
                    if (typeof response?.body === 'string')
                        response = JSON.parse(response?.body);
                    else
                        response = response?.body;
                    if (response.RespType === "Failed" || response.EvType === "Failed") {
                        result.ResultType = HttpResultType.Failed;
                        result.Exception = response;
                    }
                    else {
                        result.ResultType = HttpResultType.Success;
                        result.Response = response;
                    }
                    resolve(result);
                }
            });
        });
    }
    /**
     * FETCH FROM CC
     * @param sessionId
     * @param reqId
     * @param client
     * @returns
     */
    fetch(sessionId, reqObj) {
        return new Promise((resolve) => {
            var result = new HttpResult();
            var ccServer = this.common.property.application.ccServer;
            var protocol = ccServer.isSsl === true ? 'https:' : 'http:';
            var domain = ccServer.ipAddress + (ccServer.port ? ':' + ccServer.port : '');
            let options = {
                url: `${protocol}//${domain}/radius/cc/aws/fetch`,
                headers: {
                    'Content-Type': 'application/json',
                    'SessionId': sessionId
                },
                strictSSL: this.common.property.application.ccServer.strictSsl,
                json: reqObj
            };
            request_1.default.post(options, (error, response, body) => {
                if (error) {
                    this.common.logger.error(`CC >> Failed to fetch`, error);
                    result.ResultType = HttpResultType.Failed;
                    result.Exception = error;
                    resolve(result);
                }
                if (response) {
                    this.common.logger.log(`CC >> Fetched`, response);
                    if (typeof response?.body === 'string')
                        response = JSON.parse(response?.body);
                    else
                        response = response?.body;
                    if (response.RespType === "Failed" || response.EvType === "Failed") {
                        result.ResultType = HttpResultType.Failed;
                        result.Exception = response;
                    }
                    else {
                        result.ResultType = HttpResultType.Success;
                        result.Response = response;
                    }
                    resolve(result);
                }
            });
        });
    }
    fetchCTClient(sessionId, clientCode = undefined, limit = 25, offset = 0) {
        return new Promise((resolve) => {
            var result = new HttpResult();
            var ccServer = this.common.property.application.ccServer;
            var protocol = ccServer.isSsl === true ? 'https:' : 'http:';
            var domain = ccServer.ipAddress + (ccServer.port ? ':' + ccServer.port : '');
            var filters = {};
            if (clientCode)
                filters.bycode = [clientCode];
            request_processor_1.Request.Id++;
            let options = {
                url: `${protocol}//${domain}/radius/cc/aws/fetch`,
                headers: {
                    'Content-Type': 'application/json',
                    'SessionId': sessionId
                },
                strictSSL: this.common.property.application.ccServer.strictSsl,
                json: {
                    ReqId: request_processor_1.Request.Id,
                    ReqType: request_processor_1.Request.Type.Config,
                    ReqCode: request_processor_1.Request.Code.EntityFetch,
                    EntityName: "CTClient",
                    Filters: filters,
                    OrderBy: [
                        {
                            "Name": true
                        }
                    ],
                    IncludeCount: "true",
                    Limit: limit,
                    Offset: offset
                }
            };
            request_1.default.post(options, (error, response, body) => {
                console.log(error, response, body);
                if (error) {
                    this.common.logger.error(`CC >> Failed to fetch ctclient`, error);
                    result.ResultType = HttpResultType.Failed;
                    result.Exception = error;
                    resolve(result);
                }
                if (response) {
                    this.common.logger.log(`CC >> CTClient Fetched`, response);
                    if (typeof response?.body === 'string')
                        response = JSON.parse(response?.body);
                    else
                        response = response?.body;
                    if (response.RespType === "Failed" || response.EvType === "Failed") {
                        result.ResultType = HttpResultType.Failed;
                        result.Exception = response;
                    }
                    else {
                        result.ResultType = HttpResultType.Success;
                        result.Response = response;
                    }
                    resolve(result);
                }
            });
        });
    }
    fetchCTClientStatus(sessionId, clientId) {
        return new Promise((resolve) => {
            var result = new HttpResult();
            var ccServer = this.common.property.application.ccServer;
            var protocol = ccServer.isSsl === true ? 'https:' : 'http:';
            var domain = ccServer.ipAddress + (ccServer.port ? ':' + ccServer.port : '');
            request_processor_1.Request.Id++;
            let options = {
                url: `${protocol}//${domain}/radius/cc/aws/fetch`,
                headers: {
                    'Content-Type': 'application/json',
                    'SessionId': sessionId
                },
                strictSSL: this.common.property.application.ccServer.strictSsl,
                json: {
                    ReqId: request_processor_1.Request.Id,
                    ReqType: request_processor_1.Request.Type.Control,
                    ReqCode: request_processor_1.Request.Code.CTClientStatFetch,
                    CTClientId: clientId?.toString(),
                }
            };
            request_1.default.post(options, (error, response, body) => {
                console.log(error, response, body);
                if (error) {
                    this.common.logger.error(`CC >> Failed to fetch ctclient status`, error);
                    result.ResultType = HttpResultType.Failed;
                    result.Exception = error;
                    resolve(result);
                }
                if (response) {
                    this.common.logger.log(`CC >> CTClient status fetched`, response);
                    if (typeof response?.body === 'string')
                        response = JSON.parse(response?.body);
                    else
                        response = response?.body;
                    if (response.RespType === "Failed" || response.EvType === "Failed") {
                        result.ResultType = HttpResultType.Failed;
                        result.Exception = response;
                    }
                    else {
                        result.ResultType = HttpResultType.Success;
                        result.Response = response;
                    }
                    resolve(result);
                }
            });
        });
    }
}
exports.CCService = CCService;
/**
 * CCCLIENT CLASS
 */
class CCClient {
    Username;
    Password;
    ClientCode;
    ApplicationCode;
}
exports.CCClient = CCClient;
class HttpResult {
    ResultType;
    Response;
    Exception;
}
exports.HttpResult = HttpResult;
var HttpResultType;
(function (HttpResultType) {
    HttpResultType["Failed"] = "Failed";
    HttpResultType["Success"] = "Success";
})(HttpResultType || (exports.HttpResultType = HttpResultType = {}));
//# sourceMappingURL=cc.service.js.map