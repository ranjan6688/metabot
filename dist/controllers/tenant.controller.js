"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TenantDBInfo = exports.TenantDefaultAdminInfo = exports.TenantInfo = exports.TenantController = void 0;
const cc_service_1 = require("./../services/cc.service");
class TenantController {
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
        await this.common.ccSvc.logout(sessionId);
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
        await this.common.ccSvc.logout(sessionId);
        return tenantInfos;
    }
    async fetchTenantDefaultAdmin(sessionId, tenantCode) {
        var tenantInfos = [];
        var client = new cc_service_1.CCClient();
        client.ApplicationCode = `RADIUSClient`;
        client.ClientCode = `SYS`;
        client.Username = this.common.property.application.ccServer.suLoginId;
        client.Password = this.common.chipherSvc.AESdecrypt(this.common.property.application.ccServer.suPassword);
        var result = await this.common.ccSvc.login(sessionId, client);
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
                    tenantInfo.DefaultAdmin = new TenantDefaultAdminInfo();
                    tenantInfo.DefaultAdmin.LoginId = entity.DefAdminLoginId;
                    tenantInfo.DefaultAdmin.Password = entity.DefAdminPassword;
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
        await this.common.ccSvc.logout(sessionId);
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
        await this.common.ccSvc.logout(sessionId);
        return tenantInfos;
    }
    async fetchTenantsResponse() {
        var responseStringArray = [];
        var keyValueStringArray = [];
        var tenantInfos = await this.fetchTenants();
        tenantInfos?.forEach((info) => {
            keyValueStringArray = this.getKeyValueStringArray(info);
            responseStringArray.push(keyValueStringArray.join('\n'));
        });
        var replyMessage = responseStringArray.join(`\n===============================\n`);
        if (!replyMessage)
            replyMessage = `No tenant found`;
        return replyMessage;
    }
    async fetchTenantResponse(tenantCode) {
        var responseStringArray = [];
        var keyValueStringArray = [];
        var tenantInfos = await this.fetchTenant(tenantCode);
        tenantInfos?.forEach((info) => {
            keyValueStringArray = this.getKeyValueStringArray(info);
            responseStringArray.push(keyValueStringArray.join('\n'));
        });
        var replyMessage = responseStringArray.join(`\n===============================\n`);
        if (!replyMessage)
            replyMessage = `No tenant found`;
        return replyMessage;
    }
    async fetchTenantStatusResponse(tenantCode) {
        var responseStringArray = [];
        var keyValueStringArray = [];
        var tenantInfos = await this.fetchTenant(tenantCode);
        tenantInfos?.forEach((info) => {
            keyValueStringArray = this.getKeyValueStringArray(info);
            responseStringArray.push(keyValueStringArray.join('\n'));
        });
        var replyMessage = responseStringArray.join(`\n===============================\n`);
        if (!replyMessage)
            replyMessage = `No tenant found`;
        return replyMessage;
    }
    async startTenantResponse(tenantCode) {
        var responseStringArray = [];
        var keyValueStringArray = [];
        var tenantInfos = await this.startTenant(tenantCode);
        tenantInfos?.forEach((info) => {
            keyValueStringArray = this.getKeyValueStringArray(info);
            responseStringArray.push(keyValueStringArray.join('\n'));
        });
        var replyMessage = responseStringArray.join(`\n===============================\n`);
        if (!replyMessage)
            replyMessage = `No tenant found`;
        return replyMessage;
    }
    async stopTenantResponse(tenantCode) {
        var responseStringArray = [];
        var keyValueStringArray = [];
        var tenantInfos = await this.stopTenant(tenantCode);
        tenantInfos?.forEach((info) => {
            keyValueStringArray = this.getKeyValueStringArray(info);
            responseStringArray.push(keyValueStringArray.join('\n'));
        });
        var replyMessage = responseStringArray.join(`\n===============================\n`);
        if (!replyMessage)
            replyMessage = `No tenant found`;
        return replyMessage;
    }
    getKeyValueStringArray(entity) {
        var keyValueStringArray = [];
        for (const [key, value] of Object.entries(entity)) {
            if (typeof value === 'object' && !Array.isArray(value) && value !== null) {
                keyValueStringArray.push(`\n*_[${key}]_*`);
                var subArray = this.getKeyValueStringArray(value);
                keyValueStringArray = [...keyValueStringArray, ...subArray];
            }
            else {
                if (key?.toLowerCase() !== 'id' &&
                    !key?.toLowerCase().includes('password'))
                    keyValueStringArray.push(`*${key}*: ${value}`);
            }
        }
        return keyValueStringArray;
    }
}
exports.TenantController = TenantController;
class TenantInfo {
    Id;
    Name;
    Code;
    Address;
    DatabaseName;
    Status;
    DefaultAdmin;
    CoreDB;
    MemDB;
}
exports.TenantInfo = TenantInfo;
class TenantDefaultAdminInfo {
    LoginId;
    Password;
}
exports.TenantDefaultAdminInfo = TenantDefaultAdminInfo;
class TenantDBInfo {
    Host;
    Port;
    Username;
    Password;
}
exports.TenantDBInfo = TenantDBInfo;
//# sourceMappingURL=tenant.controller.js.map