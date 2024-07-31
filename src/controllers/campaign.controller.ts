import { HttpResultType, CCClient } from "./../services/cc.service";
import { CommonService } from "./../services/common.service";
import { TenantInfo, TenantDBInfo } from "./tenant.controller";

export class CampaignController{

    constructor(private common: CommonService){}

    async fetchCampaigns(tenantCode: any): Promise<CampaignInfo[]>{

        var campaignInfos: CampaignInfo[] = [];

        var result: any = await this.common.ccSvc.register();
        if(result?.ResultType === HttpResultType.Success){

            var sessionId = result?.Response?.SessionId;

            result = await this.common.tenantController.fetchTenantDefaultAdmin(sessionId, tenantCode);
            var tenantInfo: TenantInfo = result && result[0];
            if(!tenantInfo){
                this.common.logger.error(`No tenant found!`);
            }else{
                var client: CCClient = new CCClient();
                client.ApplicationCode = `Atomos`;
                client.ClientCode = tenantCode;
                client.Username = tenantInfo.DefaultAdmin.LoginId;
                client.Password = tenantInfo.DefaultAdmin.Password;

                result = await this.common.ccSvc.login(sessionId, client);
                if(result?.ResultType === HttpResultType.Success){
                    
                    result = await this.common.ccSvc.fetchCampaign(sessionId);
                    if(result?.ResultType === HttpResultType.Success){
    
                        
                        await Promise.all(result?.Response?.Entities?.map(async (entity: any) => {
                            
                            var campaignInfo = new CampaignInfo();
                            campaignInfo.Code = entity.Code;
                            campaignInfo.Id = entity.Id;
                            campaignInfo.Name = entity.Name;                       
                            campaignInfo.Channels = entity.Channels;                       
                            campaignInfo.Type = entity.CampaignType; 
                            
                            result = await this.common.ccSvc.fetchCampaignProperties(sessionId, entity.Id);
                            campaignInfo.ContactList = result?.Response?.Entities[0]?.Global?.DefContactListCode || '--';
                            campaignInfo.TaskLimit = result?.Response?.Entities[0]?.Global?.AgentTaskLimit || '--';
                            
                            result = await this.common.ccSvc.fetchCampaignStatus(sessionId, entity.Id);
                            campaignInfo.DialMode = result?.Response?.DialMode || '--';
                            campaignInfo.Status = this.formatCampaignState(result?.Response?.CampaignState) || '--';
    
                            campaignInfos.push(campaignInfo);
                            campaignInfos = [...new Map(campaignInfos.map(item => [item['Id'], item])).values()];
    
                          }));
    
                    }else{
                        this.common.logger.error(result.Exception);
                    }
                }else{
                    this.common.logger.error(result.Exception);
                }
            }
            
        }else{
            this.common.logger.error(result.Exception);
        }

        await this.common.ccSvc.logout(sessionId);

        return campaignInfos;
    }

    async fetchCampaign(tenantCode: any, campaignCode: any): Promise<CampaignInfo[]>{

        var campaignInfos: CampaignInfo[] = [];

        var result: any = await this.common.ccSvc.register();
        if(result?.ResultType === HttpResultType.Success){

            var sessionId = result?.Response?.SessionId;

            result = await this.common.tenantController.fetchTenantDefaultAdmin(sessionId, tenantCode);
            var tenantInfo: TenantInfo = result && result[0];
            if(!tenantInfo){
                this.common.logger.error(`No tenant found!`);
            }else{
                var client: CCClient = new CCClient();
                client.ApplicationCode = `Atomos`;
                client.ClientCode = tenantCode;
                client.Username = tenantInfo.DefaultAdmin.LoginId;
                client.Password = tenantInfo.DefaultAdmin.Password;

                result = await this.common.ccSvc.login(sessionId, client);
                if(result?.ResultType === HttpResultType.Success){
                    
                    result = await this.common.ccSvc.fetchCampaign(sessionId, campaignCode);
                    if(result?.ResultType === HttpResultType.Success){
    
                        
                        await Promise.all(result?.Response?.Entities?.map(async (entity: any) => {
                            
                            var campaignInfo = new CampaignInfo();
                            campaignInfo.Code = entity.Code;
                            campaignInfo.Id = entity.Id;
                            campaignInfo.Name = entity.Name;                       
                            campaignInfo.Channels = entity.Channels;                       
                            campaignInfo.Type = entity.CampaignType; 
                            
                            result = await this.common.ccSvc.fetchCampaignProperties(sessionId, entity.Id);
                            campaignInfo.ContactList = result?.Response?.Entities[0]?.Global?.DefContactListCode || '--';
                            campaignInfo.TaskLimit = result?.Response?.Entities[0]?.Global?.AgentTaskLimit || '--';
                            
                            result = await this.common.ccSvc.fetchCampaignStatus(sessionId, entity.Id);
                            campaignInfo.DialMode = result?.Response?.DialMode || '--';
                            campaignInfo.Status = this.formatCampaignState(result?.Response?.CampaignState) || '--';
    
                            campaignInfos.push(campaignInfo);
                            campaignInfos = [...new Map(campaignInfos.map(item => [item['Id'], item])).values()];
    
                          }));
    
                    }else{
                        this.common.logger.error(result.Exception);
                    }
                }else{
                    this.common.logger.error(result.Exception);
                }
            }
            
        }else{
            this.common.logger.error(result.Exception);
        }

        await this.common.ccSvc.logout(sessionId);

        return campaignInfos;
    }

    async fetchCampaignsResponse(tenantCode: any): Promise<string>{

        var responseStringArray: any[] = [];
        var keyValueStringArray: any[] = [];

        var campaignInfos: CampaignInfo[] = await this.fetchCampaigns(tenantCode);
        campaignInfos?.forEach((info: CampaignInfo) => {
            keyValueStringArray = this.getKeyValueStringArray(info);
            responseStringArray.push(keyValueStringArray.join('\n'));
        });
        
        var replyMessage = responseStringArray.join(`\n===============================\n`);
        if(!replyMessage)
            replyMessage = `No campaign found`;
        return replyMessage;
    }

    async fetchCampaignResponse(tenantCode: any, campaignCode: any): Promise<string>{

        var responseStringArray: any[] = [];
        var keyValueStringArray: any[] = [];

        var campaignInfos: CampaignInfo[] = await this.fetchCampaign(tenantCode, campaignCode);
        campaignInfos?.forEach((info: CampaignInfo) => {
            keyValueStringArray = this.getKeyValueStringArray(info);
            responseStringArray.push(keyValueStringArray.join('\n'));
        });
        
        var replyMessage = responseStringArray.join(`\n===============================\n`);
        if(!replyMessage)
            replyMessage = `No campaign found`;
        return replyMessage;
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

    private formatCampaignState(state: any){
        switch (state){
            case 'Start':
                return 'Started';
                break;
            case 'Stop':
                return 'Stopped';
                break;
            case 'Load':
                return 'Loaded';
                break;
            case 'Unload':
                return 'Unloaded';
                break;
        }
        
        return '';
    };
}

export class CampaignInfo{
    Id!: string;
    Name!: string;
    Code!: string;
    Channels!: any;
    Type!: string;
    DialMode!: string;
    TaskLimit!: string;
    ContactList!: string;
    Status!: string;
}