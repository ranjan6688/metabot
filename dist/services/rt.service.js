"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpResultType = exports.HttpResult = exports.RtService = exports.RtServiceInfo = exports.RTClient = exports.RTService = void 0;
const request_1 = __importDefault(require("request"));
const request_processor_1 = require("./../processors/request.processor");
class RTService {
    common;
    constructor(common) {
        this.common = common;
    }
    async register() {
        return new Promise((resolve) => {
            var result = new HttpResult();
            var rtServer = this.common.property.application.rtServer;
            var protocol = rtServer.isSsl === true ? 'https:' : 'http:';
            var domain = rtServer.ipAddress + (rtServer.port ? ':' + rtServer.port : '');
            let options = {
                url: `${protocol}//${domain}/radius/rt/register`,
                headers: {
                    'Content-Type': 'application/json'
                },
                strictSSL: this.common.property.application.rtServer.strictSsl
            };
            (0, request_1.default)(options, (error, response, body) => {
                if (error) {
                    this.common.logger.error(`RT >> Failed to register`, error);
                    result.ResultType = HttpResultType.Failed;
                    result.Exception = error;
                    resolve(result);
                }
                if (response) {
                    this.common.logger.log(`RT >> Registered`, response);
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
    async login(sessionId, client) {
        return new Promise((resolve) => {
            var result = new HttpResult();
            var rtServer = this.common.property.application.rtServer;
            var protocol = rtServer.isSsl === true ? 'https:' : 'http:';
            var domain = rtServer.ipAddress + (rtServer.port ? ':' + rtServer.port : '');
            request_processor_1.Request.Id++;
            let options = {
                url: `${protocol}//${domain}/radius/rt/login`,
                headers: {
                    'Content-Type': 'application/json',
                    'SessionId': sessionId
                },
                strictSSL: this.common.property.application.rtServer.strictSsl,
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
                    this.common.logger.error(`RT >> Failed to login`, error);
                    result.ResultType = HttpResultType.Failed;
                    result.Exception = error;
                    resolve(result);
                }
                if (response) {
                    this.common.logger.log(`RT >> Logged in`, response);
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
    async logout(sessionId) {
        return new Promise((resolve) => {
            var result = new HttpResult();
            var rtServer = this.common.property.application.rtServer;
            var protocol = rtServer.isSsl === true ? 'https:' : 'http:';
            var domain = rtServer.ipAddress + (rtServer.port ? ':' + rtServer.port : '');
            request_processor_1.Request.Id++;
            let options = {
                url: `${protocol}//${domain}/radius/rt/logout`,
                headers: {
                    'Content-Type': 'application/json',
                    'SessionId': sessionId
                },
                strictSSL: this.common.property.application.rtServer.strictSsl,
                json: {
                    ReqId: request_processor_1.Request.Id,
                    ReqType: request_processor_1.Request.Type.Auth,
                    ReqCode: request_processor_1.Request.Code.Logout
                }
            };
            request_1.default.post(options, (error, response, body) => {
                if (error) {
                    this.common.logger.error(`RT >> Failed to logout`, error);
                    result.ResultType = HttpResultType.Failed;
                    result.Exception = error;
                    resolve(result);
                }
                if (response) {
                    this.common.logger.log(`RT >> Logged out`, response);
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
    async registerSvc(sessionId, service) {
        return new Promise((resolve) => {
            var result = new HttpResult();
            var rtServer = this.common.property.application.rtServer;
            var protocol = rtServer.isSsl === true ? 'https:' : 'http:';
            var domain = rtServer.ipAddress + (rtServer.port ? ':' + rtServer.port : '');
            request_processor_1.Request.Id++;
            let options = {
                url: `${protocol}//${domain}/radius/rt/regsrvc`,
                headers: {
                    'Content-Type': 'application/json',
                    'SessionId': sessionId
                },
                strictSSL: this.common.property.application.rtServer.strictSsl,
                json: {
                    ReqId: request_processor_1.Request.Id,
                    ReqType: request_processor_1.Request.Type.Activity,
                    ReqCode: request_processor_1.Request.Code.RegisterService,
                    ClientCode: service.rtClient.ClientCode,
                    ServiceName: service.serviceName
                }
            };
            request_1.default.post(options, (error, response, body) => {
                if (error) {
                    this.common.logger.error(`RT >> Failed to register service`, error);
                    result.ResultType = HttpResultType.Failed;
                    result.Exception = error;
                    resolve(result);
                }
                if (response) {
                    this.common.logger.log(`RT >> Service registered`, response);
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
    async fetch(sessionId) {
        return new Promise((resolve) => {
            var result = new HttpResult();
            var rtServer = this.common.property.application.rtServer;
            var protocol = rtServer.isSsl === true ? 'https:' : 'http:';
            var domain = rtServer.ipAddress + (rtServer.port ? ':' + rtServer.port : '');
            request_processor_1.Request.Id++;
            let options = {
                url: `${protocol}//${domain}/radius/rt/fetch`,
                headers: {
                    'Content-Type': 'application/json',
                    'SessionId': sessionId
                },
                strictSSL: this.common.property.application.rtServer.strictSsl,
                json: {
                    ReqId: request_processor_1.Request.Id,
                    ReqType: request_processor_1.Request.Type.Auth,
                    ReqCode: request_processor_1.Request.Code.PullRtEvents
                }
            };
            request_1.default.post(options, (error, response, body) => {
                if (error) {
                    this.common.logger.error(`RT >> Failed to fetch records`, error);
                    result.ResultType = HttpResultType.Failed;
                    result.Exception = error;
                    resolve(result);
                }
                if (response) {
                    this.common.logger.log(`RT >> Records fetched`, response);
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
exports.RTService = RTService;
class RTClient {
    Username;
    Password;
    ClientCode;
    ApplicationCode;
}
exports.RTClient = RTClient;
class RtServiceInfo {
    rtClient;
    serviceName;
}
exports.RtServiceInfo = RtServiceInfo;
class RtService {
    static Agent = 'RtAgent';
    static Campaign = 'RtCampaign';
    static Call = 'RtCall';
    static Chat = 'RtChat';
    static Email = 'RtEmail';
    static Queue = 'RtQueue';
}
exports.RtService = RtService;
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
//# sourceMappingURL=rt.service.js.map