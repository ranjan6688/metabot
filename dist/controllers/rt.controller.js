"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CampaignInfo = exports.QueueInfo = exports.TermialInfo = exports.AgentInfo = exports.QueueStatusInfo = exports.EmailStatusInfo = exports.ChatStatusInfo = exports.CallStatusInfo = exports.AgentStatusInfo = exports.CampaignStatusInfo = exports.RTController = void 0;
const rt_service_1 = require("./../services/rt.service");
class RTController {
    common;
    constructor(common) {
        this.common = common;
    }
    async getRTClient(tenantCode) {
        var result = await this.common.ccSvc.register();
        if (result?.ResultType === rt_service_1.HttpResultType.Success) {
            var sessionId = result?.Response?.SessionId;
            result = await this.common.tenantController.fetchTenantDefaultAdmin(sessionId, tenantCode);
            var tenantInfo = result && result[0];
            if (!tenantInfo) {
                this.common.logger.error(`No tenant found!`);
            }
            else {
                var client = new rt_service_1.RTClient();
                client.ApplicationCode = `Atomos`;
                client.ClientCode = tenantCode;
                client.Username = tenantInfo.DefaultAdmin.LoginId;
                client.Password = tenantInfo.DefaultAdmin.Password;
                await this.common.ccSvc.logout(sessionId);
                return client;
            }
        }
        else {
            this.common.logger.error(result.Exception);
        }
        await this.common.ccSvc.logout(sessionId);
        return undefined;
    }
    async fetchAgentStatus(tenantCode) {
        var client = await this.getRTClient(tenantCode);
        if (client) {
            var result = await this.common.rtSvc.register();
            if (result?.ResultType === rt_service_1.HttpResultType.Success) {
                var sessionId = result?.Response?.SessionId;
                result = await this.common.rtSvc.login(sessionId, client);
                if (result?.ResultType === rt_service_1.HttpResultType.Success) {
                    var service = new rt_service_1.RtServiceInfo();
                    service.rtClient = client;
                    service.serviceName = rt_service_1.RtService.Agent;
                    result = await this.common.rtSvc.registerSvc(sessionId, service);
                    if (result?.ResultType === rt_service_1.HttpResultType.Success) {
                        return result?.Response?.CurrentStatus;
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
            await this.common.rtSvc.logout(sessionId);
        }
        return undefined;
    }
    async fetchCampaignStatus(tenantCode) {
        var client = await this.getRTClient(tenantCode);
        if (client) {
            var result = await this.common.rtSvc.register();
            if (result?.ResultType === rt_service_1.HttpResultType.Success) {
                var sessionId = result?.Response?.SessionId;
                result = await this.common.rtSvc.login(sessionId, client);
                if (result?.ResultType === rt_service_1.HttpResultType.Success) {
                    var service = new rt_service_1.RtServiceInfo();
                    service.rtClient = client;
                    service.serviceName = rt_service_1.RtService.Campaign;
                    result = await this.common.rtSvc.registerSvc(sessionId, service);
                    if (result?.ResultType === rt_service_1.HttpResultType.Success) {
                        return result?.Response?.CurrentStatus;
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
            await this.common.rtSvc.logout(sessionId);
        }
        return undefined;
    }
    async fetchCallStatus(tenantCode) {
        var client = await this.getRTClient(tenantCode);
        if (client) {
            var result = await this.common.rtSvc.register();
            if (result?.ResultType === rt_service_1.HttpResultType.Success) {
                var sessionId = result?.Response?.SessionId;
                result = await this.common.rtSvc.login(sessionId, client);
                if (result?.ResultType === rt_service_1.HttpResultType.Success) {
                    var service = new rt_service_1.RtServiceInfo();
                    service.rtClient = client;
                    service.serviceName = rt_service_1.RtService.Call;
                    result = await this.common.rtSvc.registerSvc(sessionId, service);
                    if (result?.ResultType === rt_service_1.HttpResultType.Success) {
                        return result?.Response?.CurrentStatus;
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
            await this.common.rtSvc.logout(sessionId);
        }
        return undefined;
    }
    async fetchChatStatus(tenantCode) {
        var client = await this.getRTClient(tenantCode);
        if (client) {
            var result = await this.common.rtSvc.register();
            if (result?.ResultType === rt_service_1.HttpResultType.Success) {
                var sessionId = result?.Response?.SessionId;
                result = await this.common.rtSvc.login(sessionId, client);
                if (result?.ResultType === rt_service_1.HttpResultType.Success) {
                    var service = new rt_service_1.RtServiceInfo();
                    service.rtClient = client;
                    service.serviceName = rt_service_1.RtService.Chat;
                    result = await this.common.rtSvc.registerSvc(sessionId, service);
                    if (result?.ResultType === rt_service_1.HttpResultType.Success) {
                        return result?.Response?.CurrentStatus;
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
            await this.common.rtSvc.logout(sessionId);
        }
        return undefined;
    }
    async fetchEmailStatus(tenantCode) {
        var client = await this.getRTClient(tenantCode);
        if (client) {
            var result = await this.common.rtSvc.register();
            if (result?.ResultType === rt_service_1.HttpResultType.Success) {
                var sessionId = result?.Response?.SessionId;
                result = await this.common.rtSvc.login(sessionId, client);
                if (result?.ResultType === rt_service_1.HttpResultType.Success) {
                    var service = new rt_service_1.RtServiceInfo();
                    service.rtClient = client;
                    service.serviceName = rt_service_1.RtService.Email;
                    result = await this.common.rtSvc.registerSvc(sessionId, service);
                    if (result?.ResultType === rt_service_1.HttpResultType.Success) {
                        return result?.Response?.CurrentStatus;
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
            await this.common.rtSvc.logout(sessionId);
        }
        return undefined;
    }
    async fetchQueueStatus(tenantCode) {
        var client = await this.getRTClient(tenantCode);
        if (client) {
            var result = await this.common.rtSvc.register();
            if (result?.ResultType === rt_service_1.HttpResultType.Success) {
                var sessionId = result?.Response?.SessionId;
                result = await this.common.rtSvc.login(sessionId, client);
                if (result?.ResultType === rt_service_1.HttpResultType.Success) {
                    var service = new rt_service_1.RtServiceInfo();
                    service.rtClient = client;
                    service.serviceName = rt_service_1.RtService.Queue;
                    result = await this.common.rtSvc.registerSvc(sessionId, service);
                    if (result?.ResultType === rt_service_1.HttpResultType.Success) {
                        return result?.Response?.CurrentStatus;
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
            await this.common.rtSvc.logout(sessionId);
        }
        return undefined;
    }
    async callBargeIn(tenantCode, uxSessId, toAddress) {
        var infos = await this.fetchCallStatus(tenantCode);
        var info = infos?.find(s => s.UCallID?.toUpperCase() === uxSessId?.toUpperCase());
        if (info) {
            return await this.common.ccController.callBargeIn(tenantCode, info, toAddress);
        }
        return false;
    }
    async fetchAgentStatusResponse(tenantCode) {
        var responseStringArray = [];
        var keyValueStringArray = [];
        var infos = await this.fetchAgentStatus(tenantCode);
        infos = this.getAgentStatusObject(infos);
        infos?.forEach((info) => {
            keyValueStringArray = this.getKeyValueStringArray(info);
            responseStringArray.push(keyValueStringArray.join('\n'));
        });
        var replyMessage = responseStringArray.join(`\n===============================\n`);
        if (!replyMessage)
            replyMessage = `No data`;
        return replyMessage;
    }
    async fetchCampaignStatusResponse(tenantCode) {
        var responseStringArray = [];
        var keyValueStringArray = [];
        var infos = await this.fetchCampaignStatus(tenantCode);
        infos = this.getCampaignStatusObject(infos);
        infos?.forEach((info) => {
            keyValueStringArray = this.getKeyValueStringArray(info);
            responseStringArray.push(keyValueStringArray.join('\n'));
        });
        var replyMessage = responseStringArray.join(`\n===============================\n`);
        if (!replyMessage)
            replyMessage = `No data`;
        return replyMessage;
    }
    async fetchCallStatusResponse(tenantCode) {
        var responseStringArray = [];
        var keyValueStringArray = [];
        var infos = await this.fetchCallStatus(tenantCode);
        infos = this.getCallStatusObject(infos);
        infos?.forEach((info) => {
            keyValueStringArray = this.getKeyValueStringArray(info);
            responseStringArray.push(keyValueStringArray.join('\n'));
        });
        var replyMessage = responseStringArray.join(`\n===============================\n`);
        if (!replyMessage)
            replyMessage = `No data`;
        return replyMessage;
    }
    async fetchChatStatusResponse(tenantCode) {
        var responseStringArray = [];
        var keyValueStringArray = [];
        var infos = await this.fetchChatStatus(tenantCode);
        infos = this.getChatStatusObject(infos);
        infos?.forEach((info) => {
            keyValueStringArray = this.getKeyValueStringArray(info);
            responseStringArray.push(keyValueStringArray.join('\n'));
        });
        var replyMessage = responseStringArray.join(`\n===============================\n`);
        if (!replyMessage)
            replyMessage = `No data`;
        return replyMessage;
    }
    async fetchEmailStatusResponse(tenantCode) {
        var responseStringArray = [];
        var keyValueStringArray = [];
        var infos = await this.fetchEmailStatus(tenantCode);
        infos = this.getEmailStatusObject(infos);
        infos?.forEach((info) => {
            keyValueStringArray = this.getKeyValueStringArray(info);
            responseStringArray.push(keyValueStringArray.join('\n'));
        });
        var replyMessage = responseStringArray.join(`\n===============================\n`);
        if (!replyMessage)
            replyMessage = `No data`;
        return replyMessage;
    }
    async fetchQueueStatusResponse(tenantCode) {
        var responseStringArray = [];
        var keyValueStringArray = [];
        var infos = await this.fetchQueueStatus(tenantCode);
        infos = this.getQueueStatusObject(infos);
        infos?.forEach((info) => {
            keyValueStringArray = this.getKeyValueStringArray(info);
            responseStringArray.push(keyValueStringArray.join('\n'));
        });
        var replyMessage = responseStringArray.join(`\n===============================\n`);
        if (!replyMessage)
            replyMessage = `No data`;
        return replyMessage;
    }
    async callBargeInResponse(tenantCode, uxSessId, toAddress) {
        var responseStringArray = [];
        var keyValueStringArray = [];
        var flag = await this.callBargeIn(tenantCode, uxSessId, toAddress);
        keyValueStringArray.push(flag === true ? 'Call barged in successfully!' : 'Call not found!');
        responseStringArray.push(keyValueStringArray.join('\n'));
        var replyMessage = responseStringArray.join(`\n===============================\n`);
        if (!replyMessage)
            replyMessage = `No data`;
        return replyMessage;
    }
    getCampaignStatusObject(entities) {
        var infos = [];
        entities?.forEach((entity) => {
            var info = new CampaignStatusInfo();
            info.Channels = entity.Channels;
            info.Code = entity.Code;
            info.DialMode = entity.DialMode;
            info.Id = entity.Id;
            info.Name = entity.Name;
            info.State = entity.CampaignState;
            info.Type = entity.CampaignType;
            info.Agents = [];
            entity?.Agents.forEach((agentInfo) => {
                var agent = new AgentInfo();
                agent.LoginId = agentInfo.LoginId;
                agent.Name = agentInfo.Name;
                agent.State = agentInfo.AgentState;
                agent.Terminals = [];
                for (const [key, value] of Object.entries(agentInfo.Terminals)) {
                    var _value = value;
                    if (value) {
                        var terminal = new TermialInfo();
                        terminal.Address = _value.Address;
                        terminal.Channel = _value.Channel;
                        terminal.State = _value.TerminalState;
                        terminal.XServer = _value.XServerCode;
                        agent.Terminals.push(terminal);
                    }
                }
                if (agent.Terminals?.length === 0)
                    delete agent.Terminals;
                info.Agents.push(agent);
            });
            if (info.Agents?.length === 0)
                delete info.Agents;
            info.Queues = [];
            entity?.Queues.forEach((queueInfo) => {
                var queue = new QueueInfo();
                queue.Channel = queueInfo.Channel;
                queue.Code = queueInfo.Code;
                queue.Name = queueInfo.Name;
                info.Queues.push(queue);
            });
            if (info.Queues?.length === 0)
                delete info.Queues;
            infos.push(info);
        });
        return infos;
    }
    getAgentStatusObject(entities) {
        var infos = [];
        entities?.forEach((entity) => {
            var info = new AgentStatusInfo();
            info.State = entity.AgentState;
            info.LoginId = entity.LoginId;
            info.Name = entity.Name;
            info.Campaigns = [];
            entity?.Campaigns.forEach((campaignInfo) => {
                var campaign = new CampaignInfo();
                campaign.Channels = campaignInfo.Channels;
                campaign.Code = campaignInfo.Code;
                campaign.DialMode = campaignInfo.DialMode;
                campaign.State = campaignInfo.CampaignState;
                campaign.Type = campaignInfo.CampaignType;
                info.Campaigns.push(campaign);
            });
            if (info.Campaigns?.length === 0)
                delete info.Campaigns;
            info.Queues = [];
            entity?.Queues.forEach((queueInfo) => {
                var queue = new QueueInfo();
                queue.Channel = queueInfo.Channel;
                queue.Code = queueInfo.Code;
                queue.Name = queueInfo.Name;
                info.Queues.push(queue);
            });
            if (info.Queues?.length === 0)
                delete info.Queues;
            info.Terminals = [];
            for (const [key, value] of Object.entries(entity.Terminals)) {
                var _value = value;
                if (value) {
                    var terminal = new TermialInfo();
                    terminal.Address = _value.Address;
                    terminal.Channel = _value.Channel;
                    terminal.State = _value.TerminalState;
                    terminal.XServer = _value.XServerCode;
                    info.Terminals.push(terminal);
                }
            }
            if (info.Terminals?.length === 0)
                delete info.Terminals;
            infos.push(info);
        });
        return infos;
    }
    getCallStatusObject(entities) {
        var infos = [];
        entities?.forEach((entity) => {
            var info = new CallStatusInfo();
            info.CallerID = entity.CallerID;
            info.DialedID = entity.DialedID;
            info.DialedString = entity.DialedString;
            info.State = entity.CallState;
            info.Status = entity.CallStatus;
            info.Type = entity.CallType;
            info.UCallID = entity.UCallID;
            if (entity.Campaign) {
                info.Campaign = new CampaignInfo();
                info.Campaign.Channels = entity.Campaign.Channels;
                info.Campaign.Code = entity.Campaign.Code;
                info.Campaign.DialMode = entity.Campaign.DialMode;
                info.Campaign.State = entity.Campaign.CampaignState;
                info.Campaign.Type = entity.Campaign.CampaignType;
            }
            if (entity.CurrAgent) {
                info.Agent = new AgentInfo();
                info.Agent.LoginId = entity.CurrAgent.LoginId;
                info.Agent.Name = entity.CurrAgent.Name;
                info.Agent.State = entity.CurrAgent.AgentState;
                info.Agent.Queues = [];
                entity?.CurrAgent?.Queues.forEach((queueInfo) => {
                    var queue = new QueueInfo();
                    queue.Channel = queueInfo.Channel;
                    queue.Code = queueInfo.Code;
                    queue.Name = queueInfo.Name;
                    queue.AgentState = queueInfo.Agents[info.Agent.LoginId].AgentState;
                    info.Agent.Queues.push(queue);
                });
                if (info.Agent.Queues?.length === 0)
                    delete info.Agent.Queues;
            }
            if (entity?.CurrAgent?.Terminals) {
                info.Terminals = [];
                for (const [key, value] of Object.entries(entity?.CurrAgent?.Terminals)) {
                    var _value = value;
                    if (value) {
                        var terminal = new TermialInfo();
                        terminal.Address = _value.Address;
                        terminal.Channel = _value.Channel;
                        terminal.State = _value.TerminalState;
                        terminal.XServer = _value.XServerCode;
                        info.Terminals.push(terminal);
                    }
                }
                if (info.Terminals?.length === 0)
                    delete info.Terminals;
            }
            infos.push(info);
        });
        return infos;
    }
    getChatStatusObject(entities) {
        var infos = [];
        entities?.forEach((entity) => {
            var info = new ChatStatusInfo();
            info.CallerID = entity.CallerID;
            info.DialedID = entity.DialedID;
            info.DialedString = entity.DialedString;
            info.State = entity.XSessState;
            info.Status = entity.XSessStatus;
            info.Type = entity.XSessType;
            info.USessID = entity.USessID;
            info.CDNAddress = entity.CDNAddress;
            info.QueueAddress = entity.QueueAddress;
            if (entity.Campaign) {
                info.Campaign = new CampaignInfo();
                info.Campaign.Channels = entity.Campaign.Channels;
                info.Campaign.Code = entity.Campaign.Code;
                info.Campaign.DialMode = entity.Campaign.DialMode;
                info.Campaign.State = entity.Campaign.CampaignState;
                info.Campaign.Type = entity.Campaign.CampaignType;
            }
            if (entity.CurrAgent) {
                info.Agent = new AgentInfo();
                info.Agent.LoginId = entity.CurrAgent.LoginId;
                info.Agent.Name = entity.CurrAgent.Name;
                info.Agent.State = entity.CurrAgent.AgentState;
                info.Agent.Queues = [];
                entity?.CurrAgent?.Queues.forEach((queueInfo) => {
                    var queue = new QueueInfo();
                    queue.Channel = queueInfo.Channel;
                    queue.Code = queueInfo.Code;
                    queue.Name = queueInfo.Name;
                    queue.AgentState = queueInfo.Agents[info.Agent.LoginId].AgentState;
                    info.Agent.Queues.push(queue);
                });
                if (info.Agent.Queues?.length === 0)
                    delete info.Agent.Queues;
            }
            if (entity?.CurrAgent?.Terminals) {
                info.Terminals = [];
                for (const [key, value] of Object.entries(entity?.CurrAgent?.Terminals)) {
                    var _value = value;
                    if (value) {
                        var terminal = new TermialInfo();
                        terminal.Address = _value.Address;
                        terminal.Channel = _value.Channel;
                        terminal.State = _value.TerminalState;
                        terminal.XServer = _value.XServerCode;
                        info.Terminals.push(terminal);
                    }
                }
                if (info.Terminals?.length === 0)
                    delete info.Terminals;
            }
            infos.push(info);
        });
        return infos;
    }
    getEmailStatusObject(entities) {
        var infos = [];
        entities?.forEach((entity) => {
            var info = new EmailStatusInfo();
            info.CallerID = entity.CallerID;
            info.DialedID = entity.DialedID;
            info.DialedString = entity.DialedString;
            info.State = entity.XSessState;
            info.Status = entity.XSessStatus;
            info.Type = entity.XSessType;
            info.USessID = entity.USessID;
            info.CDNAddress = entity.CDNAddress;
            info.QueueAddress = entity.QueueAddress;
            if (entity.Campaign) {
                info.Campaign = new CampaignInfo();
                info.Campaign.Channels = entity.Campaign.Channels;
                info.Campaign.Code = entity.Campaign.Code;
                info.Campaign.DialMode = entity.Campaign.DialMode;
                info.Campaign.State = entity.Campaign.CampaignState;
                info.Campaign.Type = entity.Campaign.CampaignType;
            }
            if (entity.CurrAgent) {
                info.Agent = new AgentInfo();
                info.Agent.LoginId = entity.CurrAgent.LoginId;
                info.Agent.Name = entity.CurrAgent.Name;
                info.Agent.State = entity.CurrAgent.AgentState;
                info.Agent.Queues = [];
                entity?.CurrAgent?.Queues.forEach((queueInfo) => {
                    var queue = new QueueInfo();
                    queue.Channel = queueInfo.Channel;
                    queue.Code = queueInfo.Code;
                    queue.Name = queueInfo.Name;
                    queue.AgentState = queueInfo.Agents[info.Agent.LoginId].AgentState;
                    info.Agent.Queues.push(queue);
                });
                if (info.Agent.Queues?.length === 0)
                    delete info.Agent.Queues;
            }
            if (entity?.CurrAgent?.Terminals) {
                info.Terminals = [];
                for (const [key, value] of Object.entries(entity?.CurrAgent?.Terminals)) {
                    var _value = value;
                    if (value) {
                        var terminal = new TermialInfo();
                        terminal.Address = _value.Address;
                        terminal.Channel = _value.Channel;
                        terminal.State = _value.TerminalState;
                        terminal.XServer = _value.XServerCode;
                        info.Terminals.push(terminal);
                    }
                }
                if (info.Terminals?.length === 0)
                    delete info.Terminals;
            }
            infos.push(info);
        });
        return infos;
    }
    getQueueStatusObject(entities) {
        var infos = [];
        entities?.forEach((entity) => {
            var info = new QueueStatusInfo();
            info.Address = entity.Address;
            info.Channel = entity.Channel;
            info.Code = entity.Code;
            info.Name = entity.Name;
            if (entity.Campaign) {
                info.Campaign = new CampaignInfo();
                info.Campaign.Channels = entity.Campaign.Channels;
                info.Campaign.Code = entity.Campaign.Code;
                info.Campaign.DialMode = entity.Campaign.DialMode;
                info.Campaign.State = entity.Campaign.CampaignState;
                info.Campaign.Type = entity.Campaign.CampaignType;
            }
            info.Agents = [];
            entity?.Agents.forEach((agentInfo) => {
                var agent = new AgentInfo();
                agent.LoginId = agentInfo.LoginId;
                agent.Name = agentInfo.Name;
                agent.State = agentInfo.AgentState;
                info.Terminals = [];
                for (const [key, value] of Object.entries(agentInfo.Terminals)) {
                    var _value = value;
                    if (value) {
                        var terminal = new TermialInfo();
                        terminal.Address = _value.Address;
                        terminal.Channel = _value.Channel;
                        terminal.State = _value.TerminalState;
                        terminal.XServer = _value.XServerCode;
                        info.Terminals.push(terminal);
                    }
                }
                if (info.Terminals?.length === 0)
                    delete info.Terminals;
                info.Agents.push(agent);
            });
            infos.push(info);
        });
        return infos;
    }
    getKeyValueStringArray(entity) {
        var keyValueStringArray = [];
        for (const [key, value] of Object.entries(entity)) {
            if (typeof value === 'object' && !Array.isArray(value) && value !== null) {
                keyValueStringArray.push(`\n*_[${key}]_*`);
                var subArray = this.getKeyValueStringArray(value);
                keyValueStringArray = [...keyValueStringArray, ...subArray];
            }
            else if (Array.isArray(value) && value !== null && value?.length !== 0) {
                keyValueStringArray.push(`\n*_[${key}]_*`);
                value?.forEach((val, index) => {
                    if (typeof val === 'object' && !Array.isArray(val) && val !== null) {
                        if (index > 0 && index < value?.length)
                            keyValueStringArray.push(``);
                        var subArray = this.getKeyValueStringArray(val);
                        keyValueStringArray = [...keyValueStringArray, ...subArray];
                    }
                    else {
                        keyValueStringArray.push(`${val}`);
                    }
                });
            }
            else {
                if (key?.toLowerCase() !== 'id' &&
                    !key?.toLowerCase().includes('password') &&
                    value)
                    keyValueStringArray.push(`*${key}*: ${value}`);
            }
        }
        return keyValueStringArray;
    }
}
exports.RTController = RTController;
class CampaignStatusInfo {
    Id;
    Name;
    Code;
    State;
    Type;
    DialMode;
    Channels;
    Agents;
    Queues;
}
exports.CampaignStatusInfo = CampaignStatusInfo;
class AgentStatusInfo {
    State;
    LoginId;
    Name;
    Campaigns;
    Terminals;
    Queues;
}
exports.AgentStatusInfo = AgentStatusInfo;
class CallStatusInfo {
    State;
    Status;
    Type;
    CallerID;
    DialedID;
    DialedString;
    UCallID;
    Agent;
    Campaign;
    Terminals;
}
exports.CallStatusInfo = CallStatusInfo;
class ChatStatusInfo {
    CDNAddress;
    QueueAddress;
    CallerID;
    DialedID;
    DialedString;
    USessID;
    State;
    Status;
    Type;
    Agent;
    Campaign;
    Terminals;
}
exports.ChatStatusInfo = ChatStatusInfo;
class EmailStatusInfo {
    CDNAddress;
    QueueAddress;
    CallerID;
    DialedID;
    DialedString;
    USessID;
    State;
    Status;
    Type;
    Agent;
    Campaign;
    Terminals;
}
exports.EmailStatusInfo = EmailStatusInfo;
class QueueStatusInfo {
    Address;
    Channel;
    Code;
    Name;
    Campaign;
    Agents;
    Terminals;
}
exports.QueueStatusInfo = QueueStatusInfo;
class AgentInfo {
    LoginId;
    Name;
    State;
    Terminals;
    Queues;
}
exports.AgentInfo = AgentInfo;
class TermialInfo {
    Channel;
    Address;
    State;
    XServer;
}
exports.TermialInfo = TermialInfo;
class QueueInfo {
    Channel;
    Code;
    Name;
    AgentState;
}
exports.QueueInfo = QueueInfo;
class CampaignInfo {
    Code;
    State;
    Type;
    DialMode;
    Channels;
}
exports.CampaignInfo = CampaignInfo;
//# sourceMappingURL=rt.controller.js.map