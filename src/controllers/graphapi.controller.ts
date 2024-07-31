import axios from "axios";
import express from "express";
import { CommonService } from "./../services/common.service";
import { TenantInfo } from "./cc.controller";

export class GraphApiController{

    private commandList: CommandInfo[] = [];

    constructor(private common: CommonService){
        this.registerAllCommands();
    }

    private registerAllCommands(){
        var cmdInfo = new CommandInfo();
        cmdInfo.name = CommandEntity.Application;
        cmdInfo.actions = [CommandAction.Fetch];
        this.commandList.push(cmdInfo);
        
        cmdInfo = new CommandInfo();
        cmdInfo.name = CommandEntity.Callback;
        cmdInfo.actions = [CommandAction.Fetch];
        this.commandList.push(cmdInfo);
        
        cmdInfo = new CommandInfo();
        cmdInfo.name = CommandEntity.Campaign;
        cmdInfo.actions = [CommandAction.Fetch, CommandAction.Properties, CommandAction.Status, CommandAction.Load, CommandAction.Start, CommandAction.Stop, CommandAction.Unload];
        this.commandList.push(cmdInfo);
        
        cmdInfo = new CommandInfo();
        cmdInfo.name = CommandEntity.CampaignAbandonCallList;
        cmdInfo.actions = [CommandAction.Fetch];
        this.commandList.push(cmdInfo);
        
        cmdInfo = new CommandInfo();
        cmdInfo.name = CommandEntity.CampaignDisposition;
        cmdInfo.actions = [CommandAction.Fetch];
        this.commandList.push(cmdInfo);
        
        cmdInfo = new CommandInfo();
        cmdInfo.name = CommandEntity.ContactList;
        cmdInfo.actions = [CommandAction.Fetch];
        this.commandList.push(cmdInfo);
        
        cmdInfo = new CommandInfo();
        cmdInfo.name = CommandEntity.Database;
        cmdInfo.actions = [CommandAction.Fetch, CommandAction.Status];
        this.commandList.push(cmdInfo);
        
        cmdInfo = new CommandInfo();
        cmdInfo.name = CommandEntity.Skill;
        cmdInfo.actions = [CommandAction.Fetch];
        this.commandList.push(cmdInfo);
        
        cmdInfo = new CommandInfo();
        cmdInfo.name = CommandEntity.Tenant;
        cmdInfo.actions = [CommandAction.Fetch, CommandAction.Status];
        this.commandList.push(cmdInfo);
        
        cmdInfo = new CommandInfo();
        cmdInfo.name = CommandEntity.Help;
        cmdInfo.actions = [];
        this.commandList.push(cmdInfo);
    }

    async onWebhookPostMessageRecieved(request: express.Request, response: express.Response){

        var replyMessage = '';
        this.common.logger.debug("Incoming webhook message:", JSON.stringify(request.body, null, 2));
        
        const recievedMessageObj = request.body.entry?.[0]?.changes[0]?.value?.messages?.[0];        
        if (recievedMessageObj?.type === "text") {

            const businessNumber = request.body.entry?.[0].changes?.[0].value?.metadata?.phone_number_id;
            
            try{

                var command: Command = await this.getCommandFromMessage(recievedMessageObj?.text?.body?.trim(), response);
                if (command) {


                    switch (command?.entity?.toLowerCase()) {
                        case CommandEntity.Help:
                            replyMessage = await this.fetchCommandList();
                            break;
                        case CommandEntity.Application:
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
                            break;
                        case CommandEntity.Skill:
                            break;
                        case CommandEntity.Tenant:
                            replyMessage = await this.onTenantCommandRecieved(command);
                            break;
                        default:
                            replyMessage = await this.fetchCommandListOnInvalidCommand();
                            break;
                    }


                }else{                    
                    replyMessage = await this.fetchCommandListOnInvalidCommand();
                }

            }catch(ex){                
                replyMessage = await this.fetchCommandListOnInvalidCommand();
            }

            if(!replyMessage)
                replyMessage = await this.fetchCommandListOnInvalidCommand();

            await this.sendReplyMessage(businessNumber, recievedMessageObj, replyMessage);
            await this.sendMarkAsRead(businessNumber, recievedMessageObj);
            
        }

        response.sendStatus(200);
    }

    async onTenantCommandRecieved(command: Command){
        var replyMessage = '';
        if(command.action === CommandAction.Fetch){
            if(!command.entityCode){
                replyMessage = await this.fetchTenantList();
            }else{                
                replyMessage = await this.fetchTenantInfo(command?.entityCode);
            }
        }

        if(!replyMessage){
            replyMessage = await this.fetchCommandListOnInvalidCommand();
        }

        return replyMessage;
    }

    async onTestMessageRecieved(request: express.Request, response: express.Response){

        var command: Command = await this.getCommandFromMessage(request?.body?.text?.trim(), response);
        if (command) {

            
            switch (command?.entity?.toLowerCase()) {
                case CommandEntity.Help:
                    var replyMessage = await this.fetchCommandList();
                    response.status(200).send(replyMessage);
                    break;
                case CommandEntity.Application:
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
                    break;
                case CommandEntity.Skill:
                    break;
                case CommandEntity.Tenant:
                    var replyMessage = await this.onTenantCommandRecieved(command);
                    response.status(200).send(replyMessage);
                    break;
                default:
                    var replyMessage = await this.fetchCommandListOnInvalidCommand();
                    response.status(500).send(replyMessage);
                    break;
            }
        }

    }

    async getCommandFromMessage(message: string, response: express.Response){
        var messages = message?.split('|');
        if(!messages || messages?.length === 0){
            var replyMessage = await this.fetchCommandListOnInvalidCommand();
            response.status(500).send(replyMessage);
            return undefined;
        }

        var command = new Command();
        command.entity = messages[0]?.trim();
        command.action = messages[1]?.trim();
        command.entityCode = messages[2]?.trim();
        command.tenantCode = messages[3]?.trim();
        return command;
    }

    async fetchCommandListOnInvalidCommand(): Promise<string>{
        var cmdArray: any[] = [];

        this.commandList.forEach((command: CommandInfo) => {

            if(command.name === CommandEntity.Help)
                cmdArray.push(`*${command.name}*\ni.e. ${command.name}`);

            else if(command.name === CommandEntity.Application ||
                command.name === CommandEntity.Database ||
                command.name === CommandEntity.Tenant){
                    var cmdStr = `*${command.name}*\ni.e. ${command.name}`;
                    if(command?.actions?.length > 0){
                        cmdStr += ` | [${command?.actions?.join(',')}]\n`
                    }
                    cmdArray.push(cmdStr);
                }
            
            else{
                var cmdStr = `*${command.name}*\ni.e. ${command.name}`;
                if(command?.actions?.length > 0){
                    cmdStr += ` | [${command?.actions?.join(',')}]`
                }
                cmdStr += ` | ${command.name}-code`;
                cmdStr += ` | tenant-code\n`;
                cmdArray.push(cmdStr);
            }
        });

        return `*Invalid command!*\nAvailable command list are;\n\n${cmdArray.join('\n')}`;
    }

    async fetchCommandList(): Promise<string>{

        var cmdArray: any[] = [];

        this.commandList.forEach((command: CommandInfo) => {

            if(command.name === CommandEntity.Help)
                cmdArray.push(`*${command.name}*\ni.e. ${command.name}`);

            else if(command.name === CommandEntity.Application ||
                command.name === CommandEntity.Database ||
                command.name === CommandEntity.Tenant){
                    var cmdStr = `*${command.name}*\ni.e. ${command.name}`;
                    if(command?.actions?.length > 0){
                        cmdStr += ` | [${command?.actions?.join(',')}]\n`
                    }
                    cmdArray.push(cmdStr);
                }
            
            else{
                var cmdStr = `*${command.name}*\ni.e. ${command.name}`;
                if(command?.actions?.length > 0){
                    cmdStr += ` | [${command?.actions?.join(',')}]`
                }
                cmdStr += ` | ${command.name}-code`;
                cmdStr += ` | tenant-code\n`;
                cmdArray.push(cmdStr);
            }
        });

        return cmdArray.join('\n');
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
        if(!replyMessage)
            replyMessage = `No tenants found`;
        return replyMessage;
    }

    async fetchTenantInfo(tenantCode: any): Promise<string>{

        var responseStringArray: any[] = [];
        var keyValueStringArray: any[] = [];

        var tenantInfos: TenantInfo[] = await this.common.ccController.fetchTenant(tenantCode);
        tenantInfos?.forEach((info: TenantInfo) => {
            keyValueStringArray = this.getKeyValueStringArray(info);
            responseStringArray.push(keyValueStringArray.join('\n'));
        });
        
        var replyMessage = responseStringArray.join(`\n===============================\n`);
        if(!replyMessage)
            replyMessage = `No tenant found`;
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
    entity!: string;
    tenantCode!: string;
    action!: string;
    entityCode!: string;
}

export class CommandInfo{
    name!: string;
    actions!: CommandAction[];
}

export enum CommandEntity{
    Help = 'help',
    Tenant = 'tenant',
    Application = 'application',
    Database = 'database',
    Campaign = 'campaign',
    CampaignDisposition = 'campaigndisposition',
    Skill = 'skill',
    Callback = 'callback',
    ContactList = 'contactlist',
    CampaignAbandonCallList = 'campaignabandoncalllist',
}

export enum CommandAction{
    Fetch = 'fetch',
    Start = 'start',
    Stop = 'stop',
    Load = 'load',
    Unload = 'unload',
    Properties = 'properties',
    Status = 'status'
}

export enum Commands{
    CommandList = 'commandlist',
    TenantList = 'tenantlist',
    TenantInfo = 'tenantinfo',
    CampaignList = 'campaignlist',
    CampaignInfo = 'campaigninfo',
    CampaignStatus = 'campaignstatus',
    StartCampaign = 'startcampaign',
    StopCampaign = 'stopcampaign',
    LoadCampaign = 'loadcampaign',
    UnloadCampaign = 'unloadcampaign'
}