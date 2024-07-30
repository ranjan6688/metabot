import { CCClient, HttpResultType } from "./../services/cc.service";
import { CommonService } from "./../services/common.service";

export class CCController{
    
    constructor(private common: CommonService){}

    async fetchTenants(): Promise<TenantInfo[]>{

        var tenantInfos: TenantInfo[] = [];

        var result = await this.common.ccSvc.register();
        if(result?.ResultType === HttpResultType.Success){

            var sessionId = result?.Response?.SessionId;
            var client: CCClient = new CCClient();
            client.ApplicationCode = `RADIUSClient`;
            client.ClientCode = `SYS`;
            client.Username = this.common.property.application.ccServer.suLoginId;
            client.Password = this.common.property.application.ccServer.suPassword;
            
            result = await this.common.ccSvc.login(sessionId, client);
            if(result?.ResultType === HttpResultType.Success){
                
                result = await this.common.ccSvc.fetchCTClient(sessionId);
                if(result?.ResultType === HttpResultType.Success){

                    result?.Response?.Entities?.forEach((entity: any) => {
                        var tenantInfo = new TenantInfo();
                        tenantInfo.Address = entity.Address;
                        tenantInfo.DatabaseName = entity?.CTClientDB?.Name;
                        tenantInfo.Id = entity.Id;
                        tenantInfo.Name = entity.Name;

                        if(entity?.CTClientDB?.CoreDB){
                            tenantInfo.CoreDB = new TenantDBInfo();
                            tenantInfo.CoreDB.Host = entity?.CTClientDB?.CoreDB?.DB1Host;
                            tenantInfo.CoreDB.Port = entity?.CTClientDB?.CoreDB?.DB1Port;
                            tenantInfo.CoreDB.Username = entity?.CTClientDB?.CoreDB?.DB1UserName;
                            tenantInfo.CoreDB.Password = entity?.CTClientDB?.CoreDB?.DB1Password;
                        }

                        if(entity?.CTClientDB?.MemDB){
                            tenantInfo.MemDB = new TenantDBInfo();
                            tenantInfo.MemDB.Host = entity?.CTClientDB?.MemDB?.DB1Host;
                            tenantInfo.MemDB.Port = entity?.CTClientDB?.MemDB?.DB1Port;
                            tenantInfo.MemDB.Username = entity?.CTClientDB?.MemDB?.DB1UserName;
                            tenantInfo.MemDB.Password = entity?.CTClientDB?.MemDB?.DB1Password;
                        }

                        tenantInfos.push(tenantInfo);
                    });
                }else{
                    this.common.logger.error(result.Exception);
                }
            }else{
                this.common.logger.error(result.Exception);
            }
        }else{
            this.common.logger.error(result.Exception);
        }

        return tenantInfos;
    }
}

export class TenantInfo{
    Id!: number;
    Name!: string;
    Address!: string;
    DatabaseName!: string;
    CoreDB!: TenantDBInfo;
    MemDB!: TenantDBInfo;
}

export class TenantDBInfo{
    Host!: string;
    Port!: string;
    Username!: string;
    Password!: string;
}