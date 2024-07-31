import express from "express";
import * as useragent from "express-useragent";
import cors from "cors";
import bodyParser from "body-parser";
import * as path from "path";
import serveIndex from "serve-index";
import { CommonService } from "./common.service";

export class ExpressService{
    
    /**
     * COMMON VARIABLES
     */
    private app!: express.Application;
    private router = express.Router();

    /**
     * CONSTRUCTOR
     * @param common 
     */
    constructor(private common: CommonService){}

    /**
     * INITIALIZES EXPRESS
     */
    init(){
        this.common.logger.log(`Initiating express server with CORS | UserAgent | JSON body parser enabled`);
        this.app = express();
        this.app.use(express.json());
        this.app.use(useragent.express());
        this.app.use(cors());
        this.app.use(bodyParser.json());

        this.common.logger.log(`Initiating APIs with express server`);
        this.common.apiSvc.intializeAPIs(this.app);
        this.common.apiSvc.intializeWebHooks(this.app);

        this.app.use(`/logs`, express.static(path.resolve(process.cwd(), "logs")), serveIndex(path.resolve(process.cwd(), "logs"), {'icons': true}));
                
        this.app.listen(this.common.property.application.port, () => {
            this.common?.logger?.debug(`App listening at *:${this.common.property.application.port}`);
        });
    }
}