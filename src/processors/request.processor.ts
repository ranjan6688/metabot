import express from "express";
import * as httpstatus from "http-status-codes";
import { CommonService } from '../services/common.service';
import { HttpResult, HttpResultType, CCClient } from "../services/cc.service";
import { Response } from "./response.processor";
import axios from "axios";

export class RequestProcessor {

    /**
     * CONSTRUCTOR
     * @param common 
     */
    constructor(private common: CommonService) { }
                
    /**
     * PROCESSING ALL PROPERTIES REQUEST
     * @param request 
     * @param response 
     * @returns 
     */
    processAllPropertiesRequest = async (request: express.Request, response: express.Response) => {
        this.common.logger.log(`Fetching Properties`, request?.body);
        var serverResponse = this.common.responseProcessor.setResponse2(request, response);

        this.common.responseProcessor.setSuccess(Response.Code.EntityFetched, serverResponse);
        serverResponse.Properties = this.common?.property;
        this.common.logger.log(`Properties fetched`, serverResponse);
        return response.json(serverResponse);
    }

    /**
     * PROCESSING FETCH REQUEST
     * @param request 
     * @param response 
     * @returns 
     */
    processFetchRequest = async (request: express.Request, response: express.Response) => {
        this.common.logger.log(`Fetching Report`, request?.body);
        var serverResponse = await this.fetchObservable(request, response);
        this.common.logger.log(`Report fetched`, serverResponse);
        return response.json(serverResponse);
    }

    /**
     * FETCH REQUEST OBSERVABLE
     * @param request 
     * @param response 
     * @returns 
     */
    private fetchObservable(request: express.Request, response: express.Response): any{
        this.common.logger.log(`Fetch request`, request?.body);

        return new Promise(async (resolve: any) => {

            var serverResponse = this.common.responseProcessor.setResponse(request);

            try{

                if(request?.headers?.sessionid){

                    // switch(request?.body?.EntityName?.toLowerCase()){
                    //     case Request.Entity.Campaign.toLowerCase():
                    //         if(request?.body?.UserType?.toLowerCase() === 'agent')
                    //             serverResponse.Entities = await this.common.campaignCtlr.fetchCampaignsByAgent(request);
                    //         else
                    //             serverResponse.Entities = await this.common.campaignCtlr.fetchCampaignsByAdmin(request);
                    //         this.common.responseProcessor.setSuccess(Response.Code.EntityFetched, serverResponse);
                    //         break;
                    //     case Request.Entity.Queue.toLowerCase():
                    //         serverResponse.Entities = await this.common.queueCtlr.fetchQueues(request);
                    //         this.common.responseProcessor.setSuccess(Response.Code.EntityFetched, serverResponse);
                    //         break;
                    //     case Request.Entity.AbandonCall.toLowerCase():
                    //         serverResponse = await this.authenticate(request, response);
                    //         if(serverResponse?.SessionId){
                    //             serverResponse = this.common.responseProcessor.setResponse(request);
                    //             var result: any = await this.common.abandonCallCtlr.fetchAbandonCalls(request);
                    //             if(result?.EvType === Response.Type.Success){
                    //                 serverResponse.Entities = result?.CDRAbandons || [];
                    //                 serverResponse.Entities = serverResponse?.Entities?.filter((s: any) => s.IsDisposed === false);
                    //                 serverResponse.RecordCount = result?.RecordCount || 0;
                    //                 this.common.responseProcessor.setSuccess(Response.Code.EntityFetched, serverResponse);
                    //             }else{
                    //                 this.common.responseProcessor.setError(result, Response.Code.EntityNotFound, httpstatus.OK, serverResponse);
                    //             }
                    //         }else
                    //             this.common.responseProcessor.setError('No session id found!', Response.Code.NoSessionId, httpstatus.OK, serverResponse);
                    //         break;
                    //     case Request.Entity.AbandonCallHistory.toLowerCase():
                    //         serverResponse = await this.common.abandonCallCtlr.fetchDisposedAbandonHistory(request, response);
                    //         break;
                    //     case Request.Entity.Project.toLowerCase():
                    //         serverResponse = await this.common.projectCtlr.fetch(request, response);
                    //         break;
                    //     default:
                    //         this.common.responseProcessor.setError(`Service not found!`, Response.Code.EntityNotFound, httpstatus.OK, serverResponse);
                    //         break;
                    // }

                }else{
                    this.common.responseProcessor.setError('No session id found!', Response.Code.NoSessionId, httpstatus.OK, serverResponse);
                }

            }catch(ex){
                this.common.responseProcessor.setError(ex, Response.Code.FrameworkError, httpstatus.OK, serverResponse);
            }

            this.common.logger.log(`Fetch response`, serverResponse);
            resolve(serverResponse);

        });
    }

    processGraphApiPostWebHook = async (request: express.Request, response: express.Response) => {
        this.common.graphApiController.onWebhookPostMessageRecieved(request, response);
    };

    processGraphApiGetWebHook = async (request: express.Request, response: express.Response) => {
        this.common.graphApiController.onWebhookGetMessageRecieved(request, response);        
    };

    processTestMessage = async (request: express.Request, response: express.Response) => {
        this.common.cmdSvc.onTestMessageRecieved(request, response);        
    };

    /**
     * LOG REQUEST
     * @param request 
     * @param response 
     * @returns 
     */
    processLogRequest = async (request: express.Request, response: express.Response) => {

        this.printLog(this.common.logger, request);

        var requestInfo: any = this.getRequestInfo(request);
        var serverResponse = {RemoteAddress: requestInfo?.remoteAddress, RemotePort: requestInfo?.remotePort, Status: "Success"};
        return response.json(serverResponse);
    };

    processEncryptRequest = async (request: express.Request, response: express.Response) => {

        this.printLog(this.common.logger, request);
        
        var queryText: any = request?.query?.text;
        if(!queryText)
            return response.status(500).send('Invalid input!');
        var encryptedText = this.common.chipherSvc.AESencrypt(queryText);
        return response.status(200).send(encryptedText);
    };

    processDecryptRequest = async (request: express.Request, response: express.Response) => {

        this.printLog(this.common.logger, request);
        
        var queryText: any = request?.query?.text;
        if(!queryText)
            return response.status(500).send('Invalid input!');
        var encryptedText = this.common.chipherSvc.AESdecrypt(queryText);
        return response.status(200).send(encryptedText);
    };
    
    /**
     * FORMATS AND APPEND LOGS
     * @param request 
     */
    private printLog(logger: any, request: express.Request){
        var _request: string = '';

        var requestInfo: any = this.getRequestInfo(request);

        if(request?.body?.timestamp)
        _request += `[${request?.body?.timestamp}]`;

        if(request?.body?.level)
        _request += ` [${request?.body?.level}]`;

        if(request?.body?.fileName){
            var fileSplitArr: string[] = request?.body?.fileName?.split('/');
            if (fileSplitArr.length > 0)
                _request += ` [${fileSplitArr[fileSplitArr.length - 1]}]`;
            else
                _request += ` [${request?.body?.fileName}]`;
        }

        if(request?.body?.lineNumber)
        _request += ` [${request?.body?.lineNumber}]`;

        if(requestInfo?.remoteAddress)
        _request += `[${requestInfo?.remoteAddress}${requestInfo?.remotePort ? ':'+requestInfo?.remotePort : ''}]`;

        var showUserAgent: boolean = this.common.property.application.enableUserAgent;
        if(showUserAgent && requestInfo?.userAgent)
        _request += `[${requestInfo?.userAgent}]`;

        if(request?.body?.message)
        _request += ` - ${showUserAgent ? '\n': ''}${request?.body?.message}`;

        if(request?.body?.additional?.length > 0)
        _request += `\n${JSON.stringify(request?.body?.additional)}`;

        // _request += '\n';

        logger?.debug(_request);
    }

    /**
     * FETCHES CLIENT INFO FROM REQUEST OBJECT
     * @param request 
     * @returns 
     */
    private getRequestInfo(request: express.Request): any {
        return {
            remoteAddress: request.headers['x-forwarded-for'] || request.socket.remoteAddress,
            remotePort: request.headers['x-forwarded-port'] || request.socket.remotePort,
            localAddress: request.socket.localAddress,
            localPort: request.socket.localPort,
            httpVersion: request.httpVersion,
            url: request.url,
            method: request.method,
            baseUrl: request.baseUrl,
            originalUrl: request.originalUrl,
            params: request.params,
            query: request.query,
            body: request?.body,
            userAgent: this.getUseragentInfo(request)
        };
    }

    /**
     * VALIDATES IF VARIABLE ID BOOLEAN TYPE
     * @param val 
     * @returns 
     */
    private isBoolean = (val: any) => 'boolean' === typeof val;

    /**
     * FETHCES USER AGENT INFO FROM REQUEST OBJECT
     * @param request 
     * @returns 
     */
    private getUseragentInfo(request: express.Request){
        var info: any;
        var ua: any = request.useragent;

        if(ua){

            var keys: any[] = Object.keys(ua) || [];
            if(keys.length > 0 && !info)
                info = '';

            keys.forEach((key: string, index: number) => {

                if (this.isBoolean(ua[key])){
                    if(ua[key] === true){
                        info += `${key.replaceAll('is', '')}${index < keys.length - 1 ? ', ' : ''}`;
                    }
                }
                else{
                    if(typeof ua[key] === 'object'){
                        info += `${key} - ${JSON.stringify(ua[key])}${index < keys.length - 1 ? ', ' : ''}`;
                    }else
                        info += `${key} - ${ua[key]}${index < keys.length - 1 ? ', ' : ''}`;
                }
            });
        }

        return info;

    }
}

/**
 * GENARATES RANDOM ID FOR REQUEST ID
 */
var randomId = Math.floor(1000 + Math.random() * 9000);

/**
 * REQUEST OBJECT
 */
export var Request = {
    Id: randomId,
    Type: {
        Auth: "Auth",
        Activity: "Activity",
        Config: "Config",
        Control: "Control"
    },
    Code: {
        Register: "Register",
        Unregister: "Unregister",
        Login: "Login",
        Logout: "Logout",
        RegisterService: "RegisterService",
        PullRtEvents: "PullRtEvents",
        EntityFetch: "EntityFetch",
        CTClientStatFetch: "CTClientStatFetch",
        CTClientStart: "CTClientStart",
        CTClientStop: "CTClientStop",
        AbandonCallFetch: "AbandonCallFetch",
        CallAbandonCancel: "CallAbandonCancel",
        CampaignStatFetch: "CampaignStatFetch",
        StartCampaign: "StartCampaign",
        StopCampaign: "StopCampaign",
        LoadCampaign: "LoadCampaign",
        UnloadCampaign: "UnloadCampaign",
        BargeInCall: "BargeInCall"
    },
    User: {
        Type: {
            Agent: 'Agent',
            Admin: 'Admin'
        }
    },
    Entity: {        
        Campaign: 'Campaign',
        CampaignProperties: 'CampaignProperties',
        CampaignMedia: 'CampaignMedia',
        XServer: 'XServer',
        Queue: 'Queue',
        Project: 'Project',
        AbandonCall: 'AbandonCall',
        AbandonCallHistory: 'AbandonCallHistory',
        CTClient: 'CTClient',
        Application: 'Application',
        CTClientDB: 'CTClientDB',
        License: 'License'
    }
}