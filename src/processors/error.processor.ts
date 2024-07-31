export class ErrorProcessor{

    constructor(){}

    processError(errorResponse: any){
        if(errorResponse?.Message)
            return errorResponse?.Message;

        if(errorResponse?.Cause)
            return this.processErrorCause(errorResponse?.Cause);

        if(errorResponse?.EvCause)
            return this.processEvCause(errorResponse?.EvCause);

        return '';
    }

    private processErrorCause(errorCause: any){
        switch(errorCause){
            case 'CTClientAlreadyStarted':
                return `Tenant is already running`;
            default:
                return errorCause;
        }
    }

    private processEvCause(evCause: any){
        switch(evCause){
            default:
                return evCause;
        }
    }
}