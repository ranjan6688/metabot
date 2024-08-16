import { HttpResultType, RTClient, RtService, RTService, RtServiceInfo } from "./../services/rt.service";
import { CommonService } from "./../services/common.service";
import { TenantInfo } from "./tenant.controller";

export class RTController{

    constructor(private common: CommonService){}

    private async getRTClient(tenantCode: any): Promise<RTClient | undefined>{

        var result: any = await this.common.ccSvc.register();
        if(result?.ResultType === HttpResultType.Success){

            var sessionId = result?.Response?.SessionId;

            result = await this.common.tenantController.fetchTenantDefaultAdmin(sessionId, tenantCode);
            var tenantInfo: TenantInfo = result && result[0];
            if(!tenantInfo){
                this.common.logger.error(`No tenant found!`);
            }else{
                var client: RTClient = new RTClient();
                client.ApplicationCode = `Atomos`;
                client.ClientCode = tenantCode;
                client.Username = tenantInfo.DefaultAdmin.LoginId;
                client.Password = tenantInfo.DefaultAdmin.Password;

                await this.common.ccSvc.logout(sessionId);
                return client;
            }
            
        }else{
            this.common.logger.error(result.Exception);
        }

        await this.common.ccSvc.logout(sessionId);
        return undefined;
    }

    private async fetchAgentStatus(tenantCode: any): Promise<any[] | undefined>{

        var client: RTClient = await this.getRTClient(tenantCode);
        if(client){

            var result = await this.common.rtSvc.register();
            if(result?.ResultType === HttpResultType.Success){
    
                var sessionId = result?.Response?.SessionId;
                
                result = await this.common.rtSvc.login(sessionId, client);
                if(result?.ResultType === HttpResultType.Success){

                    var service = new RtServiceInfo();
                    service.rtClient = client;
                    service.serviceName = RtService.Agent;
                    
                    result = await this.common.rtSvc.registerSvc(sessionId, service);
                    if(result?.ResultType === HttpResultType.Success){
                        return result?.Response?.CurrentStatus;
                    }else{
                        this.common.logger.error(result.Exception);
                    }
                }else{
                    this.common.logger.error(result.Exception);
                }
            }else{
                this.common.logger.error(result.Exception);
            }
    
            await this.common.rtSvc.logout(sessionId);
        }

        return undefined;
    }

    private async fetchCampaignStatus(tenantCode: any): Promise<any[] | undefined>{

        var client: RTClient = await this.getRTClient(tenantCode);
        if(client){

            var result = await this.common.rtSvc.register();
            if(result?.ResultType === HttpResultType.Success){
    
                var sessionId = result?.Response?.SessionId;
                
                result = await this.common.rtSvc.login(sessionId, client);
                if(result?.ResultType === HttpResultType.Success){

                    var service = new RtServiceInfo();
                    service.rtClient = client;
                    service.serviceName = RtService.Campaign;
                    
                    result = await this.common.rtSvc.registerSvc(sessionId, service);
                    if(result?.ResultType === HttpResultType.Success){
                        return result?.Response?.CurrentStatus;
                    }else{
                        this.common.logger.error(result.Exception);
                    }
                }else{
                    this.common.logger.error(result.Exception);
                }
            }else{
                this.common.logger.error(result.Exception);
            }
    
            await this.common.rtSvc.logout(sessionId);
        }

        return undefined;
    }

    private async fetchCallStatus(tenantCode: any): Promise<any[] | undefined>{

        var client: RTClient = await this.getRTClient(tenantCode);
        if(client){

            var result = await this.common.rtSvc.register();
            if(result?.ResultType === HttpResultType.Success){
    
                var sessionId = result?.Response?.SessionId;
                
                result = await this.common.rtSvc.login(sessionId, client);
                if(result?.ResultType === HttpResultType.Success){

                    var service = new RtServiceInfo();
                    service.rtClient = client;
                    service.serviceName = RtService.Call;
                    
                    result = await this.common.rtSvc.registerSvc(sessionId, service);
                    if(result?.ResultType === HttpResultType.Success){
                        return result?.Response?.CurrentStatus;
                    }else{
                        this.common.logger.error(result.Exception);
                    }
                }else{
                    this.common.logger.error(result.Exception);
                }
            }else{
                this.common.logger.error(result.Exception);
            }
    
            await this.common.rtSvc.logout(sessionId);
        }

        return undefined;
    }

    private async fetchChatStatus(tenantCode: any): Promise<any[] | undefined>{

        var client: RTClient = await this.getRTClient(tenantCode);
        if(client){

            var result = await this.common.rtSvc.register();
            if(result?.ResultType === HttpResultType.Success){
    
                var sessionId = result?.Response?.SessionId;
                
                result = await this.common.rtSvc.login(sessionId, client);
                if(result?.ResultType === HttpResultType.Success){

                    var service = new RtServiceInfo();
                    service.rtClient = client;
                    service.serviceName = RtService.Chat;
                    
                    result = await this.common.rtSvc.registerSvc(sessionId, service);
                    if(result?.ResultType === HttpResultType.Success){
                        return result?.Response?.CurrentStatus;
                    }else{
                        this.common.logger.error(result.Exception);
                    }
                }else{
                    this.common.logger.error(result.Exception);
                }
            }else{
                this.common.logger.error(result.Exception);
            }
    
            await this.common.rtSvc.logout(sessionId);
        }

        return undefined;
    }

    private async fetchEmailStatus(tenantCode: any): Promise<any[] | undefined>{

        var client: RTClient = await this.getRTClient(tenantCode);
        if(client){

            var result = await this.common.rtSvc.register();
            if(result?.ResultType === HttpResultType.Success){
    
                var sessionId = result?.Response?.SessionId;
                
                result = await this.common.rtSvc.login(sessionId, client);
                if(result?.ResultType === HttpResultType.Success){

                    var service = new RtServiceInfo();
                    service.rtClient = client;
                    service.serviceName = RtService.Email;
                    
                    result = await this.common.rtSvc.registerSvc(sessionId, service);
                    if(result?.ResultType === HttpResultType.Success){
                        return result?.Response?.CurrentStatus;
                    }else{
                        this.common.logger.error(result.Exception);
                    }
                }else{
                    this.common.logger.error(result.Exception);
                }
            }else{
                this.common.logger.error(result.Exception);
            }
    
            await this.common.rtSvc.logout(sessionId);
        }

        return undefined;
    }

    private async fetchQueueStatus(tenantCode: any): Promise<any[] | undefined>{

        var client: RTClient = await this.getRTClient(tenantCode);
        if(client){

            var result = await this.common.rtSvc.register();
            if(result?.ResultType === HttpResultType.Success){
    
                var sessionId = result?.Response?.SessionId;
                
                result = await this.common.rtSvc.login(sessionId, client);
                if(result?.ResultType === HttpResultType.Success){

                    var service = new RtServiceInfo();
                    service.rtClient = client;
                    service.serviceName = RtService.Queue;
                    
                    result = await this.common.rtSvc.registerSvc(sessionId, service);
                    if(result?.ResultType === HttpResultType.Success){
                        return result?.Response?.CurrentStatus;
                    }else{
                        this.common.logger.error(result.Exception);
                    }
                }else{
                    this.common.logger.error(result.Exception);
                }
            }else{
                this.common.logger.error(result.Exception);
            }
    
            await this.common.rtSvc.logout(sessionId);
        }

        return undefined;
    }

    private async callBargeIn(tenantCode: any, uxSessId: any, toAddress: any): Promise<boolean>{

        var infos: any[] = await this.fetchCallStatus(tenantCode);
        var info = infos?.find(s => s.UCallID?.toUpperCase() === uxSessId?.toUpperCase());
        if(info){
            return await this.common.ccController.callBargeIn(tenantCode, info, toAddress);
        }

        return false;
    }

    async fetchAgentStatusResponse(tenantCode: any): Promise<string>{

        var responseStringArray: any[] = [];
        var keyValueStringArray: any[] = [];

        var infos: any[] = await this.fetchAgentStatus(tenantCode);
        infos = this.getAgentStatusObject(infos);
        infos?.forEach((info: any) => {
            keyValueStringArray = this.getKeyValueStringArray(info);
            responseStringArray.push(keyValueStringArray.join('\n'));
        });
        
        var replyMessage = responseStringArray.join(`\n===============================\n`);
        if(!replyMessage)
            replyMessage = `No data`;
        return replyMessage;
    }

    async fetchCampaignStatusResponse(tenantCode: any): Promise<string>{

        var responseStringArray: any[] = [];
        var keyValueStringArray: any[] = [];

        var infos: any[] = await this.fetchCampaignStatus(tenantCode);
        infos = this.getCampaignStatusObject(infos);
        infos?.forEach((info: any) => {
            keyValueStringArray = this.getKeyValueStringArray(info);
            responseStringArray.push(keyValueStringArray.join('\n'));
        });
        
        var replyMessage = responseStringArray.join(`\n===============================\n`);
        if(!replyMessage)
            replyMessage = `No data`;
        return replyMessage;
    }

    async fetchCallStatusResponse(tenantCode: any): Promise<string>{

        var responseStringArray: any[] = [];
        var keyValueStringArray: any[] = [];

        var infos: any[] = await this.fetchCallStatus(tenantCode);
        infos = this.getCallStatusObject(infos);
        infos?.forEach((info: any) => {
            keyValueStringArray = this.getKeyValueStringArray(info);
            responseStringArray.push(keyValueStringArray.join('\n'));
        });
        
        var replyMessage = responseStringArray.join(`\n===============================\n`);
        if(!replyMessage)
            replyMessage = `No data`;
        return replyMessage;
    }

    async fetchChatStatusResponse(tenantCode: any): Promise<string>{

        var responseStringArray: any[] = [];
        var keyValueStringArray: any[] = [];

        var infos: any[] = await this.fetchChatStatus(tenantCode);
        infos = this.getChatStatusObject(infos);
        infos?.forEach((info: any) => {
            keyValueStringArray = this.getKeyValueStringArray(info);
            responseStringArray.push(keyValueStringArray.join('\n'));
        });
        
        var replyMessage = responseStringArray.join(`\n===============================\n`);
        if(!replyMessage)
            replyMessage = `No data`;
        return replyMessage;
    }

    async fetchEmailStatusResponse(tenantCode: any): Promise<string>{

        var responseStringArray: any[] = [];
        var keyValueStringArray: any[] = [];

        var infos: any[] = await this.fetchEmailStatus(tenantCode);
        infos = this.getEmailStatusObject(infos);
        infos?.forEach((info: any) => {
            keyValueStringArray = this.getKeyValueStringArray(info);
            responseStringArray.push(keyValueStringArray.join('\n'));
        });
        
        var replyMessage = responseStringArray.join(`\n===============================\n`);
        if(!replyMessage)
            replyMessage = `No data`;
        return replyMessage;
    }

    async fetchQueueStatusResponse(tenantCode: any): Promise<string>{

        var responseStringArray: any[] = [];
        var keyValueStringArray: any[] = [];

        var infos: any[] = await this.fetchQueueStatus(tenantCode);
        infos = this.getQueueStatusObject(infos);
        infos?.forEach((info: any) => {
            keyValueStringArray = this.getKeyValueStringArray(info);
            responseStringArray.push(keyValueStringArray.join('\n'));
        });
        
        var replyMessage = responseStringArray.join(`\n===============================\n`);
        if(!replyMessage)
            replyMessage = `No data`;
        return replyMessage;
    }

    async callBargeInResponse(tenantCode: any, uxSessId: any, toAddress: any): Promise<string>{

        var responseStringArray: any[] = [];
        var keyValueStringArray: any[] = [];

        var flag: boolean = await this.callBargeIn(tenantCode, uxSessId, toAddress);
        keyValueStringArray.push(flag === true ? 'Call barged in successfully!' : 'Call not found!');
        responseStringArray.push(keyValueStringArray.join('\n'));
        
        var replyMessage = responseStringArray.join(`\n===============================\n`);
        if(!replyMessage)
            replyMessage = `No data`;
        return replyMessage;
    }

    private getCampaignStatusObject(entities: any): CampaignStatusInfo[]{

        var infos: CampaignStatusInfo[] = [];

        entities?.forEach((entity: any) => {
            var info: CampaignStatusInfo = new CampaignStatusInfo();
            info.Channels = entity.Channels;
            info.Code = entity.Code;
            info.DialMode = entity.DialMode;
            info.Id = entity.Id;
            info.Name = entity.Name;
            info.State = entity.CampaignState;
            info.Type = entity.CampaignType;
            info.Agents = [];
            
            entity?.Agents.forEach((agentInfo: any) => {
                var agent = new AgentInfo();
                agent.LoginId = agentInfo.LoginId;
                agent.Name = agentInfo.Name;
                agent.State = agentInfo.AgentState;
                agent.Terminals = [];

                for (const [key, value] of Object.entries(agentInfo.Terminals)) {
                    var _value: any = value;
                    if(value){
                        var terminal = new TermialInfo();
                        terminal.Address = _value.Address;
                        terminal.Channel = _value.Channel;
                        terminal.State = _value.TerminalState;
                        terminal.XServer = _value.XServerCode;
                        agent.Terminals.push(terminal);
                    }
                }

                if(agent.Terminals?.length === 0)
                    delete agent.Terminals;

                info.Agents.push(agent);
            });

            if (info.Agents?.length === 0)
                delete info.Agents;

            info.Queues = [];
            
            entity?.Queues.forEach((queueInfo: any) => {
                var queue = new QueueInfo();
                queue.Channel = queueInfo.Channel;
                queue.Code = queueInfo.Code;
                queue.Name = queueInfo.Name;
                info.Queues.push(queue);
            });

            if (info.Queues?.length === 0)
                delete info.Queues;

            infos.push(info);
        });

        return infos;
    }

    private getAgentStatusObject(entities: any): AgentStatusInfo[]{

        var infos: AgentStatusInfo[] = [];

        entities?.forEach((entity: any) => {
            var info: AgentStatusInfo = new AgentStatusInfo();
            info.State = entity.AgentState;
            info.LoginId = entity.LoginId;
            info.Name = entity.Name;
            info.Campaigns = [];
            
            entity?.Campaigns.forEach((campaignInfo: any) => {
                var campaign = new CampaignInfo();
                campaign.Channels = campaignInfo.Channels;
                campaign.Code = campaignInfo.Code;
                campaign.DialMode = campaignInfo.DialMode;
                campaign.State = campaignInfo.CampaignState;
                campaign.Type = campaignInfo.CampaignType;
                info.Campaigns.push(campaign);
            });

            if (info.Campaigns?.length === 0)
                delete info.Campaigns;

            info.Queues = [];
            
            entity?.Queues.forEach((queueInfo: any) => {
                var queue = new QueueInfo();
                queue.Channel = queueInfo.Channel;
                queue.Code = queueInfo.Code;
                queue.Name = queueInfo.Name;
                info.Queues.push(queue);
            });

            if (info.Queues?.length === 0)
                delete info.Queues;

            info.Terminals = [];

            for (const [key, value] of Object.entries(entity.Terminals)) {
                var _value: any = value;
                if(value){
                    var terminal = new TermialInfo();
                    terminal.Address = _value.Address;
                    terminal.Channel = _value.Channel;
                    terminal.State = _value.TerminalState;
                    terminal.XServer = _value.XServerCode;
                    info.Terminals.push(terminal);
                }
            }

            if (info.Terminals?.length === 0)
                delete info.Terminals;

            infos.push(info);
        });

        return infos;
    }

    private getCallStatusObject(entities: any): CallStatusInfo[]{

        var infos: CallStatusInfo[] = [];

        entities?.forEach((entity: any) => {
            var info: CallStatusInfo = new CallStatusInfo();
            info.CallerID = entity.CallerID;
            info.DialedID = entity.DialedID;
            info.DialedString = entity.DialedString;
            info.State = entity.CallState;
            info.Status = entity.CallStatus;
            info.Type = entity.CallType;
            info.UCallID = entity.UCallID;

            if (entity.Campaign) {
                info.Campaign = new CampaignInfo();
                info.Campaign.Channels = entity.Campaign.Channels;
                info.Campaign.Code = entity.Campaign.Code;
                info.Campaign.DialMode = entity.Campaign.DialMode;
                info.Campaign.State = entity.Campaign.CampaignState;
                info.Campaign.Type = entity.Campaign.CampaignType;
            }

            if (entity.CurrAgent) {
                info.Agent = new AgentInfo();
                info.Agent.LoginId = entity.CurrAgent.LoginId;
                info.Agent.Name = entity.CurrAgent.Name;
                info.Agent.State = entity.CurrAgent.AgentState;
                info.Agent.Queues = [];

                entity?.CurrAgent?.Queues.forEach((queueInfo: any) => {
                    var queue = new QueueInfo();
                    queue.Channel = queueInfo.Channel;
                    queue.Code = queueInfo.Code;
                    queue.Name = queueInfo.Name;
                    queue.AgentState = queueInfo.Agents[info.Agent.LoginId].AgentState;
                    info.Agent.Queues.push(queue);
                });

                if (info.Agent.Queues?.length === 0)
                    delete info.Agent.Queues;
            }

            if (entity?.CurrAgent?.Terminals) {
                info.Terminals = [];

                for (const [key, value] of Object.entries(entity?.CurrAgent?.Terminals)) {
                    var _value: any = value;
                    if (value) {
                        var terminal = new TermialInfo();
                        terminal.Address = _value.Address;
                        terminal.Channel = _value.Channel;
                        terminal.State = _value.TerminalState;
                        terminal.XServer = _value.XServerCode;
                        info.Terminals.push(terminal);
                    }
                }

                if (info.Terminals?.length === 0)
                    delete info.Terminals;
            }
            infos.push(info);
        });

        return infos;
    }

    private getChatStatusObject(entities: any): ChatStatusInfo[]{

        var infos: ChatStatusInfo[] = [];

        entities?.forEach((entity: any) => {
            var info: ChatStatusInfo = new ChatStatusInfo();
            info.CallerID = entity.CallerID;
            info.DialedID = entity.DialedID;
            info.DialedString = entity.DialedString;
            info.State = entity.XSessState;
            info.Status = entity.XSessStatus;
            info.Type = entity.XSessType;
            info.USessID = entity.USessID;
            info.CDNAddress = entity.CDNAddress;
            info.QueueAddress = entity.QueueAddress;

            if(entity.Campaign){
                info.Campaign = new CampaignInfo();
                info.Campaign.Channels = entity.Campaign.Channels;
                info.Campaign.Code = entity.Campaign.Code;
                info.Campaign.DialMode = entity.Campaign.DialMode;
                info.Campaign.State = entity.Campaign.CampaignState;
                info.Campaign.Type = entity.Campaign.CampaignType;
            }

            if (entity.CurrAgent) {
                info.Agent = new AgentInfo();
                info.Agent.LoginId = entity.CurrAgent.LoginId;
                info.Agent.Name = entity.CurrAgent.Name;
                info.Agent.State = entity.CurrAgent.AgentState;
                info.Agent.Queues = [];

                entity?.CurrAgent?.Queues.forEach((queueInfo: any) => {
                    var queue = new QueueInfo();
                    queue.Channel = queueInfo.Channel;
                    queue.Code = queueInfo.Code;
                    queue.Name = queueInfo.Name;
                    queue.AgentState = queueInfo.Agents[info.Agent.LoginId].AgentState;
                    info.Agent.Queues.push(queue);
                });

                if (info.Agent.Queues?.length === 0)
                    delete info.Agent.Queues;
            }

            if (entity?.CurrAgent?.Terminals) {
                info.Terminals = [];

                for (const [key, value] of Object.entries(entity?.CurrAgent?.Terminals)) {
                    var _value: any = value;
                    if (value) {
                        var terminal = new TermialInfo();
                        terminal.Address = _value.Address;
                        terminal.Channel = _value.Channel;
                        terminal.State = _value.TerminalState;
                        terminal.XServer = _value.XServerCode;
                        info.Terminals.push(terminal);
                    }
                }

                if (info.Terminals?.length === 0)
                    delete info.Terminals;
            }

            infos.push(info);
        });

        return infos;
    }

    private getEmailStatusObject(entities: any): EmailStatusInfo[]{

        var infos: EmailStatusInfo[] = [];

        entities?.forEach((entity: any) => {
            var info: EmailStatusInfo = new EmailStatusInfo();
            info.CallerID = entity.CallerID;
            info.DialedID = entity.DialedID;
            info.DialedString = entity.DialedString;
            info.State = entity.XSessState;
            info.Status = entity.XSessStatus;
            info.Type = entity.XSessType;
            info.USessID = entity.USessID;
            info.CDNAddress = entity.CDNAddress;
            info.QueueAddress = entity.QueueAddress;

            if(entity.Campaign){
                info.Campaign = new CampaignInfo();
                info.Campaign.Channels = entity.Campaign.Channels;
                info.Campaign.Code = entity.Campaign.Code;
                info.Campaign.DialMode = entity.Campaign.DialMode;
                info.Campaign.State = entity.Campaign.CampaignState;
                info.Campaign.Type = entity.Campaign.CampaignType;
            }

            if (entity.CurrAgent) {
                info.Agent = new AgentInfo();
                info.Agent.LoginId = entity.CurrAgent.LoginId;
                info.Agent.Name = entity.CurrAgent.Name;
                info.Agent.State = entity.CurrAgent.AgentState;
                info.Agent.Queues = [];

                entity?.CurrAgent?.Queues.forEach((queueInfo: any) => {
                    var queue = new QueueInfo();
                    queue.Channel = queueInfo.Channel;
                    queue.Code = queueInfo.Code;
                    queue.Name = queueInfo.Name;
                    queue.AgentState = queueInfo.Agents[info.Agent.LoginId].AgentState;
                    info.Agent.Queues.push(queue);
                });

                if (info.Agent.Queues?.length === 0)
                    delete info.Agent.Queues;
            }

            if (entity?.CurrAgent?.Terminals) {
                info.Terminals = [];

                for (const [key, value] of Object.entries(entity?.CurrAgent?.Terminals)) {
                    var _value: any = value;
                    if (value) {
                        var terminal = new TermialInfo();
                        terminal.Address = _value.Address;
                        terminal.Channel = _value.Channel;
                        terminal.State = _value.TerminalState;
                        terminal.XServer = _value.XServerCode;
                        info.Terminals.push(terminal);
                    }
                }

                if (info.Terminals?.length === 0)
                    delete info.Terminals;
            }

            infos.push(info);
        });

        return infos;
    }

    private getQueueStatusObject(entities: any): QueueStatusInfo[]{

        var infos: QueueStatusInfo[] = [];

        entities?.forEach((entity: any) => {
            var info: QueueStatusInfo = new QueueStatusInfo();
            info.Address = entity.Address;
            info.Channel = entity.Channel;
            info.Code = entity.Code;
            info.Name = entity.Name;

            if(entity.Campaign){
                info.Campaign = new CampaignInfo();
                info.Campaign.Channels = entity.Campaign.Channels;
                info.Campaign.Code = entity.Campaign.Code;
                info.Campaign.DialMode = entity.Campaign.DialMode;
                info.Campaign.State = entity.Campaign.CampaignState;
                info.Campaign.Type = entity.Campaign.CampaignType;
            }

            info.Agents = [];
            
            entity?.Agents.forEach((agentInfo: any) => {
                var agent = new AgentInfo();
                agent.LoginId = agentInfo.LoginId;
                agent.Name = agentInfo.Name;
                agent.State = agentInfo.AgentState;
                info.Terminals = [];

                for (const [key, value] of Object.entries(agentInfo.Terminals)) {
                    var _value: any = value;
                    if(value){
                        var terminal = new TermialInfo();
                        terminal.Address = _value.Address;
                        terminal.Channel = _value.Channel;
                        terminal.State = _value.TerminalState;
                        terminal.XServer = _value.XServerCode;
                        info.Terminals.push(terminal);
                    }
                }

                if(info.Terminals?.length === 0)
                    delete info.Terminals;

                info.Agents.push(agent);
            });

            infos.push(info);
        });

        return infos;
    }

    private getKeyValueStringArray(entity: any): any[]{
        var keyValueStringArray: any[] = [];
        for (const [key, value] of Object.entries(entity)) {

            if(typeof value === 'object' && !Array.isArray(value) && value !== null){
                keyValueStringArray.push(`\n*_[${key}]_*`);
                var subArray = this.getKeyValueStringArray(value);
                keyValueStringArray = [...keyValueStringArray, ...subArray];

            }else if(Array.isArray(value) && value !== null && value?.length !== 0){
                keyValueStringArray.push(`\n*_[${key}]_*`);
                value?.forEach((val: any, index: number) => {
                    if(typeof val === 'object' && !Array.isArray(val) && val !== null){
                        if(index > 0 && index < value?.length)
                            keyValueStringArray.push(``);
                        var subArray = this.getKeyValueStringArray(val);
                        keyValueStringArray = [...keyValueStringArray, ...subArray];
                    }else{            
                        keyValueStringArray.push(`${val}`);            
                    }
                });
            }
            else{
                if(key?.toLowerCase() !== 'id' &&
                !key?.toLowerCase().includes('password') &&
                value)
                    keyValueStringArray.push(`*${key}*: ${value}`);
            }
        }

        return keyValueStringArray;
    }
}

export class CampaignStatusInfo{
    Id!: any;
    Name!: string;
    Code!: string;
    State!: string;
    Type!: string;
    DialMode!: string;
    Channels!: any[];
    Agents!: AgentInfo[];
    Queues!: QueueInfo[];
}

export class AgentStatusInfo{
    State!: any;
    LoginId!: string;
    Name!: string;
    Campaigns!: CampaignInfo[];
    Terminals!: TermialInfo[];
    Queues!: QueueInfo[];
}

export class CallStatusInfo{
    State!: any;
    Status!: string;
    Type!: string;
    CallerID!: string;
    DialedID!: string;
    DialedString!: string;
    UCallID!: string;
    Agent!: AgentInfo;
    Campaign!: CampaignInfo;
    Terminals!: TermialInfo[];
}

export class ChatStatusInfo{
    CDNAddress!: any;
    QueueAddress!: any;
    CallerID!: string;
    DialedID!: string;
    DialedString!: string;
    USessID!: string;
    State!: any;
    Status!: string;
    Type!: string;
    Agent!: AgentInfo;
    Campaign!: CampaignInfo;
    Terminals!: TermialInfo[];
}

export class EmailStatusInfo{
    CDNAddress!: any;
    QueueAddress!: any;
    CallerID!: string;
    DialedID!: string;
    DialedString!: string;
    USessID!: string;
    State!: any;
    Status!: string;
    Type!: string;
    Agent!: AgentInfo;
    Campaign!: CampaignInfo;
    Terminals!: TermialInfo[];
}

export class QueueStatusInfo{
    Address!: any;
    Channel!: any;
    Code!: string;
    Name!: string;
    Campaign!: CampaignInfo;
    Agents!: AgentInfo[];
    Terminals!: TermialInfo[];
}

export class AgentInfo{
    LoginId!: string;
    Name!: string;
    State!: string;
    Terminals!: TermialInfo[];
    Queues!: QueueInfo[];
}

export class TermialInfo{
    Channel!: string;
    Address!: any;
    State!: string;
    XServer!: string;
}

export class QueueInfo{
    Channel!: string;
    Code!: string;
    Name!: string;
    AgentState!: string;
}

export class CampaignInfo{
    Code!: string;
    State!: string;
    Type!: string;
    DialMode!: string;
    Channels!: any[];
}