import express from "express";
import * as httpstatus from "http-status-codes";
import { CommonService } from "../services/common.service";
import { Request } from "../processors/request.processor";

export class ResponseProcessor{
    
    /**
     * COMMON VARIABLES
     */
    constructor(private common: CommonService){}  

    /**
     * BUILDS COMMON RESPONSE
     * @param request 
     * @param response 
     * @returns 
     */
    public setResponse(request: any): any {

        var serverResponse: any = {};
        serverResponse.ReqId = request.body.ReqId;
        serverResponse.ReqType = request.body.ReqType;
        serverResponse.ReqCode = request.body.ReqCode;
        if (request.body.EntityName)
            serverResponse.EntityName = request.body.EntityName;

        serverResponse.UserType = request.body.UserType;
        serverResponse.ClientCode = request.body.ClientCode;
        serverResponse.ApplicationCode = request.body.ApplicationCode;

        serverResponse.RespId = Response.Id;
        serverResponse = this.TrimProperties(serverResponse);
        return serverResponse;
    }

    /**
     * BUILDS COMMON RESPONSE
     * @param request 
     * @param response 
     * @returns 
     */
    public setResponse2(request: express.Request, response: express.Response) :  any{

        var serverResponse: any = {};
        serverResponse.ReqId = request.body.ReqId;
        serverResponse.ReqType = request.body.ReqType;
        serverResponse.ReqCode = request.body.ReqCode;
        if(request.body.EntityName)
            serverResponse.EntityName = request.body.EntityName;

        if(request.body.ReqCode == Request.Code.Login)
        {
            serverResponse.UserType = request.body.UserType;
            serverResponse.ClientCode = request.body.ClientCode;
            serverResponse.ApplicationCode = request.body.ApplicationCode;
        }
        else{
            const authHeader = request.headers['authorization'];
            const authtoken = authHeader && authHeader.split(' ')[1];
            //const accessToken = this.common.accessTokens.find((token: any) => token.Token === authtoken);
            const accessToken: any = undefined;
            if(accessToken !== undefined)
            {
                if(accessToken.UserType !== undefined)
                    serverResponse.UserType = accessToken?.UserType;
                if(accessToken.ClientCode !== undefined)
                    serverResponse.ClientCode = accessToken?.ClientCode;
                if(accessToken.ApplicationCode !== undefined)
                    serverResponse.ApplicationCode = accessToken?.ApplicationCode;
            }
        }
        
        serverResponse.RespId = Response.Id;

        return serverResponse;
    }

    /**
     * BUILDS SUCCESS RESPONSE
     * @param request 
     * @param response 
     * @returns 
     */
    public setSuccess(evCode: any, response: any) {
        response.RespType = Response.Type.Success;
        response.RespCode = evCode;
    }
    
    /**
     * BUILDS ERROR RESPONSE
     * @param request 
     * @param response 
     * @returns 
     */
    public setError(error: any, evCode: any, status: any, response: any) {
        response.RespType = Response.Type.Failed;
        response.RespCode = evCode;
        // response.Exception = {};
        
        if (error) {
            if (typeof error === 'string' || error instanceof String)
                response.Message = error;
            else
                response.Exception = error;
        }
        else{
            response.Status = status;
            response.Message = httpstatus.getStatusText(status);
        }
    }

    /**
     * TRIMS PROPERTIES
     * @param obj 
     * @returns 
     */
    private TrimProperties(obj: any){
        Object.keys(obj)?.forEach((key: any) => {
            if(!obj[key])
                delete obj[key];
        });

        return obj;
    }
}

/**
 * GENARATES RANDOM ID FOR RESPONSE ID
 */
var randomId = Math.floor(1000 + Math.random() * 9000);

/**
 * RESPONSE OBJECT
 */
export var Response = {
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