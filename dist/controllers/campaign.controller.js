"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CampaignInfo = exports.CampaignController = void 0;
const cc_service_1 = require("./../services/cc.service");
class CampaignController {
    common;
    constructor(common) {
        this.common = common;
    }
    async fetchCampaigns(tenantCode) {
        var campaignInfos = [];
        var result = await this.common.ccSvc.register();
        if (result?.ResultType === cc_service_1.HttpResultType.Success) {
            var sessionId = result?.Response?.SessionId;
            result = await this.common.tenantController.fetchTenantDefaultAdmin(sessionId, tenantCode);
            var tenantInfo = result && result[0];
            if (!tenantInfo) {
                this.common.logger.error(`No tenant found!`);
            }
            else {
                var client = new cc_service_1.CCClient();
                client.ApplicationCode = `Atomos`;
                client.ClientCode = tenantCode;
                client.Username = tenantInfo.DefaultAdmin.LoginId;
                client.Password = tenantInfo.DefaultAdmin.Password;
                result = await this.common.ccSvc.login(sessionId, client);
                if (result?.ResultType === cc_service_1.HttpResultType.Success) {
                    result = await this.common.ccSvc.fetchCampaign(sessionId);
                    if (result?.ResultType === cc_service_1.HttpResultType.Success) {
                        await Promise.all(result?.Response?.Entities?.map(async (entity) => {
                            var campaignInfo = new CampaignInfo();
                            campaignInfo.Code = entity.Code;
                            campaignInfo.Id = entity.Id;
                            campaignInfo.Name = entity.Name;
                            campaignInfo.Channels = entity.Channels;
                            campaignInfo.Type = entity.CampaignType;
                            result = await this.common.ccSvc.fetchCampaignProperties(sessionId, entity.Id);
                            campaignInfo.ContactList = result?.Response?.Entities[0]?.Global?.DefContactListCode || '--';
                            campaignInfo.TaskLimit = result?.Response?.Entities[0]?.Global?.AgentTaskLimit || '--';
                            result = await this.common.ccSvc.fetchCampaignStatus(sessionId, entity.Id);
                            campaignInfo.DialMode = result?.Response?.DialMode || '--';
                            campaignInfo.Status = this.formatCampaignState(result?.Response?.CampaignState) || '--';
                            campaignInfos.push(campaignInfo);
                            campaignInfos = [...new Map(campaignInfos.map(item => [item['Id'], item])).values()];
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
        }
        else {
            this.common.logger.error(result.Exception);
        }
        await this.common.ccSvc.logout(sessionId);
        return campaignInfos;
    }
    async fetchCampaign(tenantCode, campaignCode) {
        var campaignInfos = [];
        var result = await this.common.ccSvc.register();
        if (result?.ResultType === cc_service_1.HttpResultType.Success) {
            var sessionId = result?.Response?.SessionId;
            result = await this.common.tenantController.fetchTenantDefaultAdmin(sessionId, tenantCode);
            var tenantInfo = result && result[0];
            if (!tenantInfo) {
                this.common.logger.error(`No tenant found!`);
            }
            else {
                var client = new cc_service_1.CCClient();
                client.ApplicationCode = `Atomos`;
                client.ClientCode = tenantCode;
                client.Username = tenantInfo.DefaultAdmin.LoginId;
                client.Password = tenantInfo.DefaultAdmin.Password;
                result = await this.common.ccSvc.login(sessionId, client);
                if (result?.ResultType === cc_service_1.HttpResultType.Success) {
                    result = await this.common.ccSvc.fetchCampaign(sessionId, campaignCode);
                    if (result?.ResultType === cc_service_1.HttpResultType.Success) {
                        await Promise.all(result?.Response?.Entities?.map(async (entity) => {
                            var campaignInfo = new CampaignInfo();
                            campaignInfo.Code = entity.Code;
                            campaignInfo.Id = entity.Id;
                            campaignInfo.Name = entity.Name;
                            campaignInfo.Channels = entity.Channels;
                            campaignInfo.Type = entity.CampaignType;
                            result = await this.common.ccSvc.fetchCampaignProperties(sessionId, entity.Id);
                            campaignInfo.ContactList = result?.Response?.Entities[0]?.Global?.DefContactListCode || '--';
                            campaignInfo.TaskLimit = result?.Response?.Entities[0]?.Global?.AgentTaskLimit || '--';
                            result = await this.common.ccSvc.fetchCampaignStatus(sessionId, entity.Id);
                            campaignInfo.DialMode = result?.Response?.DialMode || '--';
                            campaignInfo.Status = this.formatCampaignState(result?.Response?.CampaignState) || '--';
                            campaignInfos.push(campaignInfo);
                            campaignInfos = [...new Map(campaignInfos.map(item => [item['Id'], item])).values()];
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
        }
        else {
            this.common.logger.error(result.Exception);
        }
        await this.common.ccSvc.logout(sessionId);
        return campaignInfos;
    }
    async fetchCampaignsResponse(tenantCode) {
        var responseStringArray = [];
        var keyValueStringArray = [];
        var campaignInfos = await this.fetchCampaigns(tenantCode);
        campaignInfos?.forEach((info) => {
            keyValueStringArray = this.getKeyValueStringArray(info);
            responseStringArray.push(keyValueStringArray.join('\n'));
        });
        var replyMessage = responseStringArray.join(`\n===============================\n`);
        if (!replyMessage)
            replyMessage = `No campaign found`;
        return replyMessage;
    }
    async fetchCampaignResponse(tenantCode, campaignCode) {
        var responseStringArray = [];
        var keyValueStringArray = [];
        var campaignInfos = await this.fetchCampaign(tenantCode, campaignCode);
        campaignInfos?.forEach((info) => {
            keyValueStringArray = this.getKeyValueStringArray(info);
            responseStringArray.push(keyValueStringArray.join('\n'));
        });
        var replyMessage = responseStringArray.join(`\n===============================\n`);
        if (!replyMessage)
            replyMessage = `No campaign found`;
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
    formatCampaignState(state) {
        switch (state) {
            case 'Start':
                return 'Started';
                break;
            case 'Stop':
                return 'Stopped';
                break;
            case 'Load':
                return 'Loaded';
                break;
            case 'Unload':
                return 'Unloaded';
                break;
        }
        return '';
    }
    ;
}
exports.CampaignController = CampaignController;
class CampaignInfo {
    Id;
    Name;
    Code;
    Channels;
    Type;
    DialMode;
    TaskLimit;
    ContactList;
    Status;
}
exports.CampaignInfo = CampaignInfo;
//# sourceMappingURL=campaign.controller.js.map