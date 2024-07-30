import path from "path";
import { AppenderLayout, ConsoleAppender, LogAppender, RollingFileAppender } from "./logger.service";
const { GRAPH_API_WEBHOOK_VERIFY_TOKEN, GRAPH_API_TOKEN, PORT, 
    CC_SERVER_IPADDRESS,
    CC_SERVER_PORT,
    CC_SERVER_SU_LOGIN_ID,
    CC_SERVER_SU_PASSWORD,
    LOG_FILE_NAME,
    LOG_PATTERN,
    LOG_FILE_SIZE,
    LOG_FILE_BACKUPS,
    SERVE_LOG_FILES,
    PRINT_USER_AGENT } = process.env;

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
        application.port = parseInt(PORT);
        application.serveLogFiles = SERVE_LOG_FILES?.toUpperCase() === "TRUE" ? true : false;
        application.enableUserAgent = PRINT_USER_AGENT?.toUpperCase() === "TRUE" ? true : false;
        application.graphApi = this.getAppGraphApiProperties();
        application.logAppender = this.getAppLogProperties();
        application.ccServer = this.getAppCCServerProperties();

        return application;
    }

    private getAppGraphApiProperties(): GraphAPI{
        var graphApi: GraphAPI = new GraphAPI();
        graphApi.authToken = GRAPH_API_TOKEN;
        graphApi.verifyToken = GRAPH_API_WEBHOOK_VERIFY_TOKEN;

        return graphApi;
    }

    private getAppCCServerProperties(): CCServer{
        var ccServer: CCServer = new CCServer();
        ccServer.ipAddress = CC_SERVER_IPADDRESS;
        ccServer.port = parseInt(CC_SERVER_PORT);
        ccServer.suLoginId = CC_SERVER_SU_LOGIN_ID;
        ccServer.suPassword = CC_SERVER_SU_PASSWORD;

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
        consoleAppender.layout.pattern = LOG_PATTERN;
        consoleAppender.layout.type = 'pattern';   

        return consoleAppender;
    }

    private getAppRollingFileLogProperties(): RollingFileAppender{
        var rollingFileAppender: RollingFileAppender = new RollingFileAppender();
        rollingFileAppender.filename = path.join(process.cwd(), `logs/${LOG_FILE_NAME}`);
        rollingFileAppender.maxLogSize = parseInt(LOG_FILE_SIZE);
        rollingFileAppender.backups = parseInt(LOG_FILE_BACKUPS);
        rollingFileAppender.type = 'file';
        rollingFileAppender.compress = true;
        rollingFileAppender.layout = new AppenderLayout();
        rollingFileAppender.layout.pattern = LOG_PATTERN;
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
    defAdminLoginId!: string;
    defAdminPassword!: string;
}