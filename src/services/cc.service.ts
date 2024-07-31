import request from "request";
import { CommonService } from "./common.service";
import { Request } from "./../processors/request.processor";
import { CCServer, Property } from "./property.service";

export class CCService{

    /**
     * CONSTRUCTOR
     * @param common 
     */
    constructor(private common: CommonService) {}

    /**
     * REGISTERS TO CC
     * @returns 
     */
    register(): Promise<HttpResult> {

        return new Promise((resolve: any) => {
            
            var result: HttpResult = new HttpResult();

            var ccServer: CCServer = this.common.property.application.ccServer;
            var protocol: string = ccServer.isSsl === true ? 'https:' : 'http:';
            var domain: string = ccServer.ipAddress + (ccServer.port ? ':'+ccServer.port : '');

            let options = {
                url: `${protocol}//${domain}/radius/cc/aws/register`,
                headers: {
                    'Content-Type': 'application/json'
                },
                strictSSL: this.common.property.application.ccServer.strictSsl
            };
    
            request(options, (error: any, response: any, body: any) => {
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
                    } else {
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
    login(sessionId: any, client: CCClient): Promise<HttpResult> {

        return new Promise((resolve: any) => {

            var result: HttpResult = new HttpResult();

            var ccServer: CCServer = this.common.property.application.ccServer;
            var protocol: string = ccServer.isSsl === true ? 'https:' : 'http:';
            var domain: string = ccServer.ipAddress + (ccServer.port ? ':'+ccServer.port : '');

            Request.Id++;
            let options = {
                url: `${protocol}//${domain}/radius/cc/aws/login`,
                headers: {
                    'Content-Type': 'application/json',
                    'SessionId': sessionId
                },
                strictSSL: this.common.property.application.ccServer.strictSsl,
                json: {
                    ReqId: Request.Id,
                    ReqType: Request.Type.Auth,
                    ReqCode: Request.Code.Login,
                    LoginId: client.Username,
                    Password: client.Password,
                    ClientCode: client.ClientCode,
                    ApplicationCode: client.ApplicationCode,
                    RemoteIP: "127.0.0.1",
                    Device: "Chrome"
                }
            };
    
            request.post(options, (error: any, response: any, body: any) => {
                if (error) {
                    this.common.logger.error(`CC >> Failed to login`, error);
                    result.ResultType = HttpResultType.Failed;
                    result.Exception = error;
                    resolve(result);
                }
    
                if (response) {    
                    this.common.logger.log(`CC >> Logged in`, response);
                    if(typeof response?.body === 'string')
                        response = JSON.parse(response?.body);
                    else
                        response = response?.body;
                    
                    if (response.RespType === "Failed" || response.EvType === "Failed") {
                        result.ResultType = HttpResultType.Failed;
                        result.Exception = response;
                    } else {
                        result.ResultType = HttpResultType.Success;
                        result.Response = response;
                    }
                         
                    resolve(result);
                }
            });
        });

    }

    logout(sessionId: any): Promise<HttpResult> {

        return new Promise((resolve: any) => {

            var result: HttpResult = new HttpResult();

            var ccServer: CCServer = this.common.property.application.ccServer;
            var protocol: string = ccServer.isSsl === true ? 'https:' : 'http:';
            var domain: string = ccServer.ipAddress + (ccServer.port ? ':'+ccServer.port : '');

            Request.Id++;
            let options = {
                url: `${protocol}//${domain}/radius/cc/aws/logout`,
                headers: {
                    'Content-Type': 'application/json',
                    'SessionId': sessionId
                },
                strictSSL: this.common.property.application.ccServer.strictSsl,
                json: {
                    ReqId: Request.Id,
                    ReqType: Request.Type.Auth,
                    ReqCode: Request.Code.Logout
                }
            };
    
            request.post(options, (error: any, response: any, body: any) => {
                if (error) {
                    this.common.logger.error(`CC >> Failed to logout`, error);
                    result.ResultType = HttpResultType.Failed;
                    result.Exception = error;
                    resolve(result);
                }
    
                if (response) {    
                    this.common.logger.log(`CC >> Logged out`, response);
                    if(typeof response?.body === 'string')
                        response = JSON.parse(response?.body);
                    else
                        response = response?.body;
                    
                    if (response.RespType === "Failed" || response.EvType === "Failed") {
                        result.ResultType = HttpResultType.Failed;
                        result.Exception = response;
                    } else {
                        result.ResultType = HttpResultType.Success;
                        result.Response = response;
                    }
                         
                    resolve(result);
                }
            });
        });

    }

    fetch(sessionId: any, reqObj: any): Promise<HttpResult>{

        return new Promise((resolve: any) => {

            var result: HttpResult = new HttpResult();

            var ccServer: CCServer = this.common.property.application.ccServer;
            var protocol: string = ccServer.isSsl === true ? 'https:' : 'http:';
            var domain: string = ccServer.ipAddress + (ccServer.port ? ':'+ccServer.port : '');

            Request.Id++;
            let options = {
                url: `${protocol}//${domain}/radius/cc/aws/fetch`,
                headers: {
                    'Content-Type': 'application/json',
                    'SessionId': sessionId
                },
                strictSSL: this.common.property.application.ccServer.strictSsl,
                json: reqObj
            };
    
            request.post(options, (error: any, response: any, body: any) => {
                console.log(error, response, body);
                
                if (error) {
                    this.common.logger.error(`CC >> Failed to fetch ${reqObj?.EntityName}`, error);
                    result.ResultType = HttpResultType.Failed;
                    result.Exception = error;
                    resolve(result);
                }
    
                if (response) {
                    this.common.logger.log(`CC >> ${reqObj?.EntityName} Fetched`, response);
                    if(typeof response?.body === 'string')
                        response = JSON.parse(response?.body);
                    else
                        response = response?.body;
                    
                    if (response.RespType === "Failed" || response.EvType === "Failed") {
                        result.ResultType = HttpResultType.Failed;
                        result.Exception = response;
                    } else {
                        result.ResultType = HttpResultType.Success;
                        result.Response = response;
                    }
                         
                    resolve(result);
                }
            });
        });

    }

    fetchCTClient(sessionId: any, tenantCode: any = undefined, limit: number = 25, offset: number = 0): Promise<HttpResult>{

        var reqObj: any = {
            ReqId: Request.Id,
            ReqType: Request.Type.Config,
            ReqCode: Request.Code.EntityFetch,
            EntityName: Request.Entity.CTClient,
            OrderBy: [
                {
                    Name: true
                }
            ],
            IncludeCount: true,
            Limit: limit,
            Offset: offset
        };

        var filters: any = {};
        if(tenantCode){
            filters.bycode = [tenantCode];
            reqObj.Filters = filters;
        }

        return this.fetch(sessionId, reqObj);

    }

    fetchCTClientByDB(sessionId: any, databaseId: any = undefined, limit: number = 25, offset: number = 0): Promise<HttpResult>{
        
        var reqObj: any = {
            ReqId: Request.Id,
            ReqType: Request.Type.Config,
            ReqCode: Request.Code.EntityFetch,
            EntityName: Request.Entity.CTClient,
            OrderBy: [
                {
                    Name: true
                }
            ],
            IncludeCount: true,
            Limit: limit,
            Offset: offset
        };

        var filters: any = {};
        if(databaseId){
            filters.byctclientdb = [databaseId];
            reqObj.Filters = filters;
        }

        return this.fetch(sessionId, reqObj);

    }

    fetchCTClientStatus(sessionId: any, tenantId: any): Promise<HttpResult>{

        return new Promise((resolve: any) => {

            var result: HttpResult = new HttpResult();

            var ccServer: CCServer = this.common.property.application.ccServer;
            var protocol: string = ccServer.isSsl === true ? 'https:' : 'http:';
            var domain: string = ccServer.ipAddress + (ccServer.port ? ':'+ccServer.port : '');

            Request.Id++;
            let options = {
                url: `${protocol}//${domain}/radius/cc/aws/fetch`,
                headers: {
                    'Content-Type': 'application/json',
                    'SessionId': sessionId
                },
                strictSSL: this.common.property.application.ccServer.strictSsl,
                json: {
                    ReqId: Request.Id,
                    ReqType: Request.Type.Control,
                    ReqCode: Request.Code.CTClientStatFetch,
                    CTClientId: tenantId?.toString(),
                }
            };
    
            request.post(options, (error: any, response: any, body: any) => {
                console.log(error, response, body);
                
                if (error) {
                    this.common.logger.error(`CC >> Failed to fetch ctclient status`, error);
                    result.ResultType = HttpResultType.Failed;
                    result.Exception = error;
                    resolve(result);
                }
    
                if (response) {
                    this.common.logger.log(`CC >> CTClient status fetched`, response);
                    if(typeof response?.body === 'string')
                        response = JSON.parse(response?.body);
                    else
                        response = response?.body;
                    
                    if (response.RespType === "Failed" || response.EvType === "Failed") {
                        result.ResultType = HttpResultType.Failed;
                        result.Exception = response;
                    } else {
                        result.ResultType = HttpResultType.Success;
                        result.Response = response;
                    }
                         
                    resolve(result);
                }
            });
        });

    }
    
    startCTClient(sessionId: any, tenantId: any): Promise<HttpResult>{

        return new Promise((resolve: any) => {

            var result: HttpResult = new HttpResult();

            var ccServer: CCServer = this.common.property.application.ccServer;
            var protocol: string = ccServer.isSsl === true ? 'https:' : 'http:';
            var domain: string = ccServer.ipAddress + (ccServer.port ? ':'+ccServer.port : '');

            Request.Id++;
            let options = {
                url: `${protocol}//${domain}/radius/cc/aws/fetch`,
                headers: {
                    'Content-Type': 'application/json',
                    'SessionId': sessionId
                },
                strictSSL: this.common.property.application.ccServer.strictSsl,
                json: {
                    ReqId: Request.Id,
                    ReqType: Request.Type.Control,
                    ReqCode: Request.Code.CTClientStart,
                    CTClientId: tenantId?.toString(),
                    UseCoreDB1: true,
                    UseMemDB1: true
                }
            };
  
            request.post(options, (error: any, response: any, body: any) => {
                console.log(error, response, body);
                
                if (error) {
                    this.common.logger.error(`CC >> Failed to start ctclient`, error);
                    result.ResultType = HttpResultType.Failed;
                    result.Exception = error;
                    resolve(result);
                }
    
                if (response) {
                    this.common.logger.log(`CC >> CTClient started`, response);
                    if(typeof response?.body === 'string')
                        response = JSON.parse(response?.body);
                    else
                        response = response?.body;
                    
                    if (response.RespType === "Failed" || response.EvType === "Failed") {
                        result.ResultType = HttpResultType.Failed;
                        result.Exception = response;
                    } else {
                        result.ResultType = HttpResultType.Success;
                        result.Response = response;
                    }
                         
                    resolve(result);
                }
            });
        });
    }
    
    stopCTClient(sessionId: any, tenantId: any): Promise<HttpResult>{

        return new Promise((resolve: any) => {

            var result: HttpResult = new HttpResult();

            var ccServer: CCServer = this.common.property.application.ccServer;
            var protocol: string = ccServer.isSsl === true ? 'https:' : 'http:';
            var domain: string = ccServer.ipAddress + (ccServer.port ? ':'+ccServer.port : '');

            Request.Id++;
            let options = {
                url: `${protocol}//${domain}/radius/cc/aws/fetch`,
                headers: {
                    'Content-Type': 'application/json',
                    'SessionId': sessionId
                },
                strictSSL: this.common.property.application.ccServer.strictSsl,
                json: {
                    ReqId: Request.Id,
                    ReqType: Request.Type.Control,
                    ReqCode: Request.Code.CTClientStop,
                    CTClientId: tenantId?.toString(),
                    UseCoreDB1: true,
                    UseMemDB1: true
                }
            };
  
            request.post(options, (error: any, response: any, body: any) => {
                console.log(error, response, body);
                
                if (error) {
                    this.common.logger.error(`CC >> Failed to stop ctclient`, error);
                    result.ResultType = HttpResultType.Failed;
                    result.Exception = error;
                    resolve(result);
                }
    
                if (response) {
                    this.common.logger.log(`CC >> CTClient stopped`, response);
                    if(typeof response?.body === 'string')
                        response = JSON.parse(response?.body);
                    else
                        response = response?.body;
                    
                    if (response.RespType === "Failed" || response.EvType === "Failed") {
                        result.ResultType = HttpResultType.Failed;
                        result.Exception = response;
                    } else {
                        result.ResultType = HttpResultType.Success;
                        result.Response = response;
                    }
                         
                    resolve(result);
                }
            });
        });
    }
    
    fetchLicense(sessionId: any, tenantId: any): Promise<HttpResult>{

        var reqObj: any = {
            ReqId: Request.Id,
            ReqType: Request.Type.Config,
            ReqCode: Request.Code.EntityFetch,
            EntityName: Request.Entity.License,
            OrderBy: [
                {
                    Id: false
                }
            ],
            IncludeCount: false
        };

        var filters: any = {};
        if(tenantId){
            filters.byctclient = [tenantId];
            reqObj.Filters = filters;
        }

        return this.fetch(sessionId, reqObj);
    }
    
    fetchApplication(sessionId: any, appllicationCode: any = undefined, limit: number = 25, offset: number = 0): Promise<HttpResult>{

        var reqObj: any = {
            ReqId: Request.Id,
            ReqType: Request.Type.Config,
            ReqCode: Request.Code.EntityFetch,
            EntityName: Request.Entity.Application,
            OrderBy: [
                {
                    Name: true
                }
            ],
            IncludeCount: true,
            Limit: limit,
            Offset: offset
        };

        var filters: any = {};
        if(appllicationCode){
            filters.bycode = [appllicationCode];
            reqObj.Filters = filters;
        }

        return this.fetch(sessionId, reqObj);
    }
    
    fetchDatabase(sessionId: any, databaseCode: any = undefined, limit: number = 25, offset: number = 0): Promise<HttpResult>{

        var reqObj: any = {
            ReqId: Request.Id,
            ReqType: Request.Type.Config,
            ReqCode: Request.Code.EntityFetch,
            EntityName: Request.Entity.CTClientDB,
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

        var filters: any = {};
        if(databaseCode){
            filters.bycode = [databaseCode];
            reqObj.Filters = filters;
        }

        return this.fetch(sessionId, reqObj);
    }
    
    fetchCampaign(sessionId: any, campaignCode: any = undefined, limit: number = 25, offset: number = 0): Promise<HttpResult>{

        var reqObj: any = {
            ReqId: Request.Id,
            ReqType: Request.Type.Config,
            ReqCode: Request.Code.EntityFetch,
            EntityName: Request.Entity.Campaign,
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

        var filters: any = {};
        if(campaignCode){
            filters.bycode = [campaignCode];
            reqObj.Filters = filters;
        }

        return this.fetch(sessionId, reqObj);
    }
    
    fetchCampaignProperties(sessionId: any, campaignId: any): Promise<HttpResult>{

        var reqObj: any = {
            ReqId: Request.Id,
            ReqType: Request.Type.Config,
            ReqCode: Request.Code.EntityFetch,
            EntityName: Request.Entity.CampaignProperties,
            Filters: filters,
            IncludeCount: false
        };

        var filters: any = {};
        if(campaignId){
            filters.bycampaign = [campaignId];
            reqObj.Filters = filters;
        }

        return this.fetch(sessionId, reqObj);
    }
    
    fetchCampaignStatus(sessionId: any, campaignId: any): Promise<HttpResult>{
        
        return new Promise((resolve: any) => {

            var result: HttpResult = new HttpResult();

            var ccServer: CCServer = this.common.property.application.ccServer;
            var protocol: string = ccServer.isSsl === true ? 'https:' : 'http:';
            var domain: string = ccServer.ipAddress + (ccServer.port ? ':'+ccServer.port : '');

            Request.Id++;
            let options = {
                url: `${protocol}//${domain}/radius/cc/aws/fetch`,
                headers: {
                    'Content-Type': 'application/json',
                    'SessionId': sessionId
                },
                strictSSL: this.common.property.application.ccServer.strictSsl,
                json: {
                    ReqId: Request.Id,
                    ReqType: Request.Type.Control,
                    ReqCode: Request.Code.CampaignStatFetch,
                    CampaignId: campaignId?.toString(),
                }
            };
  
            request.post(options, (error: any, response: any, body: any) => {
                console.log(error, response, body);
                
                if (error) {
                    this.common.logger.error(`CC >> Failed to fetch campaign status`, error);
                    result.ResultType = HttpResultType.Failed;
                    result.Exception = error;
                    resolve(result);
                }
    
                if (response) {
                    this.common.logger.log(`CC >> Campaign status fetched`, response);
                    if(typeof response?.body === 'string')
                        response = JSON.parse(response?.body);
                    else
                        response = response?.body;
                    
                    if (response.RespType === "Failed" || response.EvType === "Failed") {
                        result.ResultType = HttpResultType.Failed;
                        result.Exception = response;
                    } else {
                        result.ResultType = HttpResultType.Success;
                        result.Response = response;
                    }
                         
                    resolve(result);
                }
            });
        });

    }
    
    startCampaign(sessionId: any, campaignId: any, dialMode: any): Promise<HttpResult>{
        
        return new Promise((resolve: any) => {

            var result: HttpResult = new HttpResult();

            var ccServer: CCServer = this.common.property.application.ccServer;
            var protocol: string = ccServer.isSsl === true ? 'https:' : 'http:';
            var domain: string = ccServer.ipAddress + (ccServer.port ? ':'+ccServer.port : '');

            Request.Id++;
            let options = {
                url: `${protocol}//${domain}/radius/cc/aws/fetch`,
                headers: {
                    'Content-Type': 'application/json',
                    'SessionId': sessionId
                },
                strictSSL: this.common.property.application.ccServer.strictSsl,
                json: {
                    ReqId: Request.Id,
                    ReqType: Request.Type.Control,
                    ReqCode: Request.Code.StartCampaign,
                    DialMode: dialMode?.toString(),
                    CampaignId: campaignId?.toString()
                }
            };
  
            request.post(options, (error: any, response: any, body: any) => {
                console.log(error, response, body);
                
                if (error) {
                    this.common.logger.error(`CC >> Failed to start campaign`, error);
                    result.ResultType = HttpResultType.Failed;
                    result.Exception = error;
                    resolve(result);
                }
    
                if (response) {
                    this.common.logger.log(`CC >> Campaign started`, response);
                    if(typeof response?.body === 'string')
                        response = JSON.parse(response?.body);
                    else
                        response = response?.body;
                    
                    if (response.RespType === "Failed" || response.EvType === "Failed") {
                        result.ResultType = HttpResultType.Failed;
                        result.Exception = response;
                    } else {
                        result.ResultType = HttpResultType.Success;
                        result.Response = response;
                    }
                         
                    resolve(result);
                }
            });
        });

    }
    
    stopCampaign(sessionId: any, campaignId: any): Promise<HttpResult>{
        
        return new Promise((resolve: any) => {

            var result: HttpResult = new HttpResult();

            var ccServer: CCServer = this.common.property.application.ccServer;
            var protocol: string = ccServer.isSsl === true ? 'https:' : 'http:';
            var domain: string = ccServer.ipAddress + (ccServer.port ? ':'+ccServer.port : '');

            Request.Id++;
            let options = {
                url: `${protocol}//${domain}/radius/cc/aws/fetch`,
                headers: {
                    'Content-Type': 'application/json',
                    'SessionId': sessionId
                },
                strictSSL: this.common.property.application.ccServer.strictSsl,
                json: {
                    ReqId: Request.Id,
                    ReqType: Request.Type.Control,
                    ReqCode: Request.Code.StopCampaign,
                    CampaignId: campaignId?.toString(),
                    ForceStop: false
                }
            };
  
            request.post(options, (error: any, response: any, body: any) => {
                console.log(error, response, body);
                
                if (error) {
                    this.common.logger.error(`CC >> Failed to stop campaign`, error);
                    result.ResultType = HttpResultType.Failed;
                    result.Exception = error;
                    resolve(result);
                }
    
                if (response) {
                    this.common.logger.log(`CC >> Campaign stopped`, response);
                    if(typeof response?.body === 'string')
                        response = JSON.parse(response?.body);
                    else
                        response = response?.body;
                    
                    if (response.RespType === "Failed" || response.EvType === "Failed") {
                        result.ResultType = HttpResultType.Failed;
                        result.Exception = response;
                    } else {
                        result.ResultType = HttpResultType.Success;
                        result.Response = response;
                    }
                         
                    resolve(result);
                }
            });
        });

    }
    
    loadCampaign(sessionId: any, campaignId: any): Promise<HttpResult>{
        
        return new Promise((resolve: any) => {

            var result: HttpResult = new HttpResult();

            var ccServer: CCServer = this.common.property.application.ccServer;
            var protocol: string = ccServer.isSsl === true ? 'https:' : 'http:';
            var domain: string = ccServer.ipAddress + (ccServer.port ? ':'+ccServer.port : '');

            Request.Id++;
            let options = {
                url: `${protocol}//${domain}/radius/cc/aws/fetch`,
                headers: {
                    'Content-Type': 'application/json',
                    'SessionId': sessionId
                },
                strictSSL: this.common.property.application.ccServer.strictSsl,
                json: {
                    ReqId: Request.Id,
                    ReqType: Request.Type.Control,
                    ReqCode: Request.Code.LoadCampaign,
                    CampaignId: campaignId?.toString()
                }
            };
  
            request.post(options, (error: any, response: any, body: any) => {
                console.log(error, response, body);
                
                if (error) {
                    this.common.logger.error(`CC >> Failed to load campaign`, error);
                    result.ResultType = HttpResultType.Failed;
                    result.Exception = error;
                    resolve(result);
                }
    
                if (response) {
                    this.common.logger.log(`CC >> Campaign loaded`, response);
                    if(typeof response?.body === 'string')
                        response = JSON.parse(response?.body);
                    else
                        response = response?.body;
                    
                    if (response.RespType === "Failed" || response.EvType === "Failed") {
                        result.ResultType = HttpResultType.Failed;
                        result.Exception = response;
                    } else {
                        result.ResultType = HttpResultType.Success;
                        result.Response = response;
                    }
                         
                    resolve(result);
                }
            });
        });

    }
    
    unloadCampaign(sessionId: any, campaignId: any): Promise<HttpResult>{
        
        return new Promise((resolve: any) => {

            var result: HttpResult = new HttpResult();

            var ccServer: CCServer = this.common.property.application.ccServer;
            var protocol: string = ccServer.isSsl === true ? 'https:' : 'http:';
            var domain: string = ccServer.ipAddress + (ccServer.port ? ':'+ccServer.port : '');

            Request.Id++;
            let options = {
                url: `${protocol}//${domain}/radius/cc/aws/fetch`,
                headers: {
                    'Content-Type': 'application/json',
                    'SessionId': sessionId
                },
                strictSSL: this.common.property.application.ccServer.strictSsl,
                json: {
                    ReqId: Request.Id,
                    ReqType: Request.Type.Control,
                    ReqCode: Request.Code.UnloadCampaign,
                    CampaignId: campaignId?.toString()
                }
            };
  
            request.post(options, (error: any, response: any, body: any) => {
                console.log(error, response, body);
                
                if (error) {
                    this.common.logger.error(`CC >> Failed to unload campaign`, error);
                    result.ResultType = HttpResultType.Failed;
                    result.Exception = error;
                    resolve(result);
                }
    
                if (response) {
                    this.common.logger.log(`CC >> Campaign unloaded`, response);
                    if(typeof response?.body === 'string')
                        response = JSON.parse(response?.body);
                    else
                        response = response?.body;
                    
                    if (response.RespType === "Failed" || response.EvType === "Failed") {
                        result.ResultType = HttpResultType.Failed;
                        result.Exception = response;
                    } else {
                        result.ResultType = HttpResultType.Success;
                        result.Response = response;
                    }
                         
                    resolve(result);
                }
            });
        });

    }
}

/**
 * CCCLIENT CLASS
 */
export class CCClient{
    Username!: string;
    Password!: string;
    ClientCode!: string;
    ApplicationCode!: string;
}

export class HttpResult {
    ResultType!: HttpResultType;
    Response!: any;
    Exception!: any;
}

export enum HttpResultType {
    Failed = "Failed",
    Success = "Success"
}
