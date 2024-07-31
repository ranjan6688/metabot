import { HttpResultType, CCClient } from "./../services/cc.service";
import { CommonService } from "./../services/common.service";

export class AppController{

    constructor(private common: CommonService){}

    private async fetchApplications(): Promise<ApplicationInfo[]>{

        var applicationInfos: ApplicationInfo[] = [];

        var result = await this.common.ccSvc.register();
        if(result?.ResultType === HttpResultType.Success){

            var sessionId = result?.Response?.SessionId;
            var client: CCClient = new CCClient();
            client.ApplicationCode = `RADIUSClient`;
            client.ClientCode = `SYS`;
            client.Username = this.common.property.application.ccServer.suLoginId;
            client.Password = this.common.chipherSvc.AESdecrypt(this.common.property.application.ccServer.suPassword);
            
            result = await this.common.ccSvc.login(sessionId, client);
            if(result?.ResultType === HttpResultType.Success){
                
                result = await this.common.ccSvc.fetchApplication(sessionId);
                if(result?.ResultType === HttpResultType.Success){

                    
                    await Promise.all(result?.Response?.Entities?.map(async (entity: any) => {
                        
                        var applicationInfo = new ApplicationInfo();
                        applicationInfo.Code = entity.Code;
                        applicationInfo.Id = entity.Id;
                        applicationInfo.Name = entity.Name;
                        applicationInfo.UserTypes = entity.UserTypes;
                        applicationInfo.Vendor = entity.Vendor;

                        applicationInfos.push(applicationInfo);
                        applicationInfos = [...new Map(applicationInfos.map(item => [item['Id'], item])).values()];

                      }));

                }else{
                    this.common.logger.error(result.Exception);
                }
            }else{
                this.common.logger.error(result.Exception);
            }
        }else{
            this.common.logger.error(result.Exception);
        }

        await this.common.ccSvc.logout(sessionId);

        return applicationInfos;
    }

    private async fetchApplication(applicationCode: any): Promise<ApplicationInfo[]>{

        var applicationInfos: ApplicationInfo[] = [];

        var result = await this.common.ccSvc.register();
        if(result?.ResultType === HttpResultType.Success){

            var sessionId = result?.Response?.SessionId;
            var client: CCClient = new CCClient();
            client.ApplicationCode = `RADIUSClient`;
            client.ClientCode = `SYS`;
            client.Username = this.common.property.application.ccServer.suLoginId;
            client.Password = this.common.chipherSvc.AESdecrypt(this.common.property.application.ccServer.suPassword);
            
            result = await this.common.ccSvc.login(sessionId, client);
            if(result?.ResultType === HttpResultType.Success){
                
                result = await this.common.ccSvc.fetchApplication(sessionId, applicationCode);
                if(result?.ResultType === HttpResultType.Success){

                    await Promise.all(result?.Response?.Entities?.map(async (entity: any) => {
                        
                        var applicationInfo = new ApplicationInfo();
                        applicationInfo.Code = entity.Code;
                        applicationInfo.Id = entity.Id;
                        applicationInfo.Name = entity.Name;
                        applicationInfo.UserTypes = entity.UserTypes;
                        applicationInfo.Vendor = entity.Vendor;

                        applicationInfos.push(applicationInfo);
                        applicationInfos = [...new Map(applicationInfos.map(item => [item['Id'], item])).values()];

                      }));

                }else{
                    this.common.logger.error(result.Exception);
                }
            }else{
                this.common.logger.error(result.Exception);
            }
        }else{
            this.common.logger.error(result.Exception);
        }

        await this.common.ccSvc.logout(sessionId);

        return applicationInfos;
    }

    async fetchApplicationsResponse(): Promise<string>{

        var responseStringArray: any[] = [];
        var keyValueStringArray: any[] = [];

        var appInfos: ApplicationInfo[] = await this.fetchApplications();
        appInfos?.forEach((info: ApplicationInfo) => {
            keyValueStringArray = this.getKeyValueStringArray(info);
            responseStringArray.push(keyValueStringArray.join('\n'));
        });
        
        var replyMessage = responseStringArray.join(`\n===============================\n`);
        if(!replyMessage)
            replyMessage = `No application found`;
        return replyMessage;
    }

    async fetchApplicationResponse(applicationCode: any): Promise<string>{

        var responseStringArray: any[] = [];
        var keyValueStringArray: any[] = [];

        var appInfos: ApplicationInfo[] = await this.fetchApplication(applicationCode);
        appInfos?.forEach((info: ApplicationInfo) => {
            keyValueStringArray = this.getKeyValueStringArray(info);
            responseStringArray.push(keyValueStringArray.join('\n'));
        });
        
        var replyMessage = responseStringArray.join(`\n===============================\n`);
        if(!replyMessage)
            replyMessage = `No application found`;
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
}

export class ApplicationInfo{
    Id!: number;
    Name!: string;
    Code!: string;
    Vendor!: string;
    UserTypes!: any[];
}