"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TenantDBInfo = exports.TenantInfo = exports.CCController = void 0;
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
                    result?.Response?.Entities?.forEach((entity) => {
                    });
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
                    result?.Response?.Entities?.forEach((entity) => {
                    });
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
                    result?.Response?.Entities?.forEach((entity) => {
                    });
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
                    result?.Response?.Entities?.forEach((entity) => {
                    });
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
//# sourceMappingURL=cc.controller.js.map