"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CCController = void 0;
const cc_service_1 = require("./../services/cc.service");
class CCController {
    common;
    constructor(common) {
        this.common = common;
    }
    async getCCClient(tenantCode) {
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
    async callBargeIn(tenantCode, entity, toAddress) {
        var client = await this.getCCClient(tenantCode);
        if (client) {
            var result = await this.common.ccSvc.register();
            if (result?.ResultType === cc_service_1.HttpResultType.Success) {
                var sessionId = result?.Response?.SessionId;
                result = await this.common.ccSvc.login(sessionId, client);
                if (result?.ResultType === cc_service_1.HttpResultType.Success) {
                    result = await this.common.ccSvc.callBargeIn(sessionId, entity, toAddress);
                    if (result?.ResultType === cc_service_1.HttpResultType.Success) {
                        return true;
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
        }
        return false;
    }
}
exports.CCController = CCController;
//# sourceMappingURL=cc.controller.js.map