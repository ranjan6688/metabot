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
            client.Password = this.common.chipherSvc.AESdecrypt(this.common.property.application.ccServer.suPassword);
            
            result = await this.common.ccSvc.login(sessionId, client);
            if(result?.ResultType === HttpResultType.Success){
                
                result = await this.common.ccSvc.fetchCTClient(sessionId);
                if(result?.ResultType === HttpResultType.Success){

                    await Promise.all(result?.Response?.Entities?.map(async (entity: any) => {
                        
                        var tenantInfo = new TenantInfo();
                        tenantInfo.Address = entity.Address;
                        tenantInfo.DatabaseName = entity?.CTClientDB?.Name;
                        tenantInfo.Id = entity.Id;
                        tenantInfo.Name = entity.Name;
                        tenantInfo.Code = entity.Code;

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
                        
                        result = await this.common.ccSvc.fetchCTClientStatus(sessionId, entity.Id);
                        if(result?.ResultType === HttpResultType.Failed)
                            this.common.logger.error(result.Exception);
                        else{
                            if(result?.Response?.CTClientState){
                                tenantInfo.Status = result?.Response?.CTClientState?.toLowerCase() === 'start' ? 'Running' : 'Not running';
                            }
                        }

                        tenantInfos.push(tenantInfo);
                        tenantInfos = [...new Map(tenantInfos.map(item => [item['Id'], item])).values()];

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

        return tenantInfos;
    }

    async fetchTenant(tenantCode: any): Promise<TenantInfo[]>{

        var tenantInfos: TenantInfo[] = [];

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
                if(result?.ResultType === HttpResultType.Success){

                    await Promise.all(result?.Response?.Entities?.map(async (entity: any) => {
                        
                        var tenantInfo = new TenantInfo();
                        tenantInfo.Address = entity.Address;
                        tenantInfo.DatabaseName = entity?.CTClientDB?.Name;
                        tenantInfo.Id = entity.Id;
                        tenantInfo.Name = entity.Name;
                        tenantInfo.Code = entity.Code;

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
                        
                        result = await this.common.ccSvc.fetchCTClientStatus(sessionId, entity.Id);
                        if(result?.ResultType === HttpResultType.Failed)
                            this.common.logger.error(result.Exception);
                        else{
                            if(result?.Response?.CTClientState){
                                tenantInfo.Status = result?.Response?.CTClientState?.toLowerCase() === 'start' ? 'Running' : 'Not running';
                            }
                        }

                        tenantInfos.push(tenantInfo);
                        tenantInfos = [...new Map(tenantInfos.map(item => [item['Id'], item])).values()];

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

        return tenantInfos;
    }

    async startTenant(tenantCode: any): Promise<TenantInfo[]>{

        var tenantInfos: TenantInfo[] = [];

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
                if(result?.ResultType === HttpResultType.Success){

                    await Promise.all(result?.Response?.Entities?.map(async (entity: any) => {
                        
                        var tenantInfo = new TenantInfo();
                        tenantInfo.Address = entity.Address;
                        tenantInfo.DatabaseName = entity?.CTClientDB?.Name;
                        tenantInfo.Id = entity.Id;
                        tenantInfo.Name = entity.Name;
                        tenantInfo.Code = entity.Code;

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

                        result = await this.common.ccSvc.startCTClient(sessionId, tenantInfo.Id);
                        if (result?.ResultType === HttpResultType.Failed) {
                            this.common.logger.error(result.Exception);
                            tenantInfo.Status = `${this.common.errorProcessor.processError(result?.Exception)}`;
                        } else {
                            tenantInfo.Status = 'Running';
                        }
                        
                        tenantInfos.push(tenantInfo);
                        tenantInfos = [...new Map(tenantInfos.map(item => [item['Id'], item])).values()];

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

        return tenantInfos;
    }

    async stopTenant(tenantCode: any): Promise<TenantInfo[]>{

        var tenantInfos: TenantInfo[] = [];

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
                if(result?.ResultType === HttpResultType.Success){

                    await Promise.all(result?.Response?.Entities?.map(async (entity: any) => {
                        
                        var tenantInfo = new TenantInfo();
                        tenantInfo.Address = entity.Address;
                        tenantInfo.DatabaseName = entity?.CTClientDB?.Name;
                        tenantInfo.Id = entity.Id;
                        tenantInfo.Name = entity.Name;
                        tenantInfo.Code = entity.Code;

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

                        result = await this.common.ccSvc.stopCTClient(sessionId, tenantInfo.Id);
                        if (result?.ResultType === HttpResultType.Failed) {
                            this.common.logger.error(result.Exception);
                            tenantInfo.Status = `${this.common.errorProcessor.processError(result?.Exception)}`;
                        } else {
                            tenantInfo.Status = 'Not Running';
                        }
                        
                        tenantInfos.push(tenantInfo);
                        tenantInfos = [...new Map(tenantInfos.map(item => [item['Id'], item])).values()];

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

        return tenantInfos;
    }

    async fetchLicense(tenantCode: any): Promise<TenantLicenseInfo[]>{

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

        return licenseInfos;
    }

    async fetchApplications(): Promise<ApplicationInfo[]>{

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

        return applicationInfos;
    }

    async fetchApplication(applicationCode: any): Promise<ApplicationInfo[]>{

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

        return applicationInfos;
    }

    async fetchDatabases(): Promise<DatabaseInfo[]>{

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

        return databaseInfos;
    }

    async fetchDatabase(databaseCode: any): Promise<DatabaseInfo[]>{

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

        return databaseInfos;
    }
}

export class TenantInfo{
    Id!: number;
    Name!: string;
    Code!: string;
    Address!: string;
    DatabaseName!: string;
    Status!: string;
    CoreDB!: TenantDBInfo;
    MemDB!: TenantDBInfo;
}

export class TenantDBInfo{
    Host!: string;
    Port!: string;
    Username!: string;
    Password!: string;
}

export class TenantLicenseInfo{
    Id!: string;
    Tenant!: string;
    NoOfAdmins!: number;
    NoOfAgents!: number;
    Channels!: any;
}

export class ApplicationInfo{
    Id!: number;
    Name!: string;
    Code!: string;
    Vendor!: string;
    UserTypes!: any[];
}

export class DatabaseInfo{
    Id!: number;
    Name!: string;
    Tenant!: string;
    Code!: string;
    CoreDB!: TenantDBInfo;
    MemDB!: TenantDBInfo;
}