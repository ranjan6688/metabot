import { CCClient, HttpResultType } from "./../services/cc.service";
import { CommonService } from "./../services/common.service";
import { TenantInfo } from "./tenant.controller";

export class CCController{
    
    constructor(private common: CommonService){}

    private async getCCClient(tenantCode: any): Promise<CCClient | undefined>{

        var result: any = await this.common.ccSvc.register();
        if(result?.ResultType === HttpResultType.Success){

            var sessionId = result?.Response?.SessionId;

            result = await this.common.tenantController.fetchTenantDefaultAdmin(sessionId, tenantCode);
            var tenantInfo: TenantInfo = result && result[0];
            if(!tenantInfo){
                this.common.logger.error(`No tenant found!`);
            }else{
                var client: CCClient = new CCClient();
                client.ApplicationCode = `Atomos`;
                client.ClientCode = tenantCode;
                client.Username = tenantInfo.DefaultAdmin.LoginId;
                client.Password = tenantInfo.DefaultAdmin.Password;

                await this.common.ccSvc.logout(sessionId);
                return client;
            }
            
        }else{
            this.common.logger.error(result.Exception);
        }

        await this.common.ccSvc.logout(sessionId);
        return undefined;
    }

    async callBargeIn(tenantCode: any, entity: any, toAddress: any): Promise<boolean>{

        var client: CCClient = await this.getCCClient(tenantCode);
        if(client){

            var result = await this.common.ccSvc.register();
            if(result?.ResultType === HttpResultType.Success){
    
                var sessionId = result?.Response?.SessionId;
                
                result = await this.common.ccSvc.login(sessionId, client);
                if(result?.ResultType === HttpResultType.Success){
                    
                    result = await this.common.ccSvc.callBargeIn(sessionId, entity, toAddress);
                    if(result?.ResultType === HttpResultType.Success){
                        return true;
                    }else{
                        this.common.logger.error(result.Exception);
                    }
                }else{
                    this.common.logger.error(result.Exception);
                }
            }else{
                this.common.logger.error(result.Exception);
            }
    
            // await this.common.ccSvc.logout(sessionId);
        }

        return false;
    }
}