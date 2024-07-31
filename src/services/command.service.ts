import express from "express";
import { CommonService } from "./../services/common.service";

export class CommandService{

    private commandList: CommandInfo[] = [];

    constructor(private common: CommonService){
        this.registerAllCommands();
    }

    private registerAllCommands(){
        var cmdInfo = new CommandInfo();
        cmdInfo.name = CommandEntity.Application;
        cmdInfo.actions = [CommandAction.List];
        this.commandList.push(cmdInfo);
        
        // cmdInfo = new CommandInfo();
        // cmdInfo.name = CommandEntity.Callback;
        // cmdInfo.actions = [CommandAction.List];
        // this.commandList.push(cmdInfo);
        
        cmdInfo = new CommandInfo();
        cmdInfo.name = CommandEntity.Campaign;
        cmdInfo.actions = [CommandAction.List, CommandAction.Properties, CommandAction.Status, CommandAction.Load, CommandAction.Start, CommandAction.Stop, CommandAction.Unload];
        this.commandList.push(cmdInfo);
        
        // cmdInfo = new CommandInfo();
        // cmdInfo.name = CommandEntity.CampaignAbandonCallList;
        // cmdInfo.actions = [CommandAction.List];
        // this.commandList.push(cmdInfo);
        
        // cmdInfo = new CommandInfo();
        // cmdInfo.name = CommandEntity.CampaignDisposition;
        // cmdInfo.actions = [CommandAction.List];
        // this.commandList.push(cmdInfo);
        
        // cmdInfo = new CommandInfo();
        // cmdInfo.name = CommandEntity.ContactList;
        // cmdInfo.actions = [CommandAction.List];
        // this.commandList.push(cmdInfo);
        
        cmdInfo = new CommandInfo();
        cmdInfo.name = CommandEntity.Database;
        cmdInfo.actions = [CommandAction.List, CommandAction.Status];
        this.commandList.push(cmdInfo);
        
        // cmdInfo = new CommandInfo();
        // cmdInfo.name = CommandEntity.Skill;
        // cmdInfo.actions = [CommandAction.List];
        // this.commandList.push(cmdInfo);
        
        cmdInfo = new CommandInfo();
        cmdInfo.name = CommandEntity.Licence;
        cmdInfo.actions = [CommandAction.List];
        this.commandList.push(cmdInfo);
        
        cmdInfo = new CommandInfo();
        cmdInfo.name = CommandEntity.Tenant;
        cmdInfo.actions = [CommandAction.List, CommandAction.Status, CommandAction.Start, CommandAction.Stop];
        this.commandList.push(cmdInfo);
        
        cmdInfo = new CommandInfo();
        cmdInfo.name = CommandEntity.Help;
        cmdInfo.actions = [];
        this.commandList.push(cmdInfo);
    }

    async readCommandFromMessage(message: string, response: express.Response): Promise<Command>{
        var messages = message?.split('-');
        if(!messages || messages?.length === 0){
            var replyMessage = await this.fetchCommandList(true);
            response.status(500).send(replyMessage);
            return undefined;
        }

        var command = new Command();
        command.entity = messages[0]?.trim();
        command.action = messages[1]?.trim();
        command.tenantCode = messages[2]?.trim()?.toUpperCase();
        command.entityCode = messages[3]?.trim()?.toUpperCase();
        return command;
    }

    async fetchCommandList(isInvalidCommand: boolean = false): Promise<string>{

        var cmdArray: any[] = [];

        this.commandList.forEach((command: CommandInfo) => {

            if(command.name === CommandEntity.Help)
                cmdArray.push(`*${command.name}*\ni.e. ${command.name}`);

            else if(command.name === CommandEntity.Application ||
                command.name === CommandEntity.Database ||
                command.name === CommandEntity.Tenant){
                    var cmdStr = `*${command.name}*\ni.e. ${command.name}`;
                    if(command?.actions?.length > 0){
                        cmdStr += `-[${command?.actions?.join(',')}]`
                    }
                    cmdStr += `-${command.name}Code\n`;
                    cmdArray.push(cmdStr);
                }
            
            else{
                var cmdStr = `*${command.name}*\ni.e. ${command.name}`;
                if(command?.actions?.length > 0){
                    cmdStr += `-[${command?.actions?.join(',')}]`
                }
                cmdStr += `-${command.name}Code`;
                cmdStr += `-tenantCode\n`;
                cmdArray.push(cmdStr);
            }
        });

        if(isInvalidCommand)
            return `*Invalid command!*\nAvailable command list are;\n\n${cmdArray.join('\n')}`;
        else
            return cmdArray.join('\n');
    }

    async onTestMessageRecieved(request: express.Request, response: express.Response){
        var replyMessage = await this.processCommand(request?.body?.text?.trim(), response);        
        response.status(200).send(replyMessage);
    }

    async processCommand(commandString: any, response: express.Response): Promise<string>{

        var replyMessage = '';

        try{

            var command: Command = await this.common.cmdSvc.readCommandFromMessage(commandString?.trim(), response);
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
                        replyMessage = await this.onCampaignCommandRecieved(command);
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
                        replyMessage = await this.fetchCommandList(true);
                        break;
                }


            }else{                    
                replyMessage = await this.fetchCommandList(true);
            }

        }catch(ex){                
            replyMessage = await this.fetchCommandList(true);
        }

        if(!replyMessage)
            replyMessage = await this.fetchCommandList(true);

        return replyMessage;
    }

    async onApplicationCommandRecieved(command: Command){
        var replyMessage = '';
        if(command.action === CommandAction.List){
            if(!command.entityCode){
                replyMessage = await this.common.appController.fetchApplicationsResponse();
            }else{                
                replyMessage = await this.common.appController.fetchApplicationResponse(command?.entityCode);
            }
        }

        if(!replyMessage){
            replyMessage = await this.fetchCommandList(true);
        }

        return replyMessage;
    }

    async onDatabaseCommandRecieved(command: Command){
        var replyMessage = '';
        if(command.action === CommandAction.List){
            if(!command.entityCode){
                replyMessage = await this.common.dbController.fetchDatabasesResponse();
            }else{                
                replyMessage = await this.common.dbController.fetchDatabaseResponse(command?.entityCode);
            }
        }

        if(!replyMessage){
            replyMessage = await this.fetchCommandList(true);
        }

        return replyMessage;
    }

    async onTenantCommandRecieved(command: Command){
        var replyMessage = '';
        if(command.action === CommandAction.List){
            if(!command.entityCode){
                replyMessage = await this.common.tenantController.fetchTenantsResponse();
            }else{                
                replyMessage = await this.common.tenantController.fetchTenantResponse(command?.entityCode);
            }
        }

        if(command.action === CommandAction.Status){
            if(!command.entityCode)
                replyMessage = `Invalid tenant code!`;
            else{                
                replyMessage = await this.common.tenantController.fetchTenantStatusResponse(command?.entityCode);
            }
        }

        if(command.action === CommandAction.Start){            
            if(!command.entityCode)
                replyMessage = `Invalid tenant code!`;
            else{                
                replyMessage = await this.common.tenantController.startTenantResponse(command?.entityCode);
            }
        }

        if(command.action === CommandAction.Stop){                 
            if(!command.entityCode)
                replyMessage = `Invalid tenant code!`;
            else{                
                replyMessage = await this.common.tenantController.stopTenantResponse(command?.entityCode);
            }
        }

        if(!replyMessage){
            replyMessage = await this.fetchCommandList(true);
        }

        return replyMessage;
    }

    async onLicenseCommandRecieved(command: Command){
        var replyMessage = '';
        if(command.action === CommandAction.List){
            if(!command.entityCode){
                replyMessage = `Invalid tenant code!`;
            }else{                
                replyMessage = await this.common.licenceController.fetchLicenseResponse(command?.entityCode);
            }
        }

        if(!replyMessage){
            replyMessage = await this.fetchCommandList(true);
        }

        return replyMessage;
    }

    async onCampaignCommandRecieved(command: Command){
        var replyMessage = '';
        if(command.action === CommandAction.List){
            if(command.entityCode && command.tenantCode){
                replyMessage = await this.common.campaignController.fetchCampaignResponse(command?.tenantCode, command?.entityCode);
            }else if(command.tenantCode){                
                replyMessage = await this.common.campaignController.fetchCampaignsResponse(command?.tenantCode);
            }else{                
                replyMessage = `Invalid tenant code!`;
            }
        }

        if(command.action === CommandAction.Status){
            if(command.entityCode && command.tenantCode){
                replyMessage = await this.common.campaignController.fetchCampaignStatusResponse(command?.tenantCode, command?.entityCode);
            }else{                
                replyMessage = `Invalid tenant code!`;
            }
        }

        if(command.action === CommandAction.Properties){
            if(command.entityCode && command.tenantCode){
                replyMessage = await this.common.campaignController.fetchCampaignPropertiesResponse(command?.tenantCode, command?.entityCode);
            }else{                
                replyMessage = `Invalid tenant code!`;
            }
        }

        if(command.action === CommandAction.Start){
            if(command.entityCode && command.tenantCode){
                replyMessage = await this.common.campaignController.startCampaignResponse(command?.tenantCode, command?.entityCode);
            }else{                
                replyMessage = `Invalid tenant code!`;
            }
        }

        if(command.action === CommandAction.Stop){
            if(command.entityCode && command.tenantCode){
                replyMessage = await this.common.campaignController.stopCampaignResponse(command?.tenantCode, command?.entityCode);
            }else{                
                replyMessage = `Invalid tenant code!`;
            }
        }

        if(command.action === CommandAction.Load){
            if(command.entityCode && command.tenantCode){
                replyMessage = await this.common.campaignController.loadCampaignResponse(command?.tenantCode, command?.entityCode);
            }else{                
                replyMessage = `Invalid tenant code!`;
            }
        }

        if(command.action === CommandAction.Unload){
            if(command.entityCode && command.tenantCode){
                replyMessage = await this.common.campaignController.unloadCampaignResponse(command?.tenantCode, command?.entityCode);
            }else{                
                replyMessage = `Invalid tenant code!`;
            }
        }

        if(!replyMessage){
            replyMessage = await this.fetchCommandList(true);
        }

        return replyMessage;
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
    Licence = 'licence',
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
    List = 'list',
    Start = 'start',
    Stop = 'stop',
    Load = 'load',
    Unload = 'unload',
    Properties = 'properties',
    Status = 'status'
}