import winston, { format } from 'winston';
import * as path from 'path';
import moment from 'moment';
const { combine, splat, timestamp, printf } = format;

export class LoggerService{

  /**
   * COMMON VARIABLES
   */
    private PROJECT_ROOT: string = path.join(__dirname, '..');
    private LOGGER!: any;
    private iscustomFormatEnabled: boolean = true;

    /**
     * CONSTRUCTOR
     */
    constructor(){}

    /**
     * CONFIGURES LOGGER
     * @param config 
     * @returns 
     */
    configure(config: LogConfig): boolean{

      this.iscustomFormatEnabled = config.customFormat;

      var flag: boolean = false;

      if(config.type === LogType.Multi){
        if(config.options.console && config.options.file){
          this.configureMultiLogger(config.options.console, config.options.file, config.customFormat);
          flag = true;
        }
      }
      else if(config.type === LogType.Console){
        if(config.options.console){
          this.configureConsoleLogger(config.options.console, config.customFormat);
          flag = true;
        }
      }
      else if(config.type === LogType.File){
        if(config.options.file){
          this.configureFileLogger(config.options.file, config.customFormat);
          flag = true;
        }
      }else{
        if(config.options.console){
          this.configureConsoleLogger(config.options.console, config.customFormat);
          flag = true;
        }
      }

      if(flag === true){
        this.LOGGER.stream = {
          write: function (message: any) {
            this.LOGGER.info(message)
          }
        };
      }

      return flag;
    };

    /**
     * CONFIGURES CONSOLE LOGGER
     * @param logOptions 
     * @param customFormat 
     */
    private configureConsoleLogger(logOptions: ConsoleLogOptions, customFormat: boolean = true){
      var logConfig: any = {
        transports: [
          new (winston.transports.Console)(logOptions)
        ],
        exitOnError: false,
      };

      if(customFormat){
        logConfig.format = combine(splat(), timestamp(), this.customFormat);
      }else{
        logConfig.format = combine(this.nocustomFormat);
      }
      this.LOGGER = winston.createLogger(logConfig);
    };

    /**
     * CONFIGURES FILE LOGGER
     * @param logOptions 
     * @param customFormat 
     */
    private configureFileLogger(logOptions: FileLogOptions, customFormat: boolean = true){
      var logConfig: any = {
        transports: [
          new (winston.transports.File)(logOptions)
        ],
        exitOnError: false,
      };

      if(customFormat){
        logConfig.format = combine(splat(), timestamp(), this.customFormat);
      }else{
        logConfig.format = combine(this.nocustomFormat);
      }
      this.LOGGER = winston.createLogger(logConfig);
    };

    /**
     * CONFIGURES CONSOLE & FILE LOGGER
     * @param consoleLogOptions 
     * @param fileLogOptions 
     * @param customFormat 
     */
    private configureMultiLogger(consoleLogOptions: ConsoleLogOptions, fileLogOptions: FileLogOptions, customFormat: boolean = true){
      var logConfig: any = {
        transports: [
          new (winston.transports.Console)(consoleLogOptions),
          new (winston.transports.File)(fileLogOptions)
        ],
        exitOnError: false,
      };

      if(customFormat){
        logConfig.format = combine(splat(), timestamp(), this.customFormat);
      }else{
        logConfig.format = combine(this.nocustomFormat);
      }
      this.LOGGER = winston.createLogger(logConfig);
    };

    /**
     * LOGGER DEBUG METHOD
     * @param args 
     */
    debug = (...args: any[]): void => {
      this.LOGGER.debug(...this.formatLogArguments(args));
    };
    
    /**
     * LOGGER LOG METHOD
     * @param args 
     */
    log = (...args: any[]): void => {
      this.LOGGER.debug(...this.formatLogArguments(args));
    };
    
    /**
     * LOGGER INFO METHOD
     * @param args 
     */
    info = (...args: any[]): void => {
      this.LOGGER.info(...this.formatLogArguments(args));
    };
    
    /**
     * LOGGER WARN METHOD
     * @param args 
     */
    warn = (...args: any[]): void => {
      this.LOGGER.warn(...this.formatLogArguments(args));
    };
    
    /**
     * LOGGER ERROR METHOD
     * @param args 
     */
    error = (...args: any[]): void => {
      this.LOGGER.error(...this.formatLogArguments(args));
    };
    
    /**
     * FORMAT LOGGER ARGUEMENTS
     * @param args 
     * @returns 
     */
    private formatLogArguments(args: any[]): any[] {
      args = Array.prototype.slice.call(args);
    
      var stackInfo: LogStack | undefined = this.getStackInfo(1);
      if (stackInfo) {
        // get file path relative to project root
        var calleeStr = `[${stackInfo.relativePath}] [${stackInfo.line}]`;
    
        if (typeof args[0] === 'string') {
          if(this.iscustomFormatEnabled)
            args[0] = calleeStr + ' - ' + args[0];
        } else {
          args.unshift(calleeStr);
        }
      }
    
      return args;
    };
    
    /**
     * FORMAT LOGGER STACK INFO
     * @param stackindex 
     * @returns 
     */
    private getStackInfo(stackindex: number): LogStack | undefined {
      // get call stack, and analyze it
      // get all file, method, and line numbers
    
      var _err: Error = new Error();
      var stacklist: any = (_err).stack?.split('\n').slice(3);
    
      // stack trace format:
      // http://code.google.com/p/v8/wiki/javascriptstacktraceapi
      // do not remove the regex expresses to outside of this method (due to a bug in node.js)
      var stackreg: RegExp = /at\s+(.*)\s+\((.*):(\d*):(\d*)\)/gi;
      var stackreg2: RegExp = /at\s+()(.*):(\d*):(\d*)/gi;
    
      var s: string = stacklist[stackindex] || stacklist[0];
      var sp: RegExpExecArray | null = stackreg.exec(s) || stackreg2.exec(s);
    
      if (sp && sp.length === 5) {
        return {
          method: sp[1],
          relativePath: path.relative(this.PROJECT_ROOT, sp[2]),
          line: sp[3],
          pos: sp[4],
          file: path.basename(sp[2]),
          stack: stacklist.join('\n')
        };
      }

      return undefined;
    };

    /**
     * CUSTOM FORMAT
     */
    private customFormat = printf( ({ level, message, timestamp , ...metadata}) => {

      let msg = `[${moment(timestamp).format('MMM DD, YYYY hh:mm:ss A')}] [${level.toUpperCase()}] ${message}`  
      if(metadata && Object.keys(metadata).length > 0) {
        msg += JSON.stringify(metadata)
      }
      return msg
    });

    /**
     * NO CUSTOM FORMAT
     */
    private nocustomFormat = printf( ({ level, message, timestamp , ...metadata}) => {

      let msg = `${message}`  
      // if(metadata) {
      //   msg += JSON.stringify(metadata)
      // }

      console.log(message);
      return msg
    });
    
}

export class LogStack {
  method!: string;
  relativePath!: string;
  line!: string;
  pos!: string;
  file!: string;
  stack!: string;
}

export class LogFormat{
  level!: string;
  message!: string;
  timestamp!: string;
  metadata!: any;
}

export enum LogType{
  Console,
  File,
  Multi
}

export const LogLevel = {
  emerg: "emerg",
  alert: "alert",
  crit: "crit",
  error: "error",
  warning: "warning",
  notice: "notice",
  info: "info",
  debug: "debug"
}

export class LogConfig{
  type!: LogType;
  options!: LogOptions;
  customFormat: boolean = true;
}

export class LogOptions{
  console!: ConsoleLogOptions;
  file!: FileLogOptions;
}

export class ConsoleLogOptions{
  level: string = LogLevel.debug;
  handleexceptions: boolean = true;
  json: boolean = false;
  colorize: boolean = true;
}

export class FileLogOptions {
  level: string = LogLevel.debug;
  filename!: string;
  handleexceptions: boolean = true;
  json: boolean = false;
  maxsize!: number;
  maxfiles!: number;
  colorize: boolean = false;
  timestamp: boolean = true;
}

export class LogAppender {
    rollingFileAppender!: RollingFileAppender;
    consoleAppender!: ConsoleAppender;
}

export class RollingFileAppender {    
    type!: string;
    filename!: string;
    maxLogSize!: number;
    backups!: number;
    compress!: boolean;
    layout!: AppenderLayout;
}

export class ConsoleAppender {
    enabled!: boolean;
    type!: string;
    layout!: AppenderLayout;
}

export class AppenderLayout {
    type!: string;
    pattern!: string;
}