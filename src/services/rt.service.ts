import request from "request";
import { CommonService } from "./common.service";
import { Request } from "./../processors/request.processor";
import { RTServer, Property } from "./property.service";

export class RTService {


  constructor(private common: CommonService) {}

  async register(): Promise<HttpResult> {

      return new Promise((resolve: any) => {
          
          var result: HttpResult = new HttpResult();

          var rtServer: RTServer = this.common.property.application.rtServer;
          var protocol: string = rtServer.isSsl === true ? 'https:' : 'http:';
          var domain: string = rtServer.ipAddress + (rtServer.port ? ':'+rtServer.port : '');

          let options = {
              url: `${protocol}//${domain}/radius/rt/register`,
              headers: {
                  'Content-Type': 'application/json'
              },
              strictSSL: this.common.property.application.rtServer.strictSsl
          };
  
          request(options, (error: any, response: any, body: any) => {
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
                  } else {
                      result.ResultType = HttpResultType.Success;
                      result.Response = response;
                  }
                       
                  resolve(result);
              }
          });
      });
  }

  async login(sessionId: any, client: RTClient): Promise<HttpResult> {

      return new Promise((resolve: any) => {

          var result: HttpResult = new HttpResult();

          var rtServer: RTServer = this.common.property.application.rtServer;
          var protocol: string = rtServer.isSsl === true ? 'https:' : 'http:';
          var domain: string = rtServer.ipAddress + (rtServer.port ? ':'+rtServer.port : '');

          Request.Id++;
          let options = {
              url: `${protocol}//${domain}/radius/rt/login`,
              headers: {
                  'Content-Type': 'application/json',
                  'SessionId': sessionId
              },
              strictSSL: this.common.property.application.rtServer.strictSsl,
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
                  this.common.logger.error(`RT >> Failed to login`, error);
                  result.ResultType = HttpResultType.Failed;
                  result.Exception = error;
                  resolve(result);
              }
  
              if (response) {    
                  this.common.logger.log(`RT >> Logged in`, response);
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

  async logout(sessionId: any): Promise<HttpResult> {

      return new Promise((resolve: any) => {

          var result: HttpResult = new HttpResult();

          var rtServer: RTServer = this.common.property.application.rtServer;
          var protocol: string = rtServer.isSsl === true ? 'https:' : 'http:';
          var domain: string = rtServer.ipAddress + (rtServer.port ? ':'+rtServer.port : '');

          Request.Id++;
          let options = {
              url: `${protocol}//${domain}/radius/rt/logout`,
              headers: {
                  'Content-Type': 'application/json',
                  'SessionId': sessionId
              },
              strictSSL: this.common.property.application.rtServer.strictSsl,
              json: {
                  ReqId: Request.Id,
                  ReqType: Request.Type.Auth,
                  ReqCode: Request.Code.Logout
              }
          };
  
          request.post(options, (error: any, response: any, body: any) => {
              if (error) {
                  this.common.logger.error(`RT >> Failed to logout`, error);
                  result.ResultType = HttpResultType.Failed;
                  result.Exception = error;
                  resolve(result);
              }
  
              if (response) {    
                  this.common.logger.log(`RT >> Logged out`, response);
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

  async registerSvc(sessionId: any, service: RtServiceInfo): Promise<HttpResult> {

      return new Promise((resolve: any) => {

          var result: HttpResult = new HttpResult();

          var rtServer: RTServer = this.common.property.application.rtServer;
          var protocol: string = rtServer.isSsl === true ? 'https:' : 'http:';
          var domain: string = rtServer.ipAddress + (rtServer.port ? ':'+rtServer.port : '');

          Request.Id++;
          let options = {
              url: `${protocol}//${domain}/radius/rt/regsrvc`,
              headers: {
                  'Content-Type': 'application/json',
                  'SessionId': sessionId
              },
              strictSSL: this.common.property.application.rtServer.strictSsl,
              json: {
                  ReqId: Request.Id,
                  ReqType: Request.Type.Activity,
                  ReqCode: Request.Code.RegisterService,
                  ClientCode: service.rtClient.ClientCode,
                  ServiceName: service.serviceName
              }
          };
  
          request.post(options, (error: any, response: any, body: any) => {
              if (error) {
                  this.common.logger.error(`RT >> Failed to register service`, error);
                  result.ResultType = HttpResultType.Failed;
                  result.Exception = error;
                  resolve(result);
              }
  
              if (response) {    
                  this.common.logger.log(`RT >> Service registered`, response);
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

  async fetch(sessionId: any): Promise<HttpResult> {

      return new Promise((resolve: any) => {

          var result: HttpResult = new HttpResult();

          var rtServer: RTServer = this.common.property.application.rtServer;
          var protocol: string = rtServer.isSsl === true ? 'https:' : 'http:';
          var domain: string = rtServer.ipAddress + (rtServer.port ? ':'+rtServer.port : '');

          Request.Id++;
          let options = {
              url: `${protocol}//${domain}/radius/rt/fetch`,
              headers: {
                  'Content-Type': 'application/json',
                  'SessionId': sessionId
              },
              strictSSL: this.common.property.application.rtServer.strictSsl,
              json: {
                  ReqId: Request.Id,
                  ReqType: Request.Type.Auth,
                  ReqCode: Request.Code.PullRtEvents
              }
          };
  
          request.post(options, (error: any, response: any, body: any) => {
              if (error) {
                  this.common.logger.error(`RT >> Failed to fetch records`, error);
                  result.ResultType = HttpResultType.Failed;
                  result.Exception = error;
                  resolve(result);
              }
  
              if (response) {    
                  this.common.logger.log(`RT >> Records fetched`, response);
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

export class RTClient{
    Username!: string;
    Password!: string;
    ClientCode!: string;
    ApplicationCode!: string;
}

export class RtServiceInfo{
  rtClient!: RTClient;
  serviceName!: RtService;
}

export class RtService{
  static Agent: string = 'RtAgent';
  static Campaign: string = 'RtCampaign';
  static Call: string = 'RtCall';
  static Chat: string = 'RtChat';
  static Email: string = 'RtEmail';
  static Queue: string = 'RtQueue';
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
