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

    fetchCTClient(sessionId: any, clientCode: string): Promise<HttpResult>{

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
                    ReqType: Request.Type.Config,
                    ReqCode: Request.Code.EntityFetch,
                    EntityName: "CTClient",
                    Filters: {
                        "bycode": [clientCode]
                    },
                    OrderBy: [
                        {
                            "Name": true
                        }
                    ],
                    IncludeCount: "true",
                    Limit: 25,
                    Offset: 0
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
