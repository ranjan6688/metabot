"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplicationInfo = exports.AppController = void 0;
const cc_service_1 = require("./../services/cc.service");
class AppController {
    common;
    constructor(common) {
        this.common = common;
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
        await this.common.ccSvc.logout(sessionId);
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
        await this.common.ccSvc.logout(sessionId);
        return applicationInfos;
    }
    async fetchApplicationsResponse() {
        var responseStringArray = [];
        var keyValueStringArray = [];
        var appInfos = await this.fetchApplications();
        appInfos?.forEach((info) => {
            keyValueStringArray = this.getKeyValueStringArray(info);
            responseStringArray.push(keyValueStringArray.join('\n'));
        });
        var replyMessage = responseStringArray.join(`\n===============================\n`);
        if (!replyMessage)
            replyMessage = `No application found`;
        return replyMessage;
    }
    async fetchApplicationResponse(applicationCode) {
        var responseStringArray = [];
        var keyValueStringArray = [];
        var appInfos = await this.fetchApplication(applicationCode);
        appInfos?.forEach((info) => {
            keyValueStringArray = this.getKeyValueStringArray(info);
            responseStringArray.push(keyValueStringArray.join('\n'));
        });
        var replyMessage = responseStringArray.join(`\n===============================\n`);
        if (!replyMessage)
            replyMessage = `No application found`;
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
exports.AppController = AppController;
class ApplicationInfo {
    Id;
    Name;
    Code;
    Vendor;
    UserTypes;
}
exports.ApplicationInfo = ApplicationInfo;
//# sourceMappingURL=application.controller.js.map