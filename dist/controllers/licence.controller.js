"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TenantLicenseInfo = exports.LicenseController = void 0;
const cc_service_1 = require("./../services/cc.service");
class LicenseController {
    common;
    constructor(common) {
        this.common = common;
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
        await this.common.ccSvc.logout(sessionId);
        return licenseInfos;
    }
    async fetchLicenseResponse(tenantCode) {
        var responseStringArray = [];
        var keyValueStringArray = [];
        var licenseInfos = await this.fetchLicense(tenantCode);
        licenseInfos?.forEach((info) => {
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
exports.LicenseController = LicenseController;
class TenantLicenseInfo {
    Id;
    Tenant;
    NoOfAdmins;
    NoOfAgents;
    Channels;
}
exports.TenantLicenseInfo = TenantLicenseInfo;
//# sourceMappingURL=licence.controller.js.map