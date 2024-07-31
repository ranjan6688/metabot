"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Commands = exports.CommandAction = exports.CommandEntity = exports.CommandInfo = exports.Command = exports.GraphApiController = void 0;
const axios_1 = __importDefault(require("axios"));
class GraphApiController {
    common;
    commandList = [];
    constructor(common) {
        this.common = common;
        this.registerAllCommands();
    }
    registerAllCommands() {
        var cmdInfo = new CommandInfo();
        cmdInfo.name = CommandEntity.Application;
        cmdInfo.actions = [CommandAction.Fetch];
        this.commandList.push(cmdInfo);
        // cmdInfo = new CommandInfo();
        // cmdInfo.name = CommandEntity.Callback;
        // cmdInfo.actions = [CommandAction.Fetch];
        // this.commandList.push(cmdInfo);
        // cmdInfo = new CommandInfo();
        // cmdInfo.name = CommandEntity.Campaign;
        // cmdInfo.actions = [CommandAction.Fetch, CommandAction.Properties, CommandAction.Status, CommandAction.Load, CommandAction.Start, CommandAction.Stop, CommandAction.Unload];
        // this.commandList.push(cmdInfo);
        // cmdInfo = new CommandInfo();
        // cmdInfo.name = CommandEntity.CampaignAbandonCallList;
        // cmdInfo.actions = [CommandAction.Fetch];
        // this.commandList.push(cmdInfo);
        // cmdInfo = new CommandInfo();
        // cmdInfo.name = CommandEntity.CampaignDisposition;
        // cmdInfo.actions = [CommandAction.Fetch];
        // this.commandList.push(cmdInfo);
        // cmdInfo = new CommandInfo();
        // cmdInfo.name = CommandEntity.ContactList;
        // cmdInfo.actions = [CommandAction.Fetch];
        // this.commandList.push(cmdInfo);
        cmdInfo = new CommandInfo();
        cmdInfo.name = CommandEntity.Database;
        cmdInfo.actions = [CommandAction.Fetch, CommandAction.Status];
        this.commandList.push(cmdInfo);
        // cmdInfo = new CommandInfo();
        // cmdInfo.name = CommandEntity.Skill;
        // cmdInfo.actions = [CommandAction.Fetch];
        // this.commandList.push(cmdInfo);
        cmdInfo = new CommandInfo();
        cmdInfo.name = CommandEntity.Licence;
        cmdInfo.actions = [CommandAction.Fetch];
        this.commandList.push(cmdInfo);
        cmdInfo = new CommandInfo();
        cmdInfo.name = CommandEntity.Tenant;
        cmdInfo.actions = [CommandAction.Fetch, CommandAction.Status, CommandAction.Start, CommandAction.Stop];
        this.commandList.push(cmdInfo);
        cmdInfo = new CommandInfo();
        cmdInfo.name = CommandEntity.Help;
        cmdInfo.actions = [];
        this.commandList.push(cmdInfo);
    }
    async onWebhookPostMessageRecieved(request, response) {
        var replyMessage = '';
        this.common.logger.debug("Incoming webhook message:", JSON.stringify(request.body, null, 2));
        const recievedMessageObj = request.body.entry?.[0]?.changes[0]?.value?.messages?.[0];
        if (recievedMessageObj?.type === "text") {
            const businessNumber = request.body.entry?.[0].changes?.[0].value?.metadata?.phone_number_id;
            try {
                var command = await this.getCommandFromMessage(recievedMessageObj?.text?.body?.trim(), response);
                if (command) {
                    switch (command?.entity?.toLowerCase()) {
                        case CommandEntity.Help:
                            replyMessage = await this.fetchCommandList();
                            break;
                        case CommandEntity.Application:
                            replyMessage = await this.onApplicationCommandRecieved(command);
                            break;
                        case CommandEntity.Callback:
                            break;
                        case CommandEntity.Campaign:
                            break;
                        case CommandEntity.CampaignAbandonCallList:
                            break;
                        case CommandEntity.CampaignDisposition:
                            break;
                        case CommandEntity.ContactList:
                            break;
                        case CommandEntity.Database:
                            replyMessage = await this.onDatabaseCommandRecieved(command);
                            break;
                        case CommandEntity.Skill:
                            break;
                        case CommandEntity.Tenant:
                            replyMessage = await this.onTenantCommandRecieved(command);
                            break;
                        case CommandEntity.Licence:
                            replyMessage = await this.onLicenseCommandRecieved(command);
                            break;
                        default:
                            replyMessage = await this.fetchCommandListOnInvalidCommand();
                            break;
                    }
                }
                else {
                    replyMessage = await this.fetchCommandListOnInvalidCommand();
                }
            }
            catch (ex) {
                replyMessage = await this.fetchCommandListOnInvalidCommand();
            }
            if (!replyMessage)
                replyMessage = await this.fetchCommandListOnInvalidCommand();
            await this.sendReplyMessage(businessNumber, recievedMessageObj, replyMessage);
            await this.sendMarkAsRead(businessNumber, recievedMessageObj);
        }
        response.sendStatus(200);
    }
    async onApplicationCommandRecieved(command) {
        var replyMessage = '';
        if (command.action === CommandAction.Fetch) {
            if (!command.entityCode) {
                replyMessage = await this.fetchApplications();
            }
            else {
                replyMessage = await this.fetchApplication(command?.entityCode);
            }
        }
        if (!replyMessage) {
            replyMessage = await this.fetchCommandListOnInvalidCommand();
        }
        return replyMessage;
    }
    async onDatabaseCommandRecieved(command) {
        var replyMessage = '';
        if (command.action === CommandAction.Fetch) {
            if (!command.entityCode) {
                replyMessage = await this.fetchDatabases();
            }
            else {
                replyMessage = await this.fetchDatabase(command?.entityCode);
            }
        }
        if (!replyMessage) {
            replyMessage = await this.fetchCommandListOnInvalidCommand();
        }
        return replyMessage;
    }
    async onTenantCommandRecieved(command) {
        var replyMessage = '';
        if (command.action === CommandAction.Fetch) {
            if (!command.entityCode) {
                replyMessage = await this.fetchTenants();
            }
            else {
                replyMessage = await this.fetchTenant(command?.entityCode);
            }
        }
        if (command.action === CommandAction.Status) {
            if (!command.entityCode)
                replyMessage = `Invalid tenant code!`;
            else {
                replyMessage = await this.fetchTenantStatus(command?.entityCode);
            }
        }
        if (command.action === CommandAction.Start) {
            if (!command.entityCode)
                replyMessage = `Invalid tenant code!`;
            else {
                replyMessage = await this.startTenant(command?.entityCode);
            }
        }
        if (command.action === CommandAction.Stop) {
            if (!command.entityCode)
                replyMessage = `Invalid tenant code!`;
            else {
                replyMessage = await this.stopTenant(command?.entityCode);
            }
        }
        if (!replyMessage) {
            replyMessage = await this.fetchCommandListOnInvalidCommand();
        }
        return replyMessage;
    }
    async onLicenseCommandRecieved(command) {
        var replyMessage = '';
        if (command.action === CommandAction.Fetch) {
            if (!command.entityCode) {
                replyMessage = `Invalid tenant code!`;
            }
            else {
                replyMessage = await this.fetchLicense(command?.entityCode);
            }
        }
        if (!replyMessage) {
            replyMessage = await this.fetchCommandListOnInvalidCommand();
        }
        return replyMessage;
    }
    async onTestMessageRecieved(request, response) {
        var command = await this.getCommandFromMessage(request?.body?.text?.trim(), response);
        if (command) {
            switch (command?.entity?.toLowerCase()) {
                case CommandEntity.Help:
                    var replyMessage = await this.fetchCommandList();
                    response.status(200).send(replyMessage);
                    break;
                case CommandEntity.Application:
                    var replyMessage = await this.onApplicationCommandRecieved(command);
                    response.status(200).send(replyMessage);
                    break;
                case CommandEntity.Callback:
                    break;
                case CommandEntity.Campaign:
                    break;
                case CommandEntity.CampaignAbandonCallList:
                    break;
                case CommandEntity.CampaignDisposition:
                    break;
                case CommandEntity.ContactList:
                    break;
                case CommandEntity.Database:
                    var replyMessage = await this.onDatabaseCommandRecieved(command);
                    response.status(200).send(replyMessage);
                    break;
                case CommandEntity.Skill:
                    break;
                case CommandEntity.Tenant:
                    var replyMessage = await this.onTenantCommandRecieved(command);
                    response.status(200).send(replyMessage);
                    break;
                case CommandEntity.Licence:
                    replyMessage = await this.onLicenseCommandRecieved(command);
                    response.status(200).send(replyMessage);
                    break;
                default:
                    var replyMessage = await this.fetchCommandListOnInvalidCommand();
                    response.status(500).send(replyMessage);
                    break;
            }
        }
    }
    async getCommandFromMessage(message, response) {
        var messages = message?.split('-');
        if (!messages || messages?.length === 0) {
            var replyMessage = await this.fetchCommandListOnInvalidCommand();
            response.status(500).send(replyMessage);
            return undefined;
        }
        var command = new Command();
        command.entity = messages[0]?.trim();
        command.action = messages[1]?.trim();
        command.entityCode = messages[2]?.trim()?.toUpperCase();
        command.tenantCode = messages[3]?.trim()?.toUpperCase();
        return command;
    }
    async fetchCommandListOnInvalidCommand() {
        var cmdArray = [];
        this.commandList.forEach((command) => {
            if (command.name === CommandEntity.Help)
                cmdArray.push(`*${command.name}*\ni.e. ${command.name}`);
            else if (command.name === CommandEntity.Application ||
                command.name === CommandEntity.Database ||
                command.name === CommandEntity.Tenant) {
                var cmdStr = `*${command.name}*\ni.e. ${command.name}`;
                if (command?.actions?.length > 0) {
                    cmdStr += `-[${command?.actions?.join(',')}]`;
                }
                cmdStr += `-${command.name}Code\n`;
                cmdArray.push(cmdStr);
            }
            else if (command.name === CommandEntity.Licence) {
                var cmdStr = `*${command.name}*\ni.e. ${command.name}`;
                if (command?.actions?.length > 0) {
                    cmdStr += `-[${command?.actions?.join(',')}]`;
                }
                cmdStr += `-tenantCode\n`;
                cmdArray.push(cmdStr);
            }
            else {
                var cmdStr = `*${command.name}*\ni.e. ${command.name}`;
                if (command?.actions?.length > 0) {
                    cmdStr += `-[${command?.actions?.join(',')}]`;
                }
                cmdStr += `-${command.name}Code`;
                cmdStr += `-tenantCode\n`;
                cmdArray.push(cmdStr);
            }
        });
        return `*Invalid command!*\nAvailable command list are;\n\n${cmdArray.join('\n')}`;
    }
    async fetchCommandList() {
        var cmdArray = [];
        this.commandList.forEach((command) => {
            if (command.name === CommandEntity.Help)
                cmdArray.push(`*${command.name}*\ni.e. ${command.name}`);
            else if (command.name === CommandEntity.Application ||
                command.name === CommandEntity.Database ||
                command.name === CommandEntity.Tenant) {
                var cmdStr = `*${command.name}*\ni.e. ${command.name}`;
                if (command?.actions?.length > 0) {
                    cmdStr += `-[${command?.actions?.join(',')}]`;
                }
                cmdStr += `-${command.name}Code\n`;
                cmdArray.push(cmdStr);
            }
            else {
                var cmdStr = `*${command.name}*\ni.e. ${command.name}`;
                if (command?.actions?.length > 0) {
                    cmdStr += `-[${command?.actions?.join(',')}]`;
                }
                cmdStr += `-${command.name}Code`;
                cmdStr += `-tenantCode\n`;
                cmdArray.push(cmdStr);
            }
        });
        return cmdArray.join('\n');
    }
    async fetchApplications() {
        var responseStringArray = [];
        var keyValueStringArray = [];
        var appInfos = await this.common.ccController.fetchApplications();
        appInfos?.forEach((info) => {
            keyValueStringArray = this.getKeyValueStringArray(info);
            responseStringArray.push(keyValueStringArray.join('\n'));
        });
        var replyMessage = responseStringArray.join(`\n===============================\n`);
        if (!replyMessage)
            replyMessage = `No application found`;
        return replyMessage;
    }
    async fetchApplication(applicationCode) {
        var responseStringArray = [];
        var keyValueStringArray = [];
        var appInfos = await this.common.ccController.fetchApplication(applicationCode);
        appInfos?.forEach((info) => {
            keyValueStringArray = this.getKeyValueStringArray(info);
            responseStringArray.push(keyValueStringArray.join('\n'));
        });
        var replyMessage = responseStringArray.join(`\n===============================\n`);
        if (!replyMessage)
            replyMessage = `No application found`;
        return replyMessage;
    }
    async fetchDatabases() {
        var responseStringArray = [];
        var keyValueStringArray = [];
        var dbInfos = await this.common.ccController.fetchDatabases();
        dbInfos?.forEach((info) => {
            keyValueStringArray = this.getKeyValueStringArray(info);
            responseStringArray.push(keyValueStringArray.join('\n'));
        });
        var replyMessage = responseStringArray.join(`\n===============================\n`);
        if (!replyMessage)
            replyMessage = `No database found`;
        return replyMessage;
    }
    async fetchDatabase(databaseCode) {
        var responseStringArray = [];
        var keyValueStringArray = [];
        var dbInfos = await this.common.ccController.fetchDatabase(databaseCode);
        dbInfos?.forEach((info) => {
            keyValueStringArray = this.getKeyValueStringArray(info);
            responseStringArray.push(keyValueStringArray.join('\n'));
        });
        var replyMessage = responseStringArray.join(`\n===============================\n`);
        if (!replyMessage)
            replyMessage = `No database found`;
        return replyMessage;
    }
    async fetchTenants() {
        var responseStringArray = [];
        var keyValueStringArray = [];
        var tenantInfos = await this.common.ccController.fetchTenants();
        tenantInfos?.forEach((info) => {
            keyValueStringArray = this.getKeyValueStringArray(info);
            responseStringArray.push(keyValueStringArray.join('\n'));
        });
        var replyMessage = responseStringArray.join(`\n===============================\n`);
        if (!replyMessage)
            replyMessage = `No tenant found`;
        return replyMessage;
    }
    async fetchTenant(tenantCode) {
        var responseStringArray = [];
        var keyValueStringArray = [];
        var tenantInfos = await this.common.ccController.fetchTenant(tenantCode);
        tenantInfos?.forEach((info) => {
            keyValueStringArray = this.getKeyValueStringArray(info);
            responseStringArray.push(keyValueStringArray.join('\n'));
        });
        var replyMessage = responseStringArray.join(`\n===============================\n`);
        if (!replyMessage)
            replyMessage = `No tenant found`;
        return replyMessage;
    }
    async fetchTenantStatus(tenantCode) {
        var responseStringArray = [];
        var keyValueStringArray = [];
        var tenantInfos = await this.common.ccController.fetchTenant(tenantCode);
        tenantInfos?.forEach((info) => {
            keyValueStringArray = this.getKeyValueStringArray(info);
            responseStringArray.push(keyValueStringArray.join('\n'));
        });
        var replyMessage = responseStringArray.join(`\n===============================\n`);
        if (!replyMessage)
            replyMessage = `No tenant found`;
        return replyMessage;
    }
    async startTenant(tenantCode) {
        var responseStringArray = [];
        var keyValueStringArray = [];
        var tenantInfos = await this.common.ccController.startTenant(tenantCode);
        tenantInfos?.forEach((info) => {
            keyValueStringArray = this.getKeyValueStringArray(info);
            responseStringArray.push(keyValueStringArray.join('\n'));
        });
        var replyMessage = responseStringArray.join(`\n===============================\n`);
        if (!replyMessage)
            replyMessage = `No tenant found`;
        return replyMessage;
    }
    async stopTenant(tenantCode) {
        var responseStringArray = [];
        var keyValueStringArray = [];
        var tenantInfos = await this.common.ccController.stopTenant(tenantCode);
        tenantInfos?.forEach((info) => {
            keyValueStringArray = this.getKeyValueStringArray(info);
            responseStringArray.push(keyValueStringArray.join('\n'));
        });
        var replyMessage = responseStringArray.join(`\n===============================\n`);
        if (!replyMessage)
            replyMessage = `No tenant found`;
        return replyMessage;
    }
    async fetchLicense(tenantCode) {
        var responseStringArray = [];
        var keyValueStringArray = [];
        var licenseInfos = await this.common.ccController.fetchLicense(tenantCode);
        licenseInfos?.forEach((info) => {
            keyValueStringArray = this.getKeyValueStringArray(info);
            responseStringArray.push(keyValueStringArray.join('\n'));
        });
        var replyMessage = responseStringArray.join(`\n===============================\n`);
        if (!replyMessage)
            replyMessage = `No tenant found`;
        return replyMessage;
    }
    async onWebhookGetMessageRecieved(request, response) {
        this.verifyWebhook(request, response);
    }
    verifyWebhook(request, response) {
        const mode = request.query["hub.mode"];
        const token = request.query["hub.verify_token"];
        const challenge = request.query["hub.challenge"];
        // check the mode and token sent are correct
        if (mode === "subscribe" && token === this.common.chipherSvc.AESdecrypt(this.common.property.application.graphApi.verifyToken)) {
            // respond with 200 OK and challenge token from the request
            response.status(200).send(challenge);
            console.log("Webhook verified successfully!");
        }
        else {
            // respond with '403 Forbidden' if verify tokens do not match
            response.sendStatus(403);
        }
    }
    async sendReplyMessage(businessNumber, recievedMessageObj, replyMessage) {
        await (0, axios_1.default)({
            method: "POST",
            url: `https://graph.facebook.com/v20.0/${businessNumber}/messages`,
            headers: {
                Authorization: `Bearer ${this.common.property.application.graphApi.authToken}`,
            },
            data: {
                messaging_product: "whatsapp",
                to: recievedMessageObj.from,
                text: { body: `${replyMessage}` },
                context: {
                    message_id: recievedMessageObj.id, // shows the message as a reply to the original user message
                },
            },
        });
    }
    async sendMarkAsRead(businessNumber, recievedMessageObj) {
        await (0, axios_1.default)({
            method: "POST",
            url: `https://graph.facebook.com/v20.0/${businessNumber}/messages`,
            headers: {
                Authorization: `Bearer ${this.common.property.application.graphApi.authToken}`,
            },
            data: {
                messaging_product: "whatsapp",
                status: "read",
                message_id: recievedMessageObj.id,
            },
        });
    }
    sendMessage() {
    }
    getKeyValueStringArray(entity) {
        var keyValueStringArray = [];
        for (const [key, value] of Object.entries(entity)) {
            if (typeof value === 'object' && !Array.isArray(value) && value !== null) {
                keyValueStringArray.push(`\n*_[${key}]_*`);
                var subArray = this.getKeyValueStringArray(value);
                keyValueStringArray = [...keyValueStringArray, ...subArray];
            }
            else {
                if (key?.toLowerCase() !== 'id' &&
                    !key?.toLowerCase().includes('password'))
                    keyValueStringArray.push(`*${key}*: ${value}`);
            }
        }
        return keyValueStringArray;
    }
}
exports.GraphApiController = GraphApiController;
class Command {
    entity;
    tenantCode;
    action;
    entityCode;
}
exports.Command = Command;
class CommandInfo {
    name;
    actions;
}
exports.CommandInfo = CommandInfo;
var CommandEntity;
(function (CommandEntity) {
    CommandEntity["Help"] = "help";
    CommandEntity["Tenant"] = "tenant";
    CommandEntity["Licence"] = "licence";
    CommandEntity["Application"] = "application";
    CommandEntity["Database"] = "database";
    CommandEntity["Campaign"] = "campaign";
    CommandEntity["CampaignDisposition"] = "campaigndisposition";
    CommandEntity["Skill"] = "skill";
    CommandEntity["Callback"] = "callback";
    CommandEntity["ContactList"] = "contactlist";
    CommandEntity["CampaignAbandonCallList"] = "campaignabandoncalllist";
})(CommandEntity || (exports.CommandEntity = CommandEntity = {}));
var CommandAction;
(function (CommandAction) {
    CommandAction["Fetch"] = "fetch";
    CommandAction["Start"] = "start";
    CommandAction["Stop"] = "stop";
    CommandAction["Load"] = "load";
    CommandAction["Unload"] = "unload";
    CommandAction["Properties"] = "properties";
    CommandAction["Status"] = "status";
})(CommandAction || (exports.CommandAction = CommandAction = {}));
var Commands;
(function (Commands) {
    Commands["CommandList"] = "commandlist";
    Commands["TenantList"] = "tenantlist";
    Commands["TenantInfo"] = "tenantinfo";
    Commands["CampaignList"] = "campaignlist";
    Commands["CampaignInfo"] = "campaigninfo";
    Commands["CampaignStatus"] = "campaignstatus";
    Commands["StartCampaign"] = "startcampaign";
    Commands["StopCampaign"] = "stopcampaign";
    Commands["LoadCampaign"] = "loadcampaign";
    Commands["UnloadCampaign"] = "unloadcampaign";
})(Commands || (exports.Commands = Commands = {}));
//# sourceMappingURL=graphapi.controller.js.map