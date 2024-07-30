"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Commands = exports.GraphApiController = void 0;
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
                if (recievedMessageObj?.text?.body?.trim()?.toLowerCase() === 'commandlist') {
                    await this.onFetchCommandList(businessNumber, recievedMessageObj);
                }
                else
                    await this.sendReplyMessage(businessNumber, recievedMessageObj, `<b>Invalid command!</b>`);
                // var command: any = JSON.parse(recievedMessageObj?.text?.body?.trim());
                // switch(command?.ReqCode){
                //     case Commands.CommandList:
                //         await this.onFetchCommandList(businessNumber, recievedMessageObj);
                //         break;
                //     case Commands.CampaignList:
                //         break;
                //     case Commands.CampaignInfo:
                //         break;
                //     case Commands.CampaignStatus:
                //         break;
                //     case Commands.StartCampaign:
                //         break;
                //     case Commands.StopCampaign:
                //         break;
                //     case Commands.LoadCampaign:
                //         break;
                //     case Commands.UnloadCampaign:
                //         break;
                //     default:
                //         await this.sendReplyMessage(businessNumber, recievedMessageObj, `<b>Invalid command!</b>`);
                //         break;
                // }
            }
            catch (ex) {
                await this.sendReplyMessage(businessNumber, recievedMessageObj, `<b>Invalid command!</b>`);
            }
            await this.sendMarkAsRead(businessNumber, recievedMessageObj);
        }
        response.sendStatus(200);
    }
    async onFetchCommandList(businessNumber, recievedMessageObj) {
        var replyMessage = Object.values(Commands).join('\n');
        console.log(replyMessage);
        await this.sendReplyMessage(businessNumber, recievedMessageObj, replyMessage);
    }
    async onWebhookGetMessageRecieved(request, response) {
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
}
exports.GraphApiController = GraphApiController;
var Commands;
(function (Commands) {
    Commands["CommandList"] = "CommandList";
    Commands["CampaignList"] = "CampaignList";
    Commands["CampaignInfo"] = "CampaignInfo";
    Commands["CampaignStatus"] = "CampaignStatus";
    Commands["StartCampaign"] = "StartCampaign";
    Commands["StopCampaign"] = "StopCampaign";
    Commands["LoadCampaign"] = "LoadCampaign";
    Commands["UnloadCampaign"] = "UnloadCampaign";
})(Commands || (exports.Commands = Commands = {}));
//# sourceMappingURL=graphapi.controller.js.map