import { HttpResultType, CCClient } from "./../services/cc.service";
import { CommonService } from "./../services/common.service";
import { TenantDBInfo } from "./tenant.controller";

export class DbController{

    constructor(private common: CommonService){}

    private async fetchDatabases(): Promise<DatabaseInfo[]>{

        var databaseInfos: DatabaseInfo[] = [];

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
                
                result = await this.common.ccSvc.fetchDatabase(sessionId);
                if(result?.ResultType === HttpResultType.Success){

                    
                    await Promise.all(result?.Response?.Entities?.map(async (entity: any) => {
                        
                        var databaseInfo = new DatabaseInfo();
                        databaseInfo.Code = entity.Code;
                        databaseInfo.Id = entity.Id;
                        databaseInfo.Name = entity.Name;                       

                        if(entity?.CoreDB){
                            databaseInfo.CoreDB = new TenantDBInfo();
                            databaseInfo.CoreDB.Host = entity?.CoreDB?.DB1Host;
                            databaseInfo.CoreDB.Port = entity?.CoreDB?.DB1Port;
                            databaseInfo.CoreDB.Username = entity?.CoreDB?.DB1UserName;
                            databaseInfo.CoreDB.Password = entity?.CoreDB?.DB1Password;
                        }

                        if(entity?.MemDB){
                            databaseInfo.MemDB = new TenantDBInfo();
                            databaseInfo.MemDB.Host = entity?.MemDB?.DB1Host;
                            databaseInfo.MemDB.Port = entity?.MemDB?.DB1Port;
                            databaseInfo.MemDB.Username = entity?.MemDB?.DB1UserName;
                            databaseInfo.MemDB.Password = entity?.MemDB?.DB1Password;
                        }
                        
                        result = await this.common.ccSvc.fetchCTClientByDB(sessionId, entity.Id);
                        if(result?.ResultType === HttpResultType.Failed)
                            this.common.logger.error(result.Exception);
                        else{
                            if(result?.Response?.Entities?.length > 0){
                                databaseInfo.Tenant = result?.Response?.Entities[0]?.Code;
                            }
                        }

                        databaseInfos.push(databaseInfo);
                        databaseInfos = [...new Map(databaseInfos.map(item => [item['Id'], item])).values()];

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

        return databaseInfos;
    }

    private async fetchDatabase(databaseCode: any): Promise<DatabaseInfo[]>{

        var databaseInfos: DatabaseInfo[] = [];

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
                
                result = await this.common.ccSvc.fetchDatabase(sessionId, databaseCode);
                if(result?.ResultType === HttpResultType.Success){

                    
                    await Promise.all(result?.Response?.Entities?.map(async (entity: any) => {
                        
                        var databaseInfo = new DatabaseInfo();
                        databaseInfo.Code = entity.Code;
                        databaseInfo.Id = entity.Id;
                        databaseInfo.Name = entity.Name;                       

                        if(entity?.CoreDB){
                            databaseInfo.CoreDB = new TenantDBInfo();
                            databaseInfo.CoreDB.Host = entity?.CoreDB?.DB1Host;
                            databaseInfo.CoreDB.Port = entity?.CoreDB?.DB1Port;
                            databaseInfo.CoreDB.Username = entity?.CoreDB?.DB1UserName;
                            databaseInfo.CoreDB.Password = entity?.CoreDB?.DB1Password;
                        }

                        if(entity?.MemDB){
                            databaseInfo.MemDB = new TenantDBInfo();
                            databaseInfo.MemDB.Host = entity?.MemDB?.DB1Host;
                            databaseInfo.MemDB.Port = entity?.MemDB?.DB1Port;
                            databaseInfo.MemDB.Username = entity?.MemDB?.DB1UserName;
                            databaseInfo.MemDB.Password = entity?.MemDB?.DB1Password;
                        }
                        
                        result = await this.common.ccSvc.fetchCTClientByDB(sessionId, entity.Id);
                        if(result?.ResultType === HttpResultType.Failed)
                            this.common.logger.error(result.Exception);
                        else{
                            if(result?.Response?.Entities?.length > 0){
                                databaseInfo.Tenant = result?.Response?.Entities[0]?.Code;
                            }
                        }

                        databaseInfos.push(databaseInfo);
                        databaseInfos = [...new Map(databaseInfos.map(item => [item['Id'], item])).values()];

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

        return databaseInfos;
    }

    async fetchDatabasesResponse(): Promise<string>{

        var responseStringArray: any[] = [];
        var keyValueStringArray: any[] = [];

        var dbInfos: DatabaseInfo[] = await this.fetchDatabases();
        dbInfos?.forEach((info: DatabaseInfo) => {
            keyValueStringArray = this.getKeyValueStringArray(info);
            responseStringArray.push(keyValueStringArray.join('\n'));
        });
        
        var replyMessage = responseStringArray.join(`\n===============================\n`);
        if(!replyMessage)
            replyMessage = `No database found`;
        return replyMessage;
    }

    async fetchDatabaseResponse(databaseCode: any): Promise<string>{

        var responseStringArray: any[] = [];
        var keyValueStringArray: any[] = [];

        var dbInfos: DatabaseInfo[] = await this.fetchDatabase(databaseCode);
        dbInfos?.forEach((info: DatabaseInfo) => {
            keyValueStringArray = this.getKeyValueStringArray(info);
            responseStringArray.push(keyValueStringArray.join('\n'));
        });
        
        var replyMessage = responseStringArray.join(`\n===============================\n`);
        if(!replyMessage)
            replyMessage = `No database found`;
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

export class DatabaseInfo{
    Id!: number;
    Name!: string;
    Tenant!: string;
    Code!: string;
    CoreDB!: TenantDBInfo;
    MemDB!: TenantDBInfo;
}