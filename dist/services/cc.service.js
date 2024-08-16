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
    logout(sessionId) {
        return new Promise((resolve) => {
            var result = new HttpResult();
            var ccServer = this.common.property.application.ccServer;
            var protocol = ccServer.isSsl === true ? 'https:' : 'http:';
            var domain = ccServer.ipAddress + (ccServer.port ? ':' + ccServer.port : '');
            request_processor_1.Request.Id++;
            let options = {
                url: `${protocol}//${domain}/radius/cc/aws/logout`,
                headers: {
                    'Content-Type': 'application/json',
                    'SessionId': sessionId
                },
                strictSSL: this.common.property.application.ccServer.strictSsl,
                json: {
                    ReqId: request_processor_1.Request.Id,
                    ReqType: request_processor_1.Request.Type.Auth,
                    ReqCode: request_processor_1.Request.Code.Logout
                }
            };
            request_1.default.post(options, (error, response, body) => {
                if (error) {
                    this.common.logger.error(`CC >> Failed to logout`, error);
                    result.ResultType = HttpResultType.Failed;
                    result.Exception = error;
                    resolve(result);
                }
                if (response) {
                    this.common.logger.log(`CC >> Logged out`, response);
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
    fetch(sessionId, reqObj) {
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
                json: reqObj
            };
            request_1.default.post(options, (error, response, body) => {
                console.log(error, response, body);
                if (error) {
                    this.common.logger.error(`CC >> Failed to fetch ${reqObj?.EntityName}`, error);
                    result.ResultType = HttpResultType.Failed;
                    result.Exception = error;
                    resolve(result);
                }
                if (response) {
                    this.common.logger.log(`CC >> ${reqObj?.EntityName} Fetched`, response);
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
    fetchCTClient(sessionId, tenantCode = undefined, limit = 25, offset = 0) {
        var reqObj = {
            ReqId: request_processor_1.Request.Id,
            ReqType: request_processor_1.Request.Type.Config,
            ReqCode: request_processor_1.Request.Code.EntityFetch,
            EntityName: request_processor_1.Request.Entity.CTClient,
            OrderBy: [
                {
                    Name: true
                }
            ],
            IncludeCount: true,
            Limit: limit,
            Offset: offset
        };
        var filters = {};
        if (tenantCode) {
            filters.bycode = [tenantCode];
            reqObj.Filters = filters;
        }
        return this.fetch(sessionId, reqObj);
    }
    fetchCTClientByDB(sessionId, databaseId = undefined, limit = 25, offset = 0) {
        var reqObj = {
            ReqId: request_processor_1.Request.Id,
            ReqType: request_processor_1.Request.Type.Config,
            ReqCode: request_processor_1.Request.Code.EntityFetch,
            EntityName: request_processor_1.Request.Entity.CTClient,
            OrderBy: [
                {
                    Name: true
                }
            ],
            IncludeCount: true,
            Limit: limit,
            Offset: offset
        };
        var filters = {};
        if (databaseId) {
            filters.byctclientdb = [databaseId];
            reqObj.Filters = filters;
        }
        return this.fetch(sessionId, reqObj);
    }
    fetchCTClientStatus(sessionId, tenantId) {
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
                    CTClientId: tenantId?.toString(),
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
    startCTClient(sessionId, tenantId) {
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
                    ReqCode: request_processor_1.Request.Code.CTClientStart,
                    CTClientId: tenantId?.toString(),
                    UseCoreDB1: true,
                    UseMemDB1: true
                }
            };
            request_1.default.post(options, (error, response, body) => {
                console.log(error, response, body);
                if (error) {
                    this.common.logger.error(`CC >> Failed to start ctclient`, error);
                    result.ResultType = HttpResultType.Failed;
                    result.Exception = error;
                    resolve(result);
                }
                if (response) {
                    this.common.logger.log(`CC >> CTClient started`, response);
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
    stopCTClient(sessionId, tenantId) {
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
                    ReqCode: request_processor_1.Request.Code.CTClientStop,
                    CTClientId: tenantId?.toString(),
                    UseCoreDB1: true,
                    UseMemDB1: true
                }
            };
            request_1.default.post(options, (error, response, body) => {
                console.log(error, response, body);
                if (error) {
                    this.common.logger.error(`CC >> Failed to stop ctclient`, error);
                    result.ResultType = HttpResultType.Failed;
                    result.Exception = error;
                    resolve(result);
                }
                if (response) {
                    this.common.logger.log(`CC >> CTClient stopped`, response);
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
    fetchLicense(sessionId, tenantId) {
        var reqObj = {
            ReqId: request_processor_1.Request.Id,
            ReqType: request_processor_1.Request.Type.Config,
            ReqCode: request_processor_1.Request.Code.EntityFetch,
            EntityName: request_processor_1.Request.Entity.License,
            OrderBy: [
                {
                    Id: false
                }
            ],
            IncludeCount: false
        };
        var filters = {};
        if (tenantId) {
            filters.byctclient = [tenantId];
            reqObj.Filters = filters;
        }
        return this.fetch(sessionId, reqObj);
    }
    fetchApplication(sessionId, appllicationCode = undefined, limit = 25, offset = 0) {
        var reqObj = {
            ReqId: request_processor_1.Request.Id,
            ReqType: request_processor_1.Request.Type.Config,
            ReqCode: request_processor_1.Request.Code.EntityFetch,
            EntityName: request_processor_1.Request.Entity.Application,
            OrderBy: [
                {
                    Name: true
                }
            ],
            IncludeCount: true,
            Limit: limit,
            Offset: offset
        };
        var filters = {};
        if (appllicationCode) {
            filters.bycode = [appllicationCode];
            reqObj.Filters = filters;
        }
        return this.fetch(sessionId, reqObj);
    }
    fetchDatabase(sessionId, databaseCode = undefined, limit = 25, offset = 0) {
        var reqObj = {
            ReqId: request_processor_1.Request.Id,
            ReqType: request_processor_1.Request.Type.Config,
            ReqCode: request_processor_1.Request.Code.EntityFetch,
            EntityName: request_processor_1.Request.Entity.CTClientDB,
            Filters: filters,
            OrderBy: [
                {
                    Name: true
                }
            ],
            IncludeCount: true,
            Limit: limit,
            Offset: offset
        };
        var filters = {};
        if (databaseCode) {
            filters.bycode = [databaseCode];
            reqObj.Filters = filters;
        }
        return this.fetch(sessionId, reqObj);
    }
    fetchCampaign(sessionId, campaignCode = undefined, limit = 25, offset = 0) {
        var reqObj = {
            ReqId: request_processor_1.Request.Id,
            ReqType: request_processor_1.Request.Type.Config,
            ReqCode: request_processor_1.Request.Code.EntityFetch,
            EntityName: request_processor_1.Request.Entity.Campaign,
            Filters: filters,
            OrderBy: [
                {
                    Name: true
                }
            ],
            IncludeCount: true,
            Limit: limit,
            Offset: offset
        };
        var filters = {};
        if (campaignCode) {
            filters.bycode = [campaignCode];
            reqObj.Filters = filters;
        }
        return this.fetch(sessionId, reqObj);
    }
    fetchCampaignProperties(sessionId, campaignId) {
        var reqObj = {
            ReqId: request_processor_1.Request.Id,
            ReqType: request_processor_1.Request.Type.Config,
            ReqCode: request_processor_1.Request.Code.EntityFetch,
            EntityName: request_processor_1.Request.Entity.CampaignProperties,
            Filters: filters,
            IncludeCount: false
        };
        var filters = {};
        if (campaignId) {
            filters.bycampaign = [campaignId];
            reqObj.Filters = filters;
        }
        return this.fetch(sessionId, reqObj);
    }
    fetchCampaignStatus(sessionId, campaignId) {
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
                    ReqCode: request_processor_1.Request.Code.CampaignStatFetch,
                    CampaignId: campaignId?.toString(),
                }
            };
            request_1.default.post(options, (error, response, body) => {
                console.log(error, response, body);
                if (error) {
                    this.common.logger.error(`CC >> Failed to fetch campaign status`, error);
                    result.ResultType = HttpResultType.Failed;
                    result.Exception = error;
                    resolve(result);
                }
                if (response) {
                    this.common.logger.log(`CC >> Campaign status fetched`, response);
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
    startCampaign(sessionId, campaignId, dialMode) {
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
                    ReqCode: request_processor_1.Request.Code.StartCampaign,
                    DialMode: dialMode?.toString(),
                    CampaignId: campaignId?.toString()
                }
            };
            request_1.default.post(options, (error, response, body) => {
                console.log(error, response, body);
                if (error) {
                    this.common.logger.error(`CC >> Failed to start campaign`, error);
                    result.ResultType = HttpResultType.Failed;
                    result.Exception = error;
                    resolve(result);
                }
                if (response) {
                    this.common.logger.log(`CC >> Campaign started`, response);
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
    stopCampaign(sessionId, campaignId) {
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
                    ReqCode: request_processor_1.Request.Code.StopCampaign,
                    CampaignId: campaignId?.toString(),
                    ForceStop: false
                }
            };
            request_1.default.post(options, (error, response, body) => {
                console.log(error, response, body);
                if (error) {
                    this.common.logger.error(`CC >> Failed to stop campaign`, error);
                    result.ResultType = HttpResultType.Failed;
                    result.Exception = error;
                    resolve(result);
                }
                if (response) {
                    this.common.logger.log(`CC >> Campaign stopped`, response);
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
    loadCampaign(sessionId, campaignId) {
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
                    ReqCode: request_processor_1.Request.Code.LoadCampaign,
                    CampaignId: campaignId?.toString()
                }
            };
            request_1.default.post(options, (error, response, body) => {
                console.log(error, response, body);
                if (error) {
                    this.common.logger.error(`CC >> Failed to load campaign`, error);
                    result.ResultType = HttpResultType.Failed;
                    result.Exception = error;
                    resolve(result);
                }
                if (response) {
                    this.common.logger.log(`CC >> Campaign loaded`, response);
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
    unloadCampaign(sessionId, campaignId) {
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
                    ReqCode: request_processor_1.Request.Code.UnloadCampaign,
                    CampaignId: campaignId?.toString()
                }
            };
            request_1.default.post(options, (error, response, body) => {
                console.log(error, response, body);
                if (error) {
                    this.common.logger.error(`CC >> Failed to unload campaign`, error);
                    result.ResultType = HttpResultType.Failed;
                    result.Exception = error;
                    resolve(result);
                }
                if (response) {
                    this.common.logger.log(`CC >> Campaign unloaded`, response);
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
    callBargeIn(sessionId, entity, toAddress) {
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
                    ReqCode: request_processor_1.Request.Code.BargeInCall,
                    Address: toAddress,
                    AgentId: entity.CurrAgent.Id.toString(),
                    UxSessID: entity.UCallID
                }
            };
            request_1.default.post(options, (error, response, body) => {
                console.log(error, response, body);
                if (error) {
                    this.common.logger.error(`CC >> Failed to bargein`, error);
                    result.ResultType = HttpResultType.Failed;
                    result.Exception = error;
                    resolve(result);
                }
                if (response) {
                    this.common.logger.log(`CC >> Call barged in`, response);
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