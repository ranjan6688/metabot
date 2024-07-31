"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseInfo = exports.ApplicationInfo = exports.TenantLicenseInfo = exports.TenantDBInfo = exports.TenantInfo = exports.CCController = void 0;
const cc_service_1 = require("./../services/cc.service");
class CCController {
    common;
    constructor(common) {
        this.common = common;
    }
    async fetchTenants() {
        var tenantInfos = [];
        var result = await this.common.ccSvc.register();
        if (result?.ResultType === cc_service_1.HttpResultType.Success) {
            var sessionId = result?.Response?.SessionId;
            var client = new cc_service_1.CCClient();
            client.ApplicationCode = `RADIUSClient`;
            client.ClientCode = `SYS`;
            client.Username = this.common.property.application.ccServer.suLoginId;
            client.Password = this.common.chipherSvc.AESdecrypt(this.common.property.application.ccServer.suPassword);
            result = await this.common.ccSvc.login(sessionId, client);
            if (result?.ResultType === cc_service_1.HttpResultType.Success) {
                result = await this.common.ccSvc.fetchCTClient(sessionId);
                if (result?.ResultType === cc_service_1.HttpResultType.Success) {
                    await Promise.all(result?.Response?.Entities?.map(async (entity) => {
                        var tenantInfo = new TenantInfo();
                        tenantInfo.Address = entity.Address;
                        tenantInfo.DatabaseName = entity?.CTClientDB?.Name;
                        tenantInfo.Id = entity.Id;
                        tenantInfo.Name = entity.Name;
                        tenantInfo.Code = entity.Code;
                        if (entity?.CTClientDB?.CoreDB) {
                            tenantInfo.CoreDB = new TenantDBInfo();
                            tenantInfo.CoreDB.Host = entity?.CTClientDB?.CoreDB?.DB1Host;
                            tenantInfo.CoreDB.Port = entity?.CTClientDB?.CoreDB?.DB1Port;
                            tenantInfo.CoreDB.Username = entity?.CTClientDB?.CoreDB?.DB1UserName;
                            tenantInfo.CoreDB.Password = entity?.CTClientDB?.CoreDB?.DB1Password;
                        }
                        if (entity?.CTClientDB?.MemDB) {
                            tenantInfo.MemDB = new TenantDBInfo();
                            tenantInfo.MemDB.Host = entity?.CTClientDB?.MemDB?.DB1Host;
                            tenantInfo.MemDB.Port = entity?.CTClientDB?.MemDB?.DB1Port;
                            tenantInfo.MemDB.Username = entity?.CTClientDB?.MemDB?.DB1UserName;
                            tenantInfo.MemDB.Password = entity?.CTClientDB?.MemDB?.DB1Password;
                        }
                        result = await this.common.ccSvc.fetchCTClientStatus(sessionId, entity.Id);
                        if (result?.ResultType === cc_service_1.HttpResultType.Failed)
                            this.common.logger.error(result.Exception);
                        else {
                            if (result?.Response?.CTClientState) {
                                tenantInfo.Status = result?.Response?.CTClientState?.toLowerCase() === 'start' ? 'Running' : 'Not running';
                            }
                        }
                        tenantInfos.push(tenantInfo);
                        tenantInfos = [...new Map(tenantInfos.map(item => [item['Id'], item])).values()];
                    }));
                }
                else {
                    this.common.logger.error(result.Exception);
                }
            }
            else {
                this.common.logger.error(result.Exception);
            }
        }
        else {
            this.common.logger.error(result.Exception);
        }
        return tenantInfos;
    }
    async fetchTenant(tenantCode) {
        var tenantInfos = [];
        var result = await this.common.ccSvc.register();
        if (result?.ResultType === cc_service_1.HttpResultType.Success) {
            var sessionId = result?.Response?.SessionId;
            var client = new cc_service_1.CCClient();
            client.ApplicationCode = `RADIUSClient`;
            client.ClientCode = `SYS`;
            client.Username = this.common.property.application.ccServer.suLoginId;
            client.Password = this.common.chipherSvc.AESdecrypt(this.common.property.application.ccServer.suPassword);
            result = await this.common.ccSvc.login(sessionId, client);
            if (result?.ResultType === cc_service_1.HttpResultType.Success) {
                result = await this.common.ccSvc.fetchCTClient(sessionId, tenantCode);
                if (result?.ResultType === cc_service_1.HttpResultType.Success) {
                    await Promise.all(result?.Response?.Entities?.map(async (entity) => {
                        var tenantInfo = new TenantInfo();
                        tenantInfo.Address = entity.Address;
                        tenantInfo.DatabaseName = entity?.CTClientDB?.Name;
                        tenantInfo.Id = entity.Id;
                        tenantInfo.Name = entity.Name;
                        tenantInfo.Code = entity.Code;
                        if (entity?.CTClientDB?.CoreDB) {
                            tenantInfo.CoreDB = new TenantDBInfo();
                            tenantInfo.CoreDB.Host = entity?.CTClientDB?.CoreDB?.DB1Host;
                            tenantInfo.CoreDB.Port = entity?.CTClientDB?.CoreDB?.DB1Port;
                            tenantInfo.CoreDB.Username = entity?.CTClientDB?.CoreDB?.DB1UserName;
                            tenantInfo.CoreDB.Password = entity?.CTClientDB?.CoreDB?.DB1Password;
                        }
                        if (entity?.CTClientDB?.MemDB) {
                            tenantInfo.MemDB = new TenantDBInfo();
                            tenantInfo.MemDB.Host = entity?.CTClientDB?.MemDB?.DB1Host;
                            tenantInfo.MemDB.Port = entity?.CTClientDB?.MemDB?.DB1Port;
                            tenantInfo.MemDB.Username = entity?.CTClientDB?.MemDB?.DB1UserName;
                            tenantInfo.MemDB.Password = entity?.CTClientDB?.MemDB?.DB1Password;
                        }
                        result = await this.common.ccSvc.fetchCTClientStatus(sessionId, entity.Id);
                        if (result?.ResultType === cc_service_1.HttpResultType.Failed)
                            this.common.logger.error(result.Exception);
                        else {
                            if (result?.Response?.CTClientState) {
                                tenantInfo.Status = result?.Response?.CTClientState?.toLowerCase() === 'start' ? 'Running' : 'Not running';
                            }
                        }
                        tenantInfos.push(tenantInfo);
                        tenantInfos = [...new Map(tenantInfos.map(item => [item['Id'], item])).values()];
                    }));
                }
                else {
                    this.common.logger.error(result.Exception);
                }
            }
            else {
                this.common.logger.error(result.Exception);
            }
        }
        else {
            this.common.logger.error(result.Exception);
        }
        return tenantInfos;
    }
    async startTenant(tenantCode) {
        var tenantInfos = [];
        var result = await this.common.ccSvc.register();
        if (result?.ResultType === cc_service_1.HttpResultType.Success) {
            var sessionId = result?.Response?.SessionId;
            var client = new cc_service_1.CCClient();
            client.ApplicationCode = `RADIUSClient`;
            client.ClientCode = `SYS`;
            client.Username = this.common.property.application.ccServer.suLoginId;
            client.Password = this.common.chipherSvc.AESdecrypt(this.common.property.application.ccServer.suPassword);
            result = await this.common.ccSvc.login(sessionId, client);
            if (result?.ResultType === cc_service_1.HttpResultType.Success) {
                result = await this.common.ccSvc.fetchCTClient(sessionId, tenantCode);
                if (result?.ResultType === cc_service_1.HttpResultType.Success) {
                    await Promise.all(result?.Response?.Entities?.map(async (entity) => {
                        var tenantInfo = new TenantInfo();
                        tenantInfo.Address = entity.Address;
                        tenantInfo.DatabaseName = entity?.CTClientDB?.Name;
                        tenantInfo.Id = entity.Id;
                        tenantInfo.Name = entity.Name;
                        tenantInfo.Code = entity.Code;
                        if (entity?.CTClientDB?.CoreDB) {
                            tenantInfo.CoreDB = new TenantDBInfo();
                            tenantInfo.CoreDB.Host = entity?.CTClientDB?.CoreDB?.DB1Host;
                            tenantInfo.CoreDB.Port = entity?.CTClientDB?.CoreDB?.DB1Port;
                            tenantInfo.CoreDB.Username = entity?.CTClientDB?.CoreDB?.DB1UserName;
                            tenantInfo.CoreDB.Password = entity?.CTClientDB?.CoreDB?.DB1Password;
                        }
                        if (entity?.CTClientDB?.MemDB) {
                            tenantInfo.MemDB = new TenantDBInfo();
                            tenantInfo.MemDB.Host = entity?.CTClientDB?.MemDB?.DB1Host;
                            tenantInfo.MemDB.Port = entity?.CTClientDB?.MemDB?.DB1Port;
                            tenantInfo.MemDB.Username = entity?.CTClientDB?.MemDB?.DB1UserName;
                            tenantInfo.MemDB.Password = entity?.CTClientDB?.MemDB?.DB1Password;
                        }
                        result = await this.common.ccSvc.startCTClient(sessionId, tenantInfo.Id);
                        if (result?.ResultType === cc_service_1.HttpResultType.Failed) {
                            this.common.logger.error(result.Exception);
                            tenantInfo.Status = `${this.common.errorProcessor.processError(result?.Exception)}`;
                        }
                        else {
                            tenantInfo.Status = 'Running';
                        }
                        tenantInfos.push(tenantInfo);
                        tenantInfos = [...new Map(tenantInfos.map(item => [item['Id'], item])).values()];
                    }));
                }
                else {
                    this.common.logger.error(result.Exception);
                }
            }
            else {
                this.common.logger.error(result.Exception);
            }
        }
        else {
            this.common.logger.error(result.Exception);
        }
        return tenantInfos;
    }
    async stopTenant(tenantCode) {
        var tenantInfos = [];
        var result = await this.common.ccSvc.register();
        if (result?.ResultType === cc_service_1.HttpResultType.Success) {
            var sessionId = result?.Response?.SessionId;
            var client = new cc_service_1.CCClient();
            client.ApplicationCode = `RADIUSClient`;
            client.ClientCode = `SYS`;
            client.Username = this.common.property.application.ccServer.suLoginId;
            client.Password = this.common.chipherSvc.AESdecrypt(this.common.property.application.ccServer.suPassword);
            result = await this.common.ccSvc.login(sessionId, client);
            if (result?.ResultType === cc_service_1.HttpResultType.Success) {
                result = await this.common.ccSvc.fetchCTClient(sessionId, tenantCode);
                if (result?.ResultType === cc_service_1.HttpResultType.Success) {
                    await Promise.all(result?.Response?.Entities?.map(async (entity) => {
                        var tenantInfo = new TenantInfo();
                        tenantInfo.Address = entity.Address;
                        tenantInfo.DatabaseName = entity?.CTClientDB?.Name;
                        tenantInfo.Id = entity.Id;
                        tenantInfo.Name = entity.Name;
                        tenantInfo.Code = entity.Code;
                        if (entity?.CTClientDB?.CoreDB) {
                            tenantInfo.CoreDB = new TenantDBInfo();
                            tenantInfo.CoreDB.Host = entity?.CTClientDB?.CoreDB?.DB1Host;
                            tenantInfo.CoreDB.Port = entity?.CTClientDB?.CoreDB?.DB1Port;
                            tenantInfo.CoreDB.Username = entity?.CTClientDB?.CoreDB?.DB1UserName;
                            tenantInfo.CoreDB.Password = entity?.CTClientDB?.CoreDB?.DB1Password;
                        }
                        if (entity?.CTClientDB?.MemDB) {
                            tenantInfo.MemDB = new TenantDBInfo();
                            tenantInfo.MemDB.Host = entity?.CTClientDB?.MemDB?.DB1Host;
                            tenantInfo.MemDB.Port = entity?.CTClientDB?.MemDB?.DB1Port;
                            tenantInfo.MemDB.Username = entity?.CTClientDB?.MemDB?.DB1UserName;
                            tenantInfo.MemDB.Password = entity?.CTClientDB?.MemDB?.DB1Password;
                        }
                        result = await this.common.ccSvc.stopCTClient(sessionId, tenantInfo.Id);
                        if (result?.ResultType === cc_service_1.HttpResultType.Failed) {
                            this.common.logger.error(result.Exception);
                            tenantInfo.Status = `${this.common.errorProcessor.processError(result?.Exception)}`;
                        }
                        else {
                            tenantInfo.Status = 'Not Running';
                        }
                        tenantInfos.push(tenantInfo);
                        tenantInfos = [...new Map(tenantInfos.map(item => [item['Id'], item])).values()];
                    }));
                }
                else {
                    this.common.logger.error(result.Exception);
                }
            }
            else {
                this.common.logger.error(result.Exception);
            }
        }
        else {
            this.common.logger.error(result.Exception);
        }
        return tenantInfos;
    }
    async fetchLicense(tenantCode) {
        var licenseInfos = [];
        var result = await this.common.ccSvc.register();
        if (result?.ResultType === cc_service_1.HttpResultType.Success) {
            var sessionId = result?.Response?.SessionId;
            var client = new cc_service_1.CCClient();
            client.ApplicationCode = `RADIUSClient`;
            client.ClientCode = `SYS`;
            client.Username = this.common.property.application.ccServer.suLoginId;
            client.Password = this.common.chipherSvc.AESdecrypt(this.common.property.application.ccServer.suPassword);
            result = await this.common.ccSvc.login(sessionId, client);
            if (result?.ResultType === cc_service_1.HttpResultType.Success) {
                result = await this.common.ccSvc.fetchCTClient(sessionId, tenantCode);
                if (result?.ResultType === cc_service_1.HttpResultType.Success && result?.Response?.Entities?.length > 0) {
                    var tenantEntity = result?.Response?.Entities[0];
                    result = await this.common.ccSvc.fetchLicense(sessionId, tenantEntity.Id);
                    if (result?.ResultType === cc_service_1.HttpResultType.Success) {
                        await Promise.all(result?.Response?.Entities?.map(async (entity) => {
                            var licenseInfo = new TenantLicenseInfo();
                            licenseInfo.Id = entity.Id;
                            licenseInfo.Tenant = entity.CTClient.Code;
                            licenseInfo.NoOfAdmins = entity.NoOfAdmins;
                            licenseInfo.NoOfAgents = entity.NoOfAgents;
                            licenseInfo.Channels = entity.Channels;
                            licenseInfos.push(licenseInfo);
                            licenseInfos = [...new Map(licenseInfos.map(item => [item['Id'], item])).values()];
                        }));
                    }
                    else {
                        this.common.logger.error(result.Exception);
                    }
                }
                else {
                    this.common.logger.error(result.Exception);
                }
            }
            else {
                this.common.logger.error(result.Exception);
            }
        }
        else {
            this.common.logger.error(result.Exception);
        }
        return licenseInfos;
    }
    async fetchApplications() {
        var applicationInfos = [];
        var result = await this.common.ccSvc.register();
        if (result?.ResultType === cc_service_1.HttpResultType.Success) {
            var sessionId = result?.Response?.SessionId;
            var client = new cc_service_1.CCClient();
            client.ApplicationCode = `RADIUSClient`;
            client.ClientCode = `SYS`;
            client.Username = this.common.property.application.ccServer.suLoginId;
            client.Password = this.common.chipherSvc.AESdecrypt(this.common.property.application.ccServer.suPassword);
            result = await this.common.ccSvc.login(sessionId, client);
            if (result?.ResultType === cc_service_1.HttpResultType.Success) {
                result = await this.common.ccSvc.fetchApplication(sessionId);
                if (result?.ResultType === cc_service_1.HttpResultType.Success) {
                    await Promise.all(result?.Response?.Entities?.map(async (entity) => {
                        var applicationInfo = new ApplicationInfo();
                        applicationInfo.Code = entity.Code;
                        applicationInfo.Id = entity.Id;
                        applicationInfo.Name = entity.Name;
                        applicationInfo.UserTypes = entity.UserTypes;
                        applicationInfo.Vendor = entity.Vendor;
                        applicationInfos.push(applicationInfo);
                        applicationInfos = [...new Map(applicationInfos.map(item => [item['Id'], item])).values()];
                    }));
                }
                else {
                    this.common.logger.error(result.Exception);
                }
            }
            else {
                this.common.logger.error(result.Exception);
            }
        }
        else {
            this.common.logger.error(result.Exception);
        }
        return applicationInfos;
    }
    async fetchApplication(applicationCode) {
        var applicationInfos = [];
        var result = await this.common.ccSvc.register();
        if (result?.ResultType === cc_service_1.HttpResultType.Success) {
            var sessionId = result?.Response?.SessionId;
            var client = new cc_service_1.CCClient();
            client.ApplicationCode = `RADIUSClient`;
            client.ClientCode = `SYS`;
            client.Username = this.common.property.application.ccServer.suLoginId;
            client.Password = this.common.chipherSvc.AESdecrypt(this.common.property.application.ccServer.suPassword);
            result = await this.common.ccSvc.login(sessionId, client);
            if (result?.ResultType === cc_service_1.HttpResultType.Success) {
                result = await this.common.ccSvc.fetchApplication(sessionId, applicationCode);
                if (result?.ResultType === cc_service_1.HttpResultType.Success) {
                    await Promise.all(result?.Response?.Entities?.map(async (entity) => {
                        var applicationInfo = new ApplicationInfo();
                        applicationInfo.Code = entity.Code;
                        applicationInfo.Id = entity.Id;
                        applicationInfo.Name = entity.Name;
                        applicationInfo.UserTypes = entity.UserTypes;
                        applicationInfo.Vendor = entity.Vendor;
                        applicationInfos.push(applicationInfo);
                        applicationInfos = [...new Map(applicationInfos.map(item => [item['Id'], item])).values()];
                    }));
                }
                else {
                    this.common.logger.error(result.Exception);
                }
            }
            else {
                this.common.logger.error(result.Exception);
            }
        }
        else {
            this.common.logger.error(result.Exception);
        }
        return applicationInfos;
    }
    async fetchDatabases() {
        var databaseInfos = [];
        var result = await this.common.ccSvc.register();
        if (result?.ResultType === cc_service_1.HttpResultType.Success) {
            var sessionId = result?.Response?.SessionId;
            var client = new cc_service_1.CCClient();
            client.ApplicationCode = `RADIUSClient`;
            client.ClientCode = `SYS`;
            client.Username = this.common.property.application.ccServer.suLoginId;
            client.Password = this.common.chipherSvc.AESdecrypt(this.common.property.application.ccServer.suPassword);
            result = await this.common.ccSvc.login(sessionId, client);
            if (result?.ResultType === cc_service_1.HttpResultType.Success) {
                result = await this.common.ccSvc.fetchDatabase(sessionId);
                if (result?.ResultType === cc_service_1.HttpResultType.Success) {
                    await Promise.all(result?.Response?.Entities?.map(async (entity) => {
                        var databaseInfo = new DatabaseInfo();
                        databaseInfo.Code = entity.Code;
                        databaseInfo.Id = entity.Id;
                        databaseInfo.Name = entity.Name;
                        if (entity?.CoreDB) {
                            databaseInfo.CoreDB = new TenantDBInfo();
                            databaseInfo.CoreDB.Host = entity?.CoreDB?.DB1Host;
                            databaseInfo.CoreDB.Port = entity?.CoreDB?.DB1Port;
                            databaseInfo.CoreDB.Username = entity?.CoreDB?.DB1UserName;
                            databaseInfo.CoreDB.Password = entity?.CoreDB?.DB1Password;
                        }
                        if (entity?.MemDB) {
                            databaseInfo.MemDB = new TenantDBInfo();
                            databaseInfo.MemDB.Host = entity?.MemDB?.DB1Host;
                            databaseInfo.MemDB.Port = entity?.MemDB?.DB1Port;
                            databaseInfo.MemDB.Username = entity?.MemDB?.DB1UserName;
                            databaseInfo.MemDB.Password = entity?.MemDB?.DB1Password;
                        }
                        result = await this.common.ccSvc.fetchCTClientByDB(sessionId, entity.Id);
                        if (result?.ResultType === cc_service_1.HttpResultType.Failed)
                            this.common.logger.error(result.Exception);
                        else {
                            if (result?.Response?.Entities?.length > 0) {
                                databaseInfo.Tenant = result?.Response?.Entities[0]?.Code;
                            }
                        }
                        databaseInfos.push(databaseInfo);
                        databaseInfos = [...new Map(databaseInfos.map(item => [item['Id'], item])).values()];
                    }));
                }
                else {
                    this.common.logger.error(result.Exception);
                }
            }
            else {
                this.common.logger.error(result.Exception);
            }
        }
        else {
            this.common.logger.error(result.Exception);
        }
        return databaseInfos;
    }
    async fetchDatabase(databaseCode) {
        var databaseInfos = [];
        var result = await this.common.ccSvc.register();
        if (result?.ResultType === cc_service_1.HttpResultType.Success) {
            var sessionId = result?.Response?.SessionId;
            var client = new cc_service_1.CCClient();
            client.ApplicationCode = `RADIUSClient`;
            client.ClientCode = `SYS`;
            client.Username = this.common.property.application.ccServer.suLoginId;
            client.Password = this.common.chipherSvc.AESdecrypt(this.common.property.application.ccServer.suPassword);
            result = await this.common.ccSvc.login(sessionId, client);
            if (result?.ResultType === cc_service_1.HttpResultType.Success) {
                result = await this.common.ccSvc.fetchDatabase(sessionId, databaseCode);
                if (result?.ResultType === cc_service_1.HttpResultType.Success) {
                    await Promise.all(result?.Response?.Entities?.map(async (entity) => {
                        var databaseInfo = new DatabaseInfo();
                        databaseInfo.Code = entity.Code;
                        databaseInfo.Id = entity.Id;
                        databaseInfo.Name = entity.Name;
                        if (entity?.CoreDB) {
                            databaseInfo.CoreDB = new TenantDBInfo();
                            databaseInfo.CoreDB.Host = entity?.CoreDB?.DB1Host;
                            databaseInfo.CoreDB.Port = entity?.CoreDB?.DB1Port;
                            databaseInfo.CoreDB.Username = entity?.CoreDB?.DB1UserName;
                            databaseInfo.CoreDB.Password = entity?.CoreDB?.DB1Password;
                        }
                        if (entity?.MemDB) {
                            databaseInfo.MemDB = new TenantDBInfo();
                            databaseInfo.MemDB.Host = entity?.MemDB?.DB1Host;
                            databaseInfo.MemDB.Port = entity?.MemDB?.DB1Port;
                            databaseInfo.MemDB.Username = entity?.MemDB?.DB1UserName;
                            databaseInfo.MemDB.Password = entity?.MemDB?.DB1Password;
                        }
                        result = await this.common.ccSvc.fetchCTClientByDB(sessionId, entity.Id);
                        if (result?.ResultType === cc_service_1.HttpResultType.Failed)
                            this.common.logger.error(result.Exception);
                        else {
                            if (result?.Response?.Entities?.length > 0) {
                                databaseInfo.Tenant = result?.Response?.Entities[0]?.Code;
                            }
                        }
                        databaseInfos.push(databaseInfo);
                        databaseInfos = [...new Map(databaseInfos.map(item => [item['Id'], item])).values()];
                    }));
                }
                else {
                    this.common.logger.error(result.Exception);
                }
            }
            else {
                this.common.logger.error(result.Exception);
            }
        }
        else {
            this.common.logger.error(result.Exception);
        }
        return databaseInfos;
    }
}
exports.CCController = CCController;
class TenantInfo {
    Id;
    Name;
    Code;
    Address;
    DatabaseName;
    Status;
    CoreDB;
    MemDB;
}
exports.TenantInfo = TenantInfo;
class TenantDBInfo {
    Host;
    Port;
    Username;
    Password;
}
exports.TenantDBInfo = TenantDBInfo;
class TenantLicenseInfo {
    Id;
    Tenant;
    NoOfAdmins;
    NoOfAgents;
    Channels;
}
exports.TenantLicenseInfo = TenantLicenseInfo;
class ApplicationInfo {
    Id;
    Name;
    Code;
    Vendor;
    UserTypes;
}
exports.ApplicationInfo = ApplicationInfo;
class DatabaseInfo {
    Id;
    Name;
    Tenant;
    Code;
    CoreDB;
    MemDB;
}
exports.DatabaseInfo = DatabaseInfo;
//# sourceMappingURL=cc.controller.js.map