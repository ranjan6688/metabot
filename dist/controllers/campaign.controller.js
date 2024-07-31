"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CampaignIBPropertiesInfo = exports.CampaignOBPropertiesInfo = exports.CampaignVideoPropertiesInfo = exports.CampaignEmailPropertiesInfo = exports.CampaignChatPropertiesInfo = exports.CampaignTelephonePropertiesInfo = exports.CampaignGlobalACWInfo = exports.CampaignGlobalCRMInfo = exports.CampaignGlobalDefaultDispositionInfo = exports.CampaignGlobalPropertiesInfo = exports.CampaignPropertiesInfo = exports.CampaignStatusInfo = exports.CampaignInfo = exports.CampaignController = void 0;
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
                            campaignInfo.ContactList = result?.Response?.Entities[0]?.Global?.DefContactListCode || delete campaignInfo.ContactList;
                            campaignInfo.TaskLimit = result?.Response?.Entities[0]?.Global?.AgentTaskLimit || delete campaignInfo.TaskLimit;
                            result = await this.common.ccSvc.fetchCampaignStatus(sessionId, entity.Id);
                            campaignInfo.DialMode = result?.Response?.DialMode || delete campaignInfo.DialMode;
                            campaignInfo.Status = this.formatCampaignState(result?.Response?.CampaignState) || delete campaignInfo.Status;
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
                            campaignInfo.ContactList = result?.Response?.Entities[0]?.Global?.DefContactListCode || delete campaignInfo.ContactList;
                            campaignInfo.TaskLimit = result?.Response?.Entities[0]?.Global?.AgentTaskLimit || delete campaignInfo.TaskLimit;
                            result = await this.common.ccSvc.fetchCampaignStatus(sessionId, entity.Id);
                            campaignInfo.DialMode = result?.Response?.DialMode || delete campaignInfo.DialMode;
                            campaignInfo.Status = this.formatCampaignState(result?.Response?.CampaignState) || delete campaignInfo.Status;
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
    async fetchCampaignStatus(tenantCode, campaignCode) {
        var campaignStatusInfos = [];
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
                            var campaignStatusInfo = new CampaignStatusInfo();
                            campaignStatusInfo.Code = entity.Code;
                            campaignStatusInfo.Id = entity.Id;
                            campaignStatusInfo.Name = entity.Name;
                            campaignStatusInfo.Channels = entity.Channels;
                            campaignStatusInfo.Type = entity.CampaignType;
                            result = await this.common.ccSvc.fetchCampaignProperties(sessionId, entity.Id);
                            campaignStatusInfo.ContactList = result?.Response?.Entities[0]?.Global?.DefContactListCode || delete campaignStatusInfo.ContactList;
                            campaignStatusInfo.TaskLimit = result?.Response?.Entities[0]?.Global?.AgentTaskLimit || delete campaignStatusInfo.TaskLimit;
                            result = await this.common.ccSvc.fetchCampaignStatus(sessionId, entity.Id);
                            campaignStatusInfo.DialMode = result?.Response?.DialMode || delete campaignStatusInfo.DialMode;
                            campaignStatusInfo.Status = this.formatCampaignState(result?.Response?.CampaignState) || delete campaignStatusInfo.Status;
                            campaignStatusInfo.Agents = result?.Response?.AgentsPerChannel || delete campaignStatusInfo.Agents;
                            campaignStatusInfo.Queues = result?.Response?.QueuesPerChannel || delete campaignStatusInfo.Queues;
                            campaignStatusInfo.TotalContacts = result?.Response?.TotalContacts || delete campaignStatusInfo.TotalContacts;
                            campaignStatusInfos.push(campaignStatusInfo);
                            campaignStatusInfos = [...new Map(campaignStatusInfos.map(item => [item['Id'], item])).values()];
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
        return campaignStatusInfos;
    }
    async fetchCampaignProperties(tenantCode, campaignCode) {
        var infos = [];
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
                            var info = new CampaignPropertiesInfo();
                            info.Code = entity.Code;
                            info.Id = entity.Id;
                            info.Name = entity.Name;
                            info.Channels = entity.Channels;
                            info.Type = entity.CampaignType;
                            result = await this.common.ccSvc.fetchCampaignProperties(sessionId, entity.Id);
                            info.ContactList = result?.Response?.Entities[0]?.Global?.DefContactListCode || delete info.ContactList;
                            info.TaskLimit = result?.Response?.Entities[0]?.Global?.AgentTaskLimit || delete info.TaskLimit;
                            info.Global = this.getCampaignGlobalProperties(result?.Response?.Entities[0]);
                            info.Telephony = this.getCampaignTelephoneProperties(result?.Response?.Entities[0]);
                            info.Chat = this.getCampaignChatProperties(result?.Response?.Entities[0]);
                            info.Email = this.getCampaignEmailProperties(result?.Response?.Entities[0]);
                            info.Video = this.getCampaignVideoProperties(result?.Response?.Entities[0]);
                            result = await this.common.ccSvc.fetchCampaignStatus(sessionId, entity.Id);
                            info.DialMode = result?.Response?.DialMode || delete info.DialMode;
                            info.Status = this.formatCampaignState(result?.Response?.CampaignState) || delete info.Status;
                            infos.push(info);
                            infos = [...new Map(infos.map(item => [item['Id'], item])).values()];
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
        return infos;
    }
    getCampaignGlobalProperties(respObj) {
        var info = new CampaignGlobalPropertiesInfo();
        info.ACW = new CampaignGlobalACWInfo();
        info.ACW.Extend = respObj?.Global?.ACWExtend || delete info.ACW.Extend;
        info.ACW.Timeout = respObj?.Global?.ACWTimeout || delete info.ACW.Timeout;
        info.AutoCampaignJoin = respObj?.Global?.AutoCampaignJoin?.toString() || delete info.AutoCampaignJoin;
        info.AutoStart = respObj?.Global?.AutoStart?.toString() || delete info.AutoStart;
        info.CRM = new CampaignGlobalCRMInfo();
        info.CRM.HomeCRM = respObj?.Global?.Home_CRM_URL || delete info.CRM.HomeCRM;
        info.CRM.PopupCRM = respObj?.Global?.Popup_CRM_URL || delete info.CRM.PopupCRM;
        info.CRM.PopupScript = respObj?.Global?.Popup_Script_URL || delete info.CRM.PopupScript;
        info.CallbackTypes = respObj?.Global?.CallbackTypes || delete info.CallbackTypes;
        info.ContactAddressAccesses = respObj?.Global?.AgentContactAddressAccesses || delete info.ContactAddressAccesses;
        info.DefaultDisposition = new CampaignGlobalDefaultDispositionInfo();
        info.DefaultDisposition.Category = respObj?.Global?.DefDisposition?.Category || delete info.DefaultDisposition.Category;
        info.DefaultDisposition.Channels = respObj?.Global?.DefDisposition?.Channels || delete info.DefaultDisposition.Channels;
        info.DefaultDisposition.Code = respObj?.Global?.DefDisposition?.Code || delete info.DefaultDisposition.Code;
        info.DefaultDisposition.Id = respObj?.Global?.DefDisposition?.Id || delete info.DefaultDisposition.Id;
        info.DefaultDisposition.Name = respObj?.Global?.DefDisposition?.Name || delete info.DefaultDisposition.Name;
        info.DefaultDisposition.ScheduledType = respObj?.Global?.DefDisposition?.IsScheduledType?.toString() || delete info.DefaultDisposition.ScheduledType;
        info.ManualCampaignJoin = respObj?.Global?.AllowManualCampaignJoin?.toString() || delete info.ManualCampaignJoin;
        info.ManualCampaignLeave = respObj?.Global?.AllowManualCampaignLeave?.toString() || delete info.ManualCampaignLeave;
        info.RecordingMode = respObj?.Global?.RecordingMode || delete info.RecordingMode;
        return info;
    }
    getCampaignTelephoneProperties(respObj) {
        var info = new CampaignTelephonePropertiesInfo();
        info.AllowReject = respObj?.XT?.AllowReject?.toString() || delete info.AllowReject;
        info.AutoAnswer = respObj?.XT?.AutoAnswer?.toString() || delete info.AutoAnswer;
        info.DefaultCallerId = respObj?.XT?.DefCallerID || delete info.DefaultCallerId;
        info.DialTimeout = respObj?.XT?.DialTimeout || delete info.DialTimeout;
        info.Inbound = new CampaignIBPropertiesInfo();
        info.Inbound.AllowDialBack = respObj?.XT?.IB?.AllowDialBack?.toString() || delete info.Inbound.AllowDialBack;
        info.Inbound.CDNs = respObj?.XT?.IB?.CDNs || delete info.Inbound.CDNs;
        info.Outbound = new CampaignOBPropertiesInfo();
        info.Outbound.AllowManualDial = respObj?.XT?.OB?.AllowManualDial?.toString() || delete info.Outbound.AllowManualDial;
        info.Outbound.AllowedDialModes = respObj?.XT?.OB?.AllowedDialModes?.toString() || delete info.Outbound.AllowedDialModes;
        info.Outbound.AutoPreview = respObj?.XT?.OB?.AutoPreview?.toString() || delete info.Outbound.AutoPreview;
        info.Outbound.CLISelectionStrategy = respObj?.XT?.OB?.CLISelectionStrategy || delete info.Outbound.CLISelectionStrategy;
        info.Outbound.CallerIDs = respObj?.XT?.OB?.CallerIDs || delete info.Outbound.CallerIDs;
        info.Outbound.DNCCheck = respObj?.XT?.OB?.CheckDNC || delete info.Outbound.DNCCheck;
        info.Outbound.MaxAttemptCount = respObj?.XT?.OB?.MaxAttemptCount || delete info.Outbound.MaxAttemptCount;
        info.Outbound.OverrideDefaultCallerId = respObj?.XT?.OB?.OverrideDefCallerId || delete info.Outbound.OverrideDefaultCallerId;
        info.Outbound.PreviewTimeout = respObj?.XT?.OB?.PreviewTimeout || delete info.Outbound.PreviewTimeout;
        info.Outbound.RejectPreview = respObj?.XT?.OB?.CanRejectPreview?.toString() || delete info.Outbound.RejectPreview;
        return info;
    }
    getCampaignChatProperties(respObj) {
        var info = new CampaignChatPropertiesInfo();
        info.AllowReject = respObj?.XCH?.AllowReject?.toString() || delete info.AllowReject;
        info.AutoAnswer = respObj?.XCH?.AutoAnswer?.toString() || delete info.AutoAnswer;
        info.DefaultCallerId = respObj?.XCH?.DefCallerID || delete info.DefaultCallerId;
        info.DialTimeout = respObj?.XCH?.DialTimeout || delete info.DialTimeout;
        info.Inbound = new CampaignIBPropertiesInfo();
        info.Inbound.AllowDialBack = respObj?.XCH?.IB?.AllowDialBack?.toString() || delete info.Inbound.AllowDialBack;
        info.Inbound.CDNs = respObj?.XCH?.IB?.CDNs || delete info.Inbound.CDNs;
        return info;
    }
    getCampaignEmailProperties(respObj) {
        var info = new CampaignEmailPropertiesInfo();
        info.AllowReject = respObj?.XEM?.AllowReject?.toString() || delete info.AllowReject;
        info.AutoAnswer = respObj?.XEM?.AutoAnswer?.toString() || delete info.AutoAnswer;
        info.DefaultCallerId = respObj?.XEM?.DefCallerID || delete info.DefaultCallerId;
        info.DialTimeout = respObj?.XEM?.DialTimeout || delete info.DialTimeout;
        info.Inbound = new CampaignIBPropertiesInfo();
        info.Inbound.AllowDialBack = respObj?.XEM?.IB?.AllowDialBack?.toString() || delete info.Inbound.AllowDialBack;
        info.Inbound.CDNs = respObj?.XEM?.IB?.CDNs || delete info.Inbound.CDNs;
        info.Outbound = new CampaignOBPropertiesInfo();
        info.Outbound.AllowManualDial = respObj?.XEM?.OB?.AllowManualDial?.toString() || delete info.Outbound.AllowedDialModes;
        info.Outbound.AllowedDialModes = respObj?.XEM?.OB?.AllowedDialModes?.toString() || delete info.Outbound.AllowedDialModes;
        info.Outbound.AutoPreview = respObj?.XEM?.OB?.AutoPreview?.toString() || delete info.Outbound.AutoPreview;
        info.Outbound.CLISelectionStrategy = respObj?.XEM?.OB?.CLISelectionStrategy || delete info.Outbound.CLISelectionStrategy;
        info.Outbound.CallerIDs = respObj?.XEM?.OB?.CallerIDs || delete info.Outbound.CallerIDs;
        info.Outbound.DNCCheck = respObj?.XEM?.OB?.CheckDNC || delete info.Outbound.DNCCheck;
        info.Outbound.MaxAttemptCount = respObj?.XEM?.OB?.MaxAttemptCount || delete info.Outbound.MaxAttemptCount;
        info.Outbound.OverrideDefaultCallerId = respObj?.XEM?.OB?.OverrideDefCallerId || delete info.Outbound.OverrideDefaultCallerId;
        info.Outbound.PreviewTimeout = respObj?.XEM?.OB?.PreviewTimeout || delete info.Outbound.PreviewTimeout;
        info.Outbound.RejectPreview = respObj?.XEM?.OB?.CanRejectPreview?.toString() || delete info.Outbound.RejectPreview;
        return info;
    }
    getCampaignVideoProperties(respObj) {
        var info = new CampaignVideoPropertiesInfo();
        info.AllowReject = respObj?.XVD?.AllowReject?.toString() || delete info.AllowReject;
        info.AutoAnswer = respObj?.XVD?.AutoAnswer?.toString() || delete info.AutoAnswer;
        info.DefaultCallerId = respObj?.XVD?.DefCallerID || delete info.DefaultCallerId;
        info.DialTimeout = respObj?.XVD?.DialTimeout || delete info.DialTimeout;
        info.Inbound = new CampaignIBPropertiesInfo();
        info.Inbound.AllowDialBack = respObj?.XVD?.IB?.AllowDialBack?.toString() || delete info.Inbound.AllowDialBack;
        info.Inbound.CDNs = respObj?.XVD?.IB?.CDNs || delete info.Inbound.CDNs;
        return info;
    }
    async startCampaign(tenantCode, campaignCode) {
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
                            campaignInfo.ContactList = result?.Response?.Entities[0]?.Global?.DefContactListCode || delete campaignInfo.ContactList;
                            campaignInfo.TaskLimit = result?.Response?.Entities[0]?.Global?.AgentTaskLimit || delete campaignInfo.TaskLimit;
                            result = await this.common.ccSvc.startCampaign(sessionId, entity.Id, 'Manual');
                            if (result?.ResultType === cc_service_1.HttpResultType.Success) {
                                result = await this.common.ccSvc.fetchCampaignStatus(sessionId, entity.Id);
                                campaignInfo.DialMode = result?.Response?.DialMode || delete campaignInfo.DialMode;
                                campaignInfo.Status = this.formatCampaignState(result?.Response?.CampaignState) || delete campaignInfo.Status;
                            }
                            else {
                                campaignInfo.Status = this.common.errorProcessor.processError(result?.Exception);
                                result = await this.common.ccSvc.fetchCampaignStatus(sessionId, entity.Id);
                                campaignInfo.DialMode = result?.Response?.DialMode || delete campaignInfo.DialMode;
                            }
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
    async stopCampaign(tenantCode, campaignCode) {
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
                            campaignInfo.ContactList = result?.Response?.Entities[0]?.Global?.DefContactListCode || delete campaignInfo.ContactList;
                            campaignInfo.TaskLimit = result?.Response?.Entities[0]?.Global?.AgentTaskLimit || delete campaignInfo.TaskLimit;
                            result = await this.common.ccSvc.stopCampaign(sessionId, entity.Id);
                            if (result?.ResultType === cc_service_1.HttpResultType.Success) {
                                result = await this.common.ccSvc.fetchCampaignStatus(sessionId, entity.Id);
                                campaignInfo.DialMode = result?.Response?.DialMode || delete campaignInfo.DialMode;
                                campaignInfo.Status = this.formatCampaignState(result?.Response?.CampaignState) || delete campaignInfo.Status;
                            }
                            else {
                                campaignInfo.Status = this.common.errorProcessor.processError(result?.Exception);
                                result = await this.common.ccSvc.fetchCampaignStatus(sessionId, entity.Id);
                                campaignInfo.DialMode = result?.Response?.DialMode || delete campaignInfo.DialMode;
                            }
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
    async loadCampaign(tenantCode, campaignCode) {
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
                            campaignInfo.ContactList = result?.Response?.Entities[0]?.Global?.DefContactListCode || delete campaignInfo.ContactList;
                            campaignInfo.TaskLimit = result?.Response?.Entities[0]?.Global?.AgentTaskLimit || delete campaignInfo.TaskLimit;
                            result = await this.common.ccSvc.loadCampaign(sessionId, entity.Id);
                            if (result?.ResultType === cc_service_1.HttpResultType.Success) {
                                result = await this.common.ccSvc.fetchCampaignStatus(sessionId, entity.Id);
                                campaignInfo.DialMode = result?.Response?.DialMode || delete campaignInfo.DialMode;
                                campaignInfo.Status = this.formatCampaignState(result?.Response?.CampaignState) || delete campaignInfo.Status;
                            }
                            else {
                                campaignInfo.Status = this.common.errorProcessor.processError(result?.Exception);
                                result = await this.common.ccSvc.fetchCampaignStatus(sessionId, entity.Id);
                                campaignInfo.DialMode = result?.Response?.DialMode || delete campaignInfo.DialMode;
                            }
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
    async unloadCampaign(tenantCode, campaignCode) {
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
                            campaignInfo.ContactList = result?.Response?.Entities[0]?.Global?.DefContactListCode || delete campaignInfo.ContactList;
                            campaignInfo.TaskLimit = result?.Response?.Entities[0]?.Global?.AgentTaskLimit || delete campaignInfo.TaskLimit;
                            result = await this.common.ccSvc.unloadCampaign(sessionId, entity.Id);
                            if (result?.ResultType === cc_service_1.HttpResultType.Success) {
                                result = await this.common.ccSvc.fetchCampaignStatus(sessionId, entity.Id);
                                campaignInfo.DialMode = result?.Response?.DialMode || delete campaignInfo.DialMode;
                                campaignInfo.Status = this.formatCampaignState(result?.Response?.CampaignState) || delete campaignInfo.Status;
                            }
                            else {
                                campaignInfo.Status = this.common.errorProcessor.processError(result?.Exception);
                                result = await this.common.ccSvc.fetchCampaignStatus(sessionId, entity.Id);
                                campaignInfo.DialMode = result?.Response?.DialMode || delete campaignInfo.DialMode;
                            }
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
    async fetchCampaignStatusResponse(tenantCode, campaignCode) {
        var responseStringArray = [];
        var keyValueStringArray = [];
        var campaignStatusInfos = await this.fetchCampaignStatus(tenantCode, campaignCode);
        campaignStatusInfos?.forEach((info) => {
            keyValueStringArray = this.getKeyValueStringArray(info);
            responseStringArray.push(keyValueStringArray.join('\n'));
        });
        var replyMessage = responseStringArray.join(`\n===============================\n`);
        if (!replyMessage)
            replyMessage = `No campaign found`;
        return replyMessage;
    }
    async fetchCampaignPropertiesResponse(tenantCode, campaignCode) {
        var responseStringArray = [];
        var keyValueStringArray = [];
        var campaignPropertiesInfos = await this.fetchCampaignProperties(tenantCode, campaignCode);
        campaignPropertiesInfos?.forEach((info) => {
            keyValueStringArray = this.getKeyValueStringArray(info);
            responseStringArray.push(keyValueStringArray.join('\n'));
        });
        var replyMessage = responseStringArray.join(`\n===============================\n`);
        if (!replyMessage)
            replyMessage = `No campaign found`;
        return replyMessage;
    }
    async startCampaignResponse(tenantCode, campaignCode) {
        var responseStringArray = [];
        var keyValueStringArray = [];
        var infos = await this.startCampaign(tenantCode, campaignCode);
        infos?.forEach((info) => {
            keyValueStringArray = this.getKeyValueStringArray(info);
            responseStringArray.push(keyValueStringArray.join('\n'));
        });
        var replyMessage = responseStringArray.join(`\n===============================\n`);
        if (!replyMessage)
            replyMessage = `No campaign found`;
        return replyMessage;
    }
    async stopCampaignResponse(tenantCode, campaignCode) {
        var responseStringArray = [];
        var keyValueStringArray = [];
        var infos = await this.stopCampaign(tenantCode, campaignCode);
        infos?.forEach((info) => {
            keyValueStringArray = this.getKeyValueStringArray(info);
            responseStringArray.push(keyValueStringArray.join('\n'));
        });
        var replyMessage = responseStringArray.join(`\n===============================\n`);
        if (!replyMessage)
            replyMessage = `No campaign found`;
        return replyMessage;
    }
    async loadCampaignResponse(tenantCode, campaignCode) {
        var responseStringArray = [];
        var keyValueStringArray = [];
        var infos = await this.loadCampaign(tenantCode, campaignCode);
        infos?.forEach((info) => {
            keyValueStringArray = this.getKeyValueStringArray(info);
            responseStringArray.push(keyValueStringArray.join('\n'));
        });
        var replyMessage = responseStringArray.join(`\n===============================\n`);
        if (!replyMessage)
            replyMessage = `No campaign found`;
        return replyMessage;
    }
    async unloadCampaignResponse(tenantCode, campaignCode) {
        var responseStringArray = [];
        var keyValueStringArray = [];
        var infos = await this.unloadCampaign(tenantCode, campaignCode);
        infos?.forEach((info) => {
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
class CampaignStatusInfo {
    Id;
    Name;
    Code;
    Channels;
    Type;
    DialMode;
    TaskLimit;
    ContactList;
    TotalContacts;
    Status;
    Agents;
    Queues;
}
exports.CampaignStatusInfo = CampaignStatusInfo;
class CampaignPropertiesInfo {
    Id;
    Name;
    Code;
    Channels;
    Type;
    DialMode;
    TaskLimit;
    ContactList;
    Status;
    Global;
    Telephony;
    Chat;
    Email;
    Video;
}
exports.CampaignPropertiesInfo = CampaignPropertiesInfo;
class CampaignGlobalPropertiesInfo {
    RecordingMode;
    ManualCampaignJoin;
    ManualCampaignLeave;
    AutoCampaignJoin;
    AutoStart;
    ContactAddressAccesses;
    CallbackTypes;
    DefaultDisposition;
    CRM;
    ACW;
}
exports.CampaignGlobalPropertiesInfo = CampaignGlobalPropertiesInfo;
class CampaignGlobalDefaultDispositionInfo {
    Id;
    Code;
    Name;
    Category;
    Channels;
    ScheduledType;
}
exports.CampaignGlobalDefaultDispositionInfo = CampaignGlobalDefaultDispositionInfo;
class CampaignGlobalCRMInfo {
    HomeCRM;
    PopupCRM;
    PopupScript;
}
exports.CampaignGlobalCRMInfo = CampaignGlobalCRMInfo;
class CampaignGlobalACWInfo {
    Timeout;
    Extend;
}
exports.CampaignGlobalACWInfo = CampaignGlobalACWInfo;
class CampaignTelephonePropertiesInfo {
    DialTimeout;
    AutoAnswer;
    AllowReject;
    DefaultCallerId;
    Inbound;
    Outbound;
}
exports.CampaignTelephonePropertiesInfo = CampaignTelephonePropertiesInfo;
class CampaignChatPropertiesInfo {
    DialTimeout;
    AutoAnswer;
    AllowReject;
    DefaultCallerId;
    Inbound;
}
exports.CampaignChatPropertiesInfo = CampaignChatPropertiesInfo;
class CampaignEmailPropertiesInfo {
    DialTimeout;
    AutoAnswer;
    AllowReject;
    DefaultCallerId;
    Inbound;
    Outbound;
}
exports.CampaignEmailPropertiesInfo = CampaignEmailPropertiesInfo;
class CampaignVideoPropertiesInfo {
    DialTimeout;
    AutoAnswer;
    AllowReject;
    DefaultCallerId;
    Inbound;
}
exports.CampaignVideoPropertiesInfo = CampaignVideoPropertiesInfo;
class CampaignOBPropertiesInfo {
    MaxAttemptCount;
    PreviewTimeout;
    CLISelectionStrategy;
    CallerIDs;
    AutoPreview;
    AllowManualDial;
    DNCCheck;
    OverrideDefaultCallerId;
    RejectPreview;
    AllowedDialModes;
}
exports.CampaignOBPropertiesInfo = CampaignOBPropertiesInfo;
class CampaignIBPropertiesInfo {
    AllowDialBack;
    CDNs;
}
exports.CampaignIBPropertiesInfo = CampaignIBPropertiesInfo;
//# sourceMappingURL=campaign.controller.js.map