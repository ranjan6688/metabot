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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Response = exports.ResponseProcessor = void 0;
const httpstatus = __importStar(require("http-status-codes"));
const request_processor_1 = require("../processors/request.processor");
class ResponseProcessor {
    common;
    /**
     * COMMON VARIABLES
     */
    constructor(common) {
        this.common = common;
    }
    /**
     * BUILDS COMMON RESPONSE
     * @param request
     * @param response
     * @returns
     */
    setResponse(request) {
        var serverResponse = {};
        serverResponse.ReqId = request.body.ReqId;
        serverResponse.ReqType = request.body.ReqType;
        serverResponse.ReqCode = request.body.ReqCode;
        if (request.body.EntityName)
            serverResponse.EntityName = request.body.EntityName;
        serverResponse.UserType = request.body.UserType;
        serverResponse.ClientCode = request.body.ClientCode;
        serverResponse.ApplicationCode = request.body.ApplicationCode;
        serverResponse.RespId = exports.Response.Id;
        serverResponse = this.TrimProperties(serverResponse);
        return serverResponse;
    }
    /**
     * BUILDS COMMON RESPONSE
     * @param request
     * @param response
     * @returns
     */
    setResponse2(request, response) {
        var serverResponse = {};
        serverResponse.ReqId = request.body.ReqId;
        serverResponse.ReqType = request.body.ReqType;
        serverResponse.ReqCode = request.body.ReqCode;
        if (request.body.EntityName)
            serverResponse.EntityName = request.body.EntityName;
        if (request.body.ReqCode == request_processor_1.Request.Code.Login) {
            serverResponse.UserType = request.body.UserType;
            serverResponse.ClientCode = request.body.ClientCode;
            serverResponse.ApplicationCode = request.body.ApplicationCode;
        }
        else {
            const authHeader = request.headers['authorization'];
            const authtoken = authHeader && authHeader.split(' ')[1];
            //const accessToken = this.common.accessTokens.find((token: any) => token.Token === authtoken);
            const accessToken = undefined;
            if (accessToken !== undefined) {
                if (accessToken.UserType !== undefined)
                    serverResponse.UserType = accessToken?.UserType;
                if (accessToken.ClientCode !== undefined)
                    serverResponse.ClientCode = accessToken?.ClientCode;
                if (accessToken.ApplicationCode !== undefined)
                    serverResponse.ApplicationCode = accessToken?.ApplicationCode;
            }
        }
        serverResponse.RespId = exports.Response.Id;
        return serverResponse;
    }
    /**
     * BUILDS SUCCESS RESPONSE
     * @param request
     * @param response
     * @returns
     */
    setSuccess(evCode, response) {
        response.RespType = exports.Response.Type.Success;
        response.RespCode = evCode;
    }
    /**
     * BUILDS ERROR RESPONSE
     * @param request
     * @param response
     * @returns
     */
    setError(error, evCode, status, response) {
        response.RespType = exports.Response.Type.Failed;
        response.RespCode = evCode;
        // response.Exception = {};
        if (error) {
            if (typeof error === 'string' || error instanceof String)
                response.Message = error;
            else
                response.Exception = error;
        }
        else {
            response.Status = status;
            response.Message = httpstatus.getStatusText(status);
        }
    }
    /**
     * TRIMS PROPERTIES
     * @param obj
     * @returns
     */
    TrimProperties(obj) {
        Object.keys(obj)?.forEach((key) => {
            if (!obj[key])
                delete obj[key];
        });
        return obj;
    }
}
exports.ResponseProcessor = ResponseProcessor;
/**
 * GENARATES RANDOM ID FOR RESPONSE ID
 */
var randomId = Math.floor(1000 + Math.random() * 9000);
/**
 * RESPONSE OBJECT
 */
exports.Response = {
    Id: randomId,
    Type: {
        Success: "Success",
        Failed: "Failed",
    },
    Code: {
        Registered: "Registered",
        RegisterFailed: "RegisterFailed",
        Loggedin: "UserLoggedIn",
        LoginFailed: "LoginFailed",
        ServiceRegistered: "ServiceRegistered",
        RegisterServiceFailed: "RegisterServiceFailed",
        FetchFailed: "FetchFailed",
        FrameworkError: "FrameworkError",
        ServerError: "ServerError",
        NoSessionId: "NoSessionId",
        DbError: "DbError",
        Unauthorized: "Unauthorized",
        Forbidden: "Forbidden",
        OK: "OK",
        EntityAdded: "EntityAdded",
        EntityAddFailed: "EntityAddFailed",
        EntityEdited: "EntityEdited",
        EntityEditFailed: "EntityEditFailed",
        EntityFetched: "EntityFetched",
        EntityFetchFailed: "EntityFetchFailed",
        EntityDeleted: "EntityDeleted",
        EntityDeleteFailed: "EntityDeleteFailed",
        EntityExists: "EntityExists",
        EntityNotFound: "EntityNotFound",
        LoggedIn: "LoggedIn",
        LogInFailed: "LogInFailed",
        LoggedOut: "LoggedOut",
        LogOutFailed: "LogOutFailed",
        FileUploaded: "FileUploaded",
        FileUploadFailed: "FileUploadFailed",
        Encrypted: "Encrypted",
        Decrypted: "Decrypted",
    }
};
//# sourceMappingURL=response.processor.js.map