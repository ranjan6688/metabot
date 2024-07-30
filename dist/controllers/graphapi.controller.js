"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Commands = exports.Command = exports.GraphApiController = void 0;
const axios_1 = __importDefault(require("axios"));
class GraphApiController {
    common;
    constructor(common) {
        this.common = common;
    }
    async onWebhookPostMessageRecieved(request, response) {
        this.common.logger.debug("Incoming webhook message:", JSON.stringify(request.body, null, 2));
        const recievedMessageObj = request.body.entry?.[0]?.changes[0]?.value?.messages?.[0];
        if (recievedMessageObj?.type === "text") {
            const businessNumber = request.body.entry?.[0].changes?.[0].value?.metadata?.phone_number_id;
            try {
                var command = await this.getCommandFromMessage(recievedMessageObj?.text?.body?.trim(), response);
                if (command) {
                    switch (command?.name?.toLowerCase()) {
                        case Commands.CommandList:
                            var replyMessage = await this.fetchCommandList();
                            await this.sendReplyMessage(businessNumber, recievedMessageObj, replyMessage);
                            break;
                        case Commands.TenantList:
                            var replyMessage = await this.fetchTenantList();
                            await this.sendReplyMessage(businessNumber, recievedMessageObj, replyMessage);
                            break;
                        case Commands.CampaignList:
                            break;
                        case Commands.CampaignInfo:
                            break;
                        case Commands.CampaignStatus:
                            break;
                        case Commands.StartCampaign:
                            break;
                        case Commands.StopCampaign:
                            break;
                        case Commands.LoadCampaign:
                            break;
                        case Commands.UnloadCampaign:
                            break;
                        default:
                            var replyMessage = await this.fetchCommandListOnInvalidCommand();
                            await this.sendReplyMessage(businessNumber, recievedMessageObj, `${replyMessage}`);
                            break;
                    }
                }
                else {
                    var replyMessage = await this.fetchCommandListOnInvalidCommand();
                    await this.sendReplyMessage(businessNumber, recievedMessageObj, `${replyMessage}`);
                }
            }
            catch (ex) {
                var replyMessage = await this.fetchCommandListOnInvalidCommand();
                await this.sendReplyMessage(businessNumber, recievedMessageObj, `${replyMessage}`);
            }
            await this.sendMarkAsRead(businessNumber, recievedMessageObj);
        }
        response.sendStatus(200);
    }
    async onTestMessageRecieved(request, response) {
        var command = await this.getCommandFromMessage(request?.body?.text?.trim(), response);
        if (command) {
            switch (command?.name?.toLowerCase()) {
                case Commands.CommandList:
                    var replyMessage = await this.fetchCommandList();
                    response.status(200).send(replyMessage);
                    break;
                case Commands.TenantList:
                    var replyMessage = await this.fetchTenantList();
                    response.status(200).send(replyMessage);
                    break;
                case Commands.CampaignList:
                    break;
                case Commands.CampaignInfo:
                    break;
                case Commands.CampaignStatus:
                    break;
                case Commands.StartCampaign:
                    break;
                case Commands.StopCampaign:
                    break;
                case Commands.LoadCampaign:
                    break;
                case Commands.UnloadCampaign:
                    break;
                default:
                    var replyMessage = await this.fetchCommandList();
                    response.status(500).send(`*Invalid command!* Available command list are;\n${replyMessage}`);
                    break;
            }
        }
    }
    async getCommandFromMessage(message, response) {
        var messages = message?.split('|');
        if (!messages || messages?.length === 0) {
            var replyMessage = await this.fetchCommandList();
            response.status(500).send(`*Invalid command!* Available command list are;\n${replyMessage}`);
            return undefined;
        }
        // if(!messages[0]){
        //     response.status(500).send(`Invalid entity name!`);
        //     return undefined;
        // }
        // if(!messages[1]){
        //     response.status(500).send(`Invalid tenant!`);
        //     return undefined;
        // }
        // if(!messages[2]){
        //     response.status(500).send(`Invalid entity id!`);
        //     return undefined;
        // }
        var command = new Command();
        command.name = messages[0];
        command.tenant = messages[1];
        command.code = messages[2];
        return command;
    }
    async fetchCommandListOnInvalidCommand() {
        var commands = Object.values(Commands);
        commands = commands.filter(s => s.toLowerCase() !== 'commandlist');
        commands.forEach((command) => {
            command = `* ${command}`;
        });
        return `*Invalid command!*\nAvailable command list are;\n${commands.join('\n')}`;
    }
    async fetchCommandList() {
        var commands = Object.values(Commands);
        commands = commands.filter(s => s.toLowerCase() !== 'commandlist');
        commands.forEach((command) => {
            command = `*${command}`;
        });
        return commands.join('\n');
    }
    async fetchTenantList() {
        var responseStringArray = [];
        var keyValueStringArray = [];
        var tenantInfos = await this.common.ccController.fetchTenants();
        tenantInfos?.forEach((info) => {
            keyValueStringArray = this.getKeyValueStringArray(info);
            responseStringArray.push(keyValueStringArray.join('\n'));
        });
        var replyMessage = responseStringArray.join(`\n===============================\n`);
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
        if (mode === "subscribe" && token === this.common.property.application.graphApi.verifyToken) {
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
    tenant;
    name;
    code;
}
exports.Command = Command;
var Commands;
(function (Commands) {
    Commands["CommandList"] = "commandlist";
    Commands["TenantList"] = "tenantlist";
    Commands["CampaignList"] = "campaignlist";
    Commands["CampaignInfo"] = "campaigninfo";
    Commands["CampaignStatus"] = "campaignstatus";
    Commands["StartCampaign"] = "startcampaign";
    Commands["StopCampaign"] = "stopcampaign";
    Commands["LoadCampaign"] = "loadcampaign";
    Commands["UnloadCampaign"] = "unloadcampaign";
})(Commands || (exports.Commands = Commands = {}));
//# sourceMappingURL=graphapi.controller.js.map