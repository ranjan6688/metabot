import express from "express";
import moment from "moment";
import { Property, PropertyService } from "./property.service";
import { RequestProcessor } from "../processors/request.processor";
import { ResponseProcessor } from "../processors/response.processor";
import { ConsoleLogOptions, FileLogOptions, LogAppender, LogConfig, LoggerService, LogOptions, LogType } from "./logger.service";
import { APIService } from "./api.service";
import { CCService } from "./cc.service";
import { ExpressService } from "./express.service";
import { GraphApiController } from "./../controllers/graphapi.controller";
import { CCController } from "./../controllers/cc.controller";
import { CipherService } from "./cipher.service";
import { ErrorProcessor } from "./../processors/error.processor";

export class CommonService{

    /**
     * COMMON VARIABLES
     */
    public router = express.Router(); 
    public property!: Property;
    public ipAddress!: string;

    /**
     * PROCESSORS
     */
    public requestProcessor!: RequestProcessor;
    public responseProcessor!: ResponseProcessor;
    public errorProcessor!: ErrorProcessor;

    /**
     * CONTROLLERS
     */
    public graphApiController!: GraphApiController;
    public ccController!: CCController;
    
    /**
     * SERVICES
     */
    public apiSvc!: APIService;
    public expressSvc !: ExpressService;
    public ccSvc!: CCService;
    public chipherSvc!: CipherService;

    /**
     * LOGGER
     */
    public logger!: LoggerService;
    
    
    /**
     * CONSTRUCTOR
     */
    constructor(){        
        this.initialize();
    }

    /**
     * INITIATES ALL SERVICES | CONTROLLERS | PROCESSORS
     * @returns 
     */
    private async initialize(){
        console.log(`ABANDON >>> COMMON SERVICE >>> Initiating Property Service and Reading Properties`);
        this.property = new PropertyService().getProperties();
        
        console.log(`ABANDON >>> COMMON SERVICE >>> Properties`, this.property);

        console.log(`ABANDON >>> COMMON SERVICE >>> Initiating Logger Service`);
        this.logger = new LoggerService();

        console.log(`ABANDON >>> COMMON SERVICE >>> Initiating Application Logger`);
        if(!this.initializeLogger(this.property?.application?.logAppender, this.logger))
            return console.log(`COMMON SERVICE >>> Failed to initialize Application Logger! Check log configuration!!`);
                
        this.logger?.debug(`Initiating Processors`);
        this.requestProcessor = new RequestProcessor(this);
        this.responseProcessor = new ResponseProcessor(this);
        this.errorProcessor = new ErrorProcessor();

        this.logger?.debug(`Initiating Controllers`);
        this.graphApiController = new GraphApiController(this);
        this.ccController = new CCController(this);
                                
        this.logger?.debug(`Initiating Services`);
        this.apiSvc = new APIService(this);     
        this.ccSvc = new CCService(this);
        this.chipherSvc = new CipherService();
        this.expressSvc = new ExpressService(this);
        this.expressSvc.init();

    }

    /**
     * INITILIZES LOGGER
     * @param logAppender 
     * @param logger 
     * @returns 
     */
    private initializeLogger(logAppender: LogAppender, logger: LoggerService, customFormat: boolean = true): boolean {
        if(!logAppender)
            return false;

        var config: LogConfig = new LogConfig();
        config.customFormat = customFormat;
        config.type = LogType.Multi;
        config.options = new LogOptions();
        config.options.console = new ConsoleLogOptions();
        config.options.file = new FileLogOptions();
        config.options.file.filename = logAppender.rollingFileAppender.filename;
        config.options.file.maxfiles = logAppender.rollingFileAppender.backups;
        config.options.file.maxsize = logAppender.rollingFileAppender.maxLogSize;
        return logger.configure(config);
    }

    getUniqueArray(arrayObject: any, property: any): any[]{
        return [...new Map(arrayObject.map((item: any) => [item[property], item])).values()];
    }
    
    /**
     * SORT ARRAY OF OBJECTS BY A PROPERTY
     * @param arrayObject 
     * @param property 
     * @returns 
     */
    sortByProperty(arrayObject: any, property: any) {
        return arrayObject.sort((a: any, b: any) => (a[property] > b[property]) ? 1 : ((b[property] > a[property]) ? -1 : 0))
    };

    /**
     * SORT ASC ARRAY OF OBJECTS BY DATE
     * @param arrayObject 
     * @param property 
     * @returns 
     */
    sortAscByDate(arrayObject: any, property: any) {
        return arrayObject.sort((a: any, b: any) => moment(a[property], 'MMM DD, YYYY hh:mm:ss A').valueOf() - moment(b[property], 'MMM DD, YYYY hh:mm:ss A').valueOf());
    };

    /**
     * SORT DESC ARRAY OF OBJECTS BY DATE
     * @param arrayObject 
     * @param property 
     * @returns 
     */
    sortDescByDate(arrayObject: any, property: any) {
        return arrayObject.sort((a: any, b: any) => moment(b[property], 'MMM DD, YYYY hh:mm:ss A').valueOf() - moment(a[property], 'MMM DD, YYYY hh:mm:ss A').valueOf());
    };
}

export class WIDGET_NAME {
    static AbandonCallHistory: string = 'abandoncallhistory';
    static CampaignStatus: string = 'campaignstatus';
    static CampaignSummary: string = 'campaignsummary';
    static AgentStatus: string = 'agentstatus';
    static OtherAgentStatus: string = 'otheragentstatus';
    static AgentSummary: string = 'agentsummary';
    static AgentSummaryChannelWise: string = 'agentsummarychannelwise';
    static CallStatus: string = 'callstatus';
    static CallSummary: string = 'callsummary';
    static ChatStatus: string = 'chatstatus';
    static ChatSummary: string = 'chatsummary';
    static EmailStatus: string = 'emailstatus';
    static EmailSummary: string = 'emailsummary';
    static QueueStatus: string = 'queuestatus';
}