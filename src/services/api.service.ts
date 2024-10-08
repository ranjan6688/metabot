import express from "express";
import { CommonService } from "./common.service";

export class APIService {

    /**
     * COMMON VARIABLES
     */
    public uploader: any;

    /**
     * CONSTRUCTOR
     * @param common 
     */
    constructor(private common: CommonService) { }

    /**
     * INITIATES ROUTES
     * @param router 
     */
    public intializeAPIs(router: any) {
        
        router.post('/api/log', (request: express.Request, response: express.Response) => {
            this.common.requestProcessor.processLogRequest(request, response);
        });

        router.get('/api/encrypt', (request: express.Request, response: express.Response) => {
            this.common.requestProcessor.processEncryptRequest(request, response);
        });

        router.get('/api/decrypt', (request: express.Request, response: express.Response) => {
            this.common.requestProcessor.processDecryptRequest(request, response);
        });
        
    }
    
    /**
     * INITIATES WEBHOOKS
     * @param router 
     */
    public intializeWebHooks(router: any) {

        router.get('/', (request: express.Request, response: express.Response) => {
            response.send(`<pre>Nothing to see here. Checkout README.md to start.</pre>`);
        });
                
        router.post('/webhook', (request: express.Request, response: express.Response) => {
            this.common.requestProcessor.processGraphApiPostWebHook(request, response);
        });
        
        router.get('/webhook', (request: express.Request, response: express.Response) => {
            this.common.requestProcessor.processGraphApiGetWebHook(request, response);
        });
        
        router.post('/test', (request: express.Request, response: express.Response) => {
            this.common.requestProcessor.processTestMessage(request, response);
        });
        
    }
}