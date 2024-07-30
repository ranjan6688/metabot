import path from "path";
import { AppenderLayout, ConsoleAppender, LogAppender, RollingFileAppender } from "./logger.service";

export class PropertyService {
    
    /**
     * CONSTRUCTOR
     */
    constructor() { }

    /**
     * FETCHES PROPERTIES
     * @returns 
     */
    public getProperties(): Property {
        try {
            var property = new Property();
            property.application = this.getAppProperties();    

            return property;
        } catch (error) {
            console.log(`Failed to fetch properties.`, error)
            return new Property();
        }
    }

    getAppProperties(): Application{
        var application: Application = new Application();
        application.port = parseInt(process.env.PORT) || 10001;
        application.serveLogFiles = process.env.SERVE_LOG_FILES?.toUpperCase() === "TRUE" ? true : false;
        application.enableUserAgent = process.env.PRINT_USER_AGENT?.toUpperCase() === "TRUE" ? true : false;
        application.graphApi = this.getAppGraphApiProperties();
        application.logAppender = this.getAppLogProperties();
        application.ccServer = this.getAppCCServerProperties();

        return application;
    }

    private getAppGraphApiProperties(): GraphAPI{
        var graphApi: GraphAPI = new GraphAPI();
        graphApi.authToken = process.env.GRAPH_API_TOKEN;
        graphApi.verifyToken = process.env.GRAPH_API_WEBHOOK_VERIFY_TOKEN;

        return graphApi;
    }

    private getAppCCServerProperties(): CCServer{
        var ccServer: CCServer = new CCServer();
        ccServer.ipAddress = process.env.CC_SERVER_IPADDRESS;
        ccServer.port = parseInt(process.env.CC_SERVER_PORT);
        ccServer.suLoginId = process.env.CC_SERVER_SU_LOGIN_ID;
        ccServer.suPassword = process.env.CC_SERVER_SU_PASSWORD;

        return ccServer;
    }

    private getAppLogProperties(): LogAppender{
        var logAppender: LogAppender = new LogAppender();
        logAppender.consoleAppender = this.getAppConsoleLogProperties();
        logAppender.rollingFileAppender = this.getAppRollingFileLogProperties();

        return logAppender;
    }

    private getAppConsoleLogProperties(): ConsoleAppender{
        var consoleAppender: ConsoleAppender = new ConsoleAppender();
        consoleAppender.type = 'stdout';
        consoleAppender.layout = new AppenderLayout();
        consoleAppender.layout.pattern = process.env.LOG_PATTERN;
        consoleAppender.layout.type = 'pattern';   

        return consoleAppender;
    }

    private getAppRollingFileLogProperties(): RollingFileAppender{
        var rollingFileAppender: RollingFileAppender = new RollingFileAppender();
        rollingFileAppender.filename = path.join(process.cwd(), `logs/${process.env.LOG_FILE_NAME}`);
        rollingFileAppender.maxLogSize = parseInt(process.env.LOG_FILE_SIZE);
        rollingFileAppender.backups = parseInt(process.env.LOG_FILE_BACKUPS);
        rollingFileAppender.type = 'file';
        rollingFileAppender.compress = true;
        rollingFileAppender.layout = new AppenderLayout();
        rollingFileAppender.layout.pattern = process.env.LOG_PATTERN;
        rollingFileAppender.layout.type = 'pattern'; 

        return rollingFileAppender;
    }



}

/**
 * PROPERTY CLASS
 */
export class Property {
    application!: Application;
}

export class HttpMethod {
    static GET: any = 'GET';
    static POST: any = 'POST';
    static PUT: any = 'PUT';
    static PATCH: any = 'PATCH';
    static DELETE: any = 'DELETE';
}

export class Application {
    port!: number;
    graphApi!: GraphAPI;
    logAppender!: LogAppender;
    serveLogFiles!: boolean;    
    enableUserAgent!: boolean;
    ccServer!: CCServer;
}

export class GraphAPI{
    authToken!: string;
    verifyToken!: string;
}

export class CCServer{
    ipAddress!: any;
    port!: number;
    isSsl: boolean = true;
    strictSsl: boolean = false;
    suLoginId!: string;
    suPassword!: string;
}