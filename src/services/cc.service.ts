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

    /**
     * FETCH FROM CC
     * @param sessionId 
     * @param reqId 
     * @param client 
     * @returns 
     */
    fetch(sessionId: any, reqObj: any): Promise<HttpResult> {

        return new Promise((resolve: any) => {

            var result: HttpResult = new HttpResult();

            var ccServer: CCServer = this.common.property.application.ccServer;
            var protocol: string = ccServer.isSsl === true ? 'https:' : 'http:';
            var domain: string = ccServer.ipAddress + (ccServer.port ? ':'+ccServer.port : '');

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
                if (error) {
                    this.common.logger.error(`CC >> Failed to fetch`, error);
                    result.ResultType = HttpResultType.Failed;
                    result.Exception = error;
                    resolve(result);
                }
    
                if (response) {
                    this.common.logger.log(`CC >> Fetched`, response);

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

        return new Promise((resolve: any) => {

            var result: HttpResult = new HttpResult();

            var ccServer: CCServer = this.common.property.application.ccServer;
            var protocol: string = ccServer.isSsl === true ? 'https:' : 'http:';
            var domain: string = ccServer.ipAddress + (ccServer.port ? ':'+ccServer.port : '');
            var filters: any = {};
            if(tenantCode)
                filters.bycode = [tenantCode];

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
                    ReqType: Request.Type.Config,
                    ReqCode: Request.Code.EntityFetch,
                    EntityName: Request.Entity.CTClient,
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
    
            request.post(options, (error: any, response: any, body: any) => {
                console.log(error, response, body);
                
                if (error) {
                    this.common.logger.error(`CC >> Failed to fetch ctclient`, error);
                    result.ResultType = HttpResultType.Failed;
                    result.Exception = error;
                    resolve(result);
                }
    
                if (response) {
                    this.common.logger.log(`CC >> CTClient Fetched`, response);
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

    fetchCTClientByDB(sessionId: any, databaseId: any = undefined, limit: number = 25, offset: number = 0): Promise<HttpResult>{

        return new Promise((resolve: any) => {

            var result: HttpResult = new HttpResult();

            var ccServer: CCServer = this.common.property.application.ccServer;
            var protocol: string = ccServer.isSsl === true ? 'https:' : 'http:';
            var domain: string = ccServer.ipAddress + (ccServer.port ? ':'+ccServer.port : '');
            var filters: any = {};
            if(databaseId)
                filters.byctclientdb = [databaseId];

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
                    ReqType: Request.Type.Config,
                    ReqCode: Request.Code.EntityFetch,
                    EntityName: Request.Entity.CTClient,
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
    
            request.post(options, (error: any, response: any, body: any) => {
                console.log(error, response, body);
                
                if (error) {
                    this.common.logger.error(`CC >> Failed to fetch ctclient`, error);
                    result.ResultType = HttpResultType.Failed;
                    result.Exception = error;
                    resolve(result);
                }
    
                if (response) {
                    this.common.logger.log(`CC >> CTClient Fetched`, response);
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

        return new Promise((resolve: any) => {

            var result: HttpResult = new HttpResult();

            var ccServer: CCServer = this.common.property.application.ccServer;
            var protocol: string = ccServer.isSsl === true ? 'https:' : 'http:';
            var domain: string = ccServer.ipAddress + (ccServer.port ? ':'+ccServer.port : '');
            var filters: any = {};
            if(tenantId)
                filters.byctclient = [tenantId];

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
                    ReqType: Request.Type.Config,
                    ReqCode: Request.Code.EntityFetch,
                    EntityName: Request.Entity.License,
                    Filters: filters,
                    OrderBy: [
                        {
                            Id: false
                        }
                    ],
                    IncludeCount: false
                }
            };
  
            request.post(options, (error: any, response: any, body: any) => {
                console.log(error, response, body);
                
                if (error) {
                    this.common.logger.error(`CC >> Failed to fetch database`, error);
                    result.ResultType = HttpResultType.Failed;
                    result.Exception = error;
                    resolve(result);
                }
    
                if (response) {
                    this.common.logger.log(`CC >> Database fetched`, response);
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
    
    fetchApplication(sessionId: any, appllicationCode: any = undefined, limit: number = 25, offset: number = 0): Promise<HttpResult>{

        return new Promise((resolve: any) => {

            var result: HttpResult = new HttpResult();

            var ccServer: CCServer = this.common.property.application.ccServer;
            var protocol: string = ccServer.isSsl === true ? 'https:' : 'http:';
            var domain: string = ccServer.ipAddress + (ccServer.port ? ':'+ccServer.port : '');
            var filters: any = {};
            if(appllicationCode)
                filters.bycode = [appllicationCode];

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
                    ReqType: Request.Type.Config,
                    ReqCode: Request.Code.EntityFetch,
                    EntityName: Request.Entity.Application,
                    Filters: filters,
                    OrderBy: [
                        {
                            Name: true
                        }
                    ],
                    IncludeCount: true,
                    Limit: limit,
                    Offset: offset
                }
            };
  
            request.post(options, (error: any, response: any, body: any) => {
                console.log(error, response, body);
                
                if (error) {
                    this.common.logger.error(`CC >> Failed to fetch application`, error);
                    result.ResultType = HttpResultType.Failed;
                    result.Exception = error;
                    resolve(result);
                }
    
                if (response) {
                    this.common.logger.log(`CC >> Application fetched`, response);
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
    
    fetchDatabase(sessionId: any, databaseCode: any = undefined, limit: number = 25, offset: number = 0): Promise<HttpResult>{

        return new Promise((resolve: any) => {

            var result: HttpResult = new HttpResult();

            var ccServer: CCServer = this.common.property.application.ccServer;
            var protocol: string = ccServer.isSsl === true ? 'https:' : 'http:';
            var domain: string = ccServer.ipAddress + (ccServer.port ? ':'+ccServer.port : '');
            var filters: any = {};
            if(databaseCode)
                filters.bycode = [databaseCode];

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
                }
            };
  
            request.post(options, (error: any, response: any, body: any) => {
                console.log(error, response, body);
                
                if (error) {
                    this.common.logger.error(`CC >> Failed to fetch database`, error);
                    result.ResultType = HttpResultType.Failed;
                    result.Exception = error;
                    resolve(result);
                }
    
                if (response) {
                    this.common.logger.log(`CC >> Database fetched`, response);
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
