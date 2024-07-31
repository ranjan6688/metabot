"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseInfo = exports.DbController = void 0;
const cc_service_1 = require("./../services/cc.service");
const tenant_controller_1 = require("./tenant.controller");
class DbController {
    common;
    constructor(common) {
        this.common = common;
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
                            databaseInfo.CoreDB = new tenant_controller_1.TenantDBInfo();
                            databaseInfo.CoreDB.Host = entity?.CoreDB?.DB1Host;
                            databaseInfo.CoreDB.Port = entity?.CoreDB?.DB1Port;
                            databaseInfo.CoreDB.Username = entity?.CoreDB?.DB1UserName;
                            databaseInfo.CoreDB.Password = entity?.CoreDB?.DB1Password;
                        }
                        if (entity?.MemDB) {
                            databaseInfo.MemDB = new tenant_controller_1.TenantDBInfo();
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
        await this.common.ccSvc.logout(sessionId);
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
                            databaseInfo.CoreDB = new tenant_controller_1.TenantDBInfo();
                            databaseInfo.CoreDB.Host = entity?.CoreDB?.DB1Host;
                            databaseInfo.CoreDB.Port = entity?.CoreDB?.DB1Port;
                            databaseInfo.CoreDB.Username = entity?.CoreDB?.DB1UserName;
                            databaseInfo.CoreDB.Password = entity?.CoreDB?.DB1Password;
                        }
                        if (entity?.MemDB) {
                            databaseInfo.MemDB = new tenant_controller_1.TenantDBInfo();
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
        await this.common.ccSvc.logout(sessionId);
        return databaseInfos;
    }
    async fetchDatabasesResponse() {
        var responseStringArray = [];
        var keyValueStringArray = [];
        var dbInfos = await this.fetchDatabases();
        dbInfos?.forEach((info) => {
            keyValueStringArray = this.getKeyValueStringArray(info);
            responseStringArray.push(keyValueStringArray.join('\n'));
        });
        var replyMessage = responseStringArray.join(`\n===============================\n`);
        if (!replyMessage)
            replyMessage = `No database found`;
        return replyMessage;
    }
    async fetchDatabaseResponse(databaseCode) {
        var responseStringArray = [];
        var keyValueStringArray = [];
        var dbInfos = await this.fetchDatabase(databaseCode);
        dbInfos?.forEach((info) => {
            keyValueStringArray = this.getKeyValueStringArray(info);
            responseStringArray.push(keyValueStringArray.join('\n'));
        });
        var replyMessage = responseStringArray.join(`\n===============================\n`);
        if (!replyMessage)
            replyMessage = `No database found`;
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
exports.DbController = DbController;
class DatabaseInfo {
    Id;
    Name;
    Tenant;
    Code;
    CoreDB;
    MemDB;
}
exports.DatabaseInfo = DatabaseInfo;
//# sourceMappingURL=database.controller.js.map