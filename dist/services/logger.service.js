"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppenderLayout = exports.ConsoleAppender = exports.RollingFileAppender = exports.LogAppender = exports.FileLogOptions = exports.ConsoleLogOptions = exports.LogOptions = exports.LogConfig = exports.LogLevel = exports.LogType = exports.LogFormat = exports.LogStack = exports.LoggerService = void 0;
const winston_1 = __importStar(require("winston"));
const path = __importStar(require("path"));
const moment_1 = __importDefault(require("moment"));
const { combine, splat, timestamp, printf } = winston_1.format;
class LoggerService {
    /**
     * COMMON VARIABLES
     */
    PROJECT_ROOT = path.join(__dirname, '..');
    LOGGER;
    iscustomFormatEnabled = true;
    /**
     * CONSTRUCTOR
     */
    constructor() { }
    /**
     * CONFIGURES LOGGER
     * @param config
     * @returns
     */
    configure(config) {
        this.iscustomFormatEnabled = config.customFormat;
        var flag = false;
        if (config.type === LogType.Multi) {
            if (config.options.console && config.options.file) {
                this.configureMultiLogger(config.options.console, config.options.file, config.customFormat);
                flag = true;
            }
        }
        else if (config.type === LogType.Console) {
            if (config.options.console) {
                this.configureConsoleLogger(config.options.console, config.customFormat);
                flag = true;
            }
        }
        else if (config.type === LogType.File) {
            if (config.options.file) {
                this.configureFileLogger(config.options.file, config.customFormat);
                flag = true;
            }
        }
        else {
            if (config.options.console) {
                this.configureConsoleLogger(config.options.console, config.customFormat);
                flag = true;
            }
        }
        if (flag === true) {
            this.LOGGER.stream = {
                write: function (message) {
                    this.LOGGER.info(message);
                }
            };
        }
        return flag;
    }
    ;
    /**
     * CONFIGURES CONSOLE LOGGER
     * @param logOptions
     * @param customFormat
     */
    configureConsoleLogger(logOptions, customFormat = true) {
        var logConfig = {
            transports: [
                new (winston_1.default.transports.Console)(logOptions)
            ],
            exitOnError: false,
        };
        if (customFormat) {
            logConfig.format = combine(splat(), timestamp(), this.customFormat);
        }
        else {
            logConfig.format = combine(this.nocustomFormat);
        }
        this.LOGGER = winston_1.default.createLogger(logConfig);
    }
    ;
    /**
     * CONFIGURES FILE LOGGER
     * @param logOptions
     * @param customFormat
     */
    configureFileLogger(logOptions, customFormat = true) {
        var logConfig = {
            transports: [
                new (winston_1.default.transports.File)(logOptions)
            ],
            exitOnError: false,
        };
        if (customFormat) {
            logConfig.format = combine(splat(), timestamp(), this.customFormat);
        }
        else {
            logConfig.format = combine(this.nocustomFormat);
        }
        this.LOGGER = winston_1.default.createLogger(logConfig);
    }
    ;
    /**
     * CONFIGURES CONSOLE & FILE LOGGER
     * @param consoleLogOptions
     * @param fileLogOptions
     * @param customFormat
     */
    configureMultiLogger(consoleLogOptions, fileLogOptions, customFormat = true) {
        var logConfig = {
            transports: [
                new (winston_1.default.transports.Console)(consoleLogOptions),
                new (winston_1.default.transports.File)(fileLogOptions)
            ],
            exitOnError: false,
        };
        if (customFormat) {
            logConfig.format = combine(splat(), timestamp(), this.customFormat);
        }
        else {
            logConfig.format = combine(this.nocustomFormat);
        }
        this.LOGGER = winston_1.default.createLogger(logConfig);
    }
    ;
    /**
     * LOGGER DEBUG METHOD
     * @param args
     */
    debug = (...args) => {
        this.LOGGER.debug(...this.formatLogArguments(args));
        if (process.env?.OverwriteLog)
            console.log(...this.formatLogArguments(args));
    };
    /**
     * LOGGER LOG METHOD
     * @param args
     */
    log = (...args) => {
        this.LOGGER.debug(...this.formatLogArguments(args));
        if (process.env?.OverwriteLog)
            console.log(...this.formatLogArguments(args));
    };
    /**
     * LOGGER INFO METHOD
     * @param args
     */
    info = (...args) => {
        this.LOGGER.info(...this.formatLogArguments(args));
        if (process.env?.OverwriteLog)
            console.log(...this.formatLogArguments(args));
    };
    /**
     * LOGGER WARN METHOD
     * @param args
     */
    warn = (...args) => {
        this.LOGGER.warn(...this.formatLogArguments(args));
        if (process.env?.OverwriteLog)
            console.log(...this.formatLogArguments(args));
    };
    /**
     * LOGGER ERROR METHOD
     * @param args
     */
    error = (...args) => {
        this.LOGGER.error(...this.formatLogArguments(args));
        if (process.env?.OverwriteLog)
            console.log(...this.formatLogArguments(args));
    };
    /**
     * FORMAT LOGGER ARGUEMENTS
     * @param args
     * @returns
     */
    formatLogArguments(args) {
        args = Array.prototype.slice.call(args);
        var stackInfo = this.getStackInfo(1);
        if (stackInfo) {
            // get file path relative to project root
            var calleeStr = `[${stackInfo.relativePath}] [${stackInfo.line}]`;
            if (typeof args[0] === 'string') {
                if (this.iscustomFormatEnabled)
                    args[0] = calleeStr + ' - ' + args[0];
            }
            else {
                args.unshift(calleeStr);
            }
        }
        return args;
    }
    ;
    /**
     * FORMAT LOGGER STACK INFO
     * @param stackindex
     * @returns
     */
    getStackInfo(stackindex) {
        // get call stack, and analyze it
        // get all file, method, and line numbers
        var _err = new Error();
        var stacklist = (_err).stack?.split('\n').slice(3);
        // stack trace format:
        // http://code.google.com/p/v8/wiki/javascriptstacktraceapi
        // do not remove the regex expresses to outside of this method (due to a bug in node.js)
        var stackreg = /at\s+(.*)\s+\((.*):(\d*):(\d*)\)/gi;
        var stackreg2 = /at\s+()(.*):(\d*):(\d*)/gi;
        var s = stacklist[stackindex] || stacklist[0];
        var sp = stackreg.exec(s) || stackreg2.exec(s);
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
    }
    ;
    /**
     * CUSTOM FORMAT
     */
    customFormat = printf(({ level, message, timestamp, ...metadata }) => {
        let msg = `[${(0, moment_1.default)(timestamp).format('MMM DD, YYYY hh:mm:ss A')}] [${level.toUpperCase()}] ${message}`;
        if (metadata && Object.keys(metadata).length > 0) {
            msg += JSON.stringify(metadata);
        }
        return msg;
    });
    /**
     * NO CUSTOM FORMAT
     */
    nocustomFormat = printf(({ level, message, timestamp, ...metadata }) => {
        let msg = `${message}`;
        // if(metadata) {
        //   msg += JSON.stringify(metadata)
        // }
        console.log(message);
        return msg;
    });
}
exports.LoggerService = LoggerService;
class LogStack {
    method;
    relativePath;
    line;
    pos;
    file;
    stack;
}
exports.LogStack = LogStack;
class LogFormat {
    level;
    message;
    timestamp;
    metadata;
}
exports.LogFormat = LogFormat;
var LogType;
(function (LogType) {
    LogType[LogType["Console"] = 0] = "Console";
    LogType[LogType["File"] = 1] = "File";
    LogType[LogType["Multi"] = 2] = "Multi";
})(LogType || (exports.LogType = LogType = {}));
exports.LogLevel = {
    emerg: "emerg",
    alert: "alert",
    crit: "crit",
    error: "error",
    warning: "warning",
    notice: "notice",
    info: "info",
    debug: "debug"
};
class LogConfig {
    type;
    options;
    customFormat = true;
}
exports.LogConfig = LogConfig;
class LogOptions {
    console;
    file;
}
exports.LogOptions = LogOptions;
class ConsoleLogOptions {
    level = exports.LogLevel.debug;
    handleexceptions = true;
    json = false;
    colorize = true;
}
exports.ConsoleLogOptions = ConsoleLogOptions;
class FileLogOptions {
    level = exports.LogLevel.debug;
    filename;
    handleexceptions = true;
    json = false;
    maxsize;
    maxfiles;
    colorize = false;
    timestamp = true;
}
exports.FileLogOptions = FileLogOptions;
class LogAppender {
    rollingFileAppender;
    consoleAppender;
}
exports.LogAppender = LogAppender;
class RollingFileAppender {
    type;
    filename;
    maxLogSize;
    backups;
    compress;
    layout;
}
exports.RollingFileAppender = RollingFileAppender;
class ConsoleAppender {
    enabled;
    type;
    layout;
}
exports.ConsoleAppender = ConsoleAppender;
class AppenderLayout {
    type;
    pattern;
}
exports.AppenderLayout = AppenderLayout;
//# sourceMappingURL=logger.service.js.map