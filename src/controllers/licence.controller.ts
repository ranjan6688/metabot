import { HttpResultType, CCClient } from "./../services/cc.service";
import { CommonService } from "./../services/common.service";

export class LicenseController{

    constructor(private common: CommonService){}

    private async fetchLicense(tenantCode: any): Promise<TenantLicenseInfo[]>{

        var licenseInfos: TenantLicenseInfo[] = [];

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

                result = await this.common.ccSvc.fetchCTClient(sessionId, tenantCode);
                if(result?.ResultType === HttpResultType.Success && result?.Response?.Entities?.length > 0){
                    
                    var tenantEntity = result?.Response?.Entities[0];
                
                    result = await this.common.ccSvc.fetchLicense(sessionId, tenantEntity.Id);
                    if(result?.ResultType === HttpResultType.Success){
                        
                        await Promise.all(result?.Response?.Entities?.map(async (entity: any) => {
                            
                            var licenseInfo = new TenantLicenseInfo();
                            licenseInfo.Id = entity.Id;
                            licenseInfo.Tenant = entity.CTClient.Code;
                            licenseInfo.NoOfAdmins = entity.NoOfAdmins;
                            licenseInfo.NoOfAgents = entity.NoOfAgents;
                            licenseInfo.Channels = entity.Channels;
    
                            licenseInfos.push(licenseInfo);
                            licenseInfos = [...new Map(licenseInfos.map(item => [item['Id'], item])).values()];
    
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
        }else{
            this.common.logger.error(result.Exception);
        }

        await this.common.ccSvc.logout(sessionId);

        return licenseInfos;
    }

    async fetchLicenseResponse(tenantCode: any): Promise<string>{

        var responseStringArray: any[] = [];
        var keyValueStringArray: any[] = [];

        var licenseInfos: TenantLicenseInfo[] = await this.fetchLicense(tenantCode);
        licenseInfos?.forEach((info: TenantLicenseInfo) => {
            keyValueStringArray = this.getKeyValueStringArray(info);
            responseStringArray.push(keyValueStringArray.join('\n'));
        });
        
        var replyMessage = responseStringArray.join(`\n===============================\n`);
        if(!replyMessage)
            replyMessage = `No tenant found`;
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

export class TenantLicenseInfo{
    Id!: string;
    Tenant!: string;
    NoOfAdmins!: number;
    NoOfAgents!: number;
    Channels!: any;
}