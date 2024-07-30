import axios from "axios";
import express from "express";
import { CommonService } from "./../services/common.service";
import { TenantInfo } from "./cc.controller";

export class GraphApiController{

    constructor(private common: CommonService){}

    async onWebhookPostMessageRecieved(request: express.Request, response: express.Response){

        this.common.logger.debug("Incoming webhook message:", JSON.stringify(request.body, null, 2));
        
        const recievedMessageObj = request.body.entry?.[0]?.changes[0]?.value?.messages?.[0];        
        if (recievedMessageObj?.type === "text") {

            const businessNumber = request.body.entry?.[0].changes?.[0].value?.metadata?.phone_number_id;
            
            try{

                var command: Command = await this.getCommandFromMessage(recievedMessageObj?.text?.body?.trim(), response);
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
                            var replyMessage = await this.fetchCommandList();
                            await this.sendReplyMessage(businessNumber, recievedMessageObj, `*Invalid command!* Available command list are;\n${replyMessage}`);
                            break;
                    }
                }else
                    await this.sendReplyMessage(businessNumber, recievedMessageObj, `*Invalid command!* Available command list are;\n${replyMessage}`);

            }catch(ex){
                await this.sendReplyMessage(businessNumber, recievedMessageObj, `*Invalid command!* Available command list are;\n${replyMessage}`);
            }

            await this.sendMarkAsRead(businessNumber, recievedMessageObj);
            
        }

        response.sendStatus(200);
    }

    async onTestMessageRecieved(request: express.Request, response: express.Response){

        var command: Command = await this.getCommandFromMessage(request?.body?.text?.trim(), response);
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

    async getCommandFromMessage(message: string, response: express.Response){
        var messages = message?.split('|');
        if(!messages || messages?.length === 0){
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
        command.id = messages[2];
        return command;
    }

    async fetchCommandList(): Promise<string>{
        var commands: any[] = Object.values(Commands);
        commands = commands.filter(s => s.toLowerCase() !== 'commandlist');
        commands.forEach((command: any) => {
            command = `*${command}`;
        });
        return commands.join('\n');
    }

    async fetchTenantList(): Promise<string>{

        var responseStringArray: any[] = [];
        var keyValueStringArray: any[] = [];

        var tenantInfos: TenantInfo[] = await this.common.ccController.fetchTenants();
        tenantInfos?.forEach((info: TenantInfo) => {
            keyValueStringArray = this.getKeyValueStringArray(info);
            responseStringArray.push(keyValueStringArray.join('\n'));
        });
        
        var replyMessage = responseStringArray.join(`\n===============================\n`);
        return replyMessage;
    }

    async onWebhookGetMessageRecieved(request: express.Request, response: express.Response){
        this.verifyWebhook(request, response);
    }

    private verifyWebhook(request: express.Request, response: express.Response){
        const mode = request.query["hub.mode"];
        const token = request.query["hub.verify_token"];
        const challenge = request.query["hub.challenge"];
      
        // check the mode and token sent are correct
        if (mode === "subscribe" && token === this.common.property.application.graphApi.verifyToken) {
          // respond with 200 OK and challenge token from the request
          response.status(200).send(challenge);
          console.log("Webhook verified successfully!");
        } else {
          // respond with '403 Forbidden' if verify tokens do not match
          response.sendStatus(403);
        }
    }

    private async sendReplyMessage(businessNumber: string, recievedMessageObj: any, replyMessage: any){
        await axios({
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

    private async sendMarkAsRead(businessNumber: string, recievedMessageObj: any){
        await axios({
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

    sendMessage(){

    }

    private getKeyValueStringArray(entity: any): any[]{
        var keyValueStringArray: any[] = [];
        for (const [key, value] of Object.entries(entity)) {

            if(typeof value === 'object' && !Array.isArray(value) && value !== null){
                keyValueStringArray.push(`\n*_[${key}]_*`);
                var subArray = this.getKeyValueStringArray(value);
                keyValueStringArray = [...keyValueStringArray, ...subArray];

            }else{
                if(key?.toLowerCase() !== 'id' &&
                !key?.toLowerCase().includes('password'))
                    keyValueStringArray.push(`*${key}*: ${value}`);
            }
        }

        return keyValueStringArray;
    }
}

export class Command{
    tenant!: string;
    name!: string;
    id!: string;
}

export enum Commands{
    CommandList = 'commandlist',
    TenantList = 'tenantlist',
    CampaignList = 'campaignlist',
    CampaignInfo = 'campaigninfo',
    CampaignStatus = 'campaignstatus',
    StartCampaign = 'startcampaign',
    StopCampaign = 'stopcampaign',
    LoadCampaign = 'loadcampaign',
    UnloadCampaign = 'unloadcampaign'
}