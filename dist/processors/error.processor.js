"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorProcessor = void 0;
class ErrorProcessor {
    constructor() { }
    processError(errorResponse) {
        if (errorResponse?.Message)
            return errorResponse?.Message;
        if (errorResponse?.Cause)
            return this.processErrorCause(errorResponse?.Cause);
        if (errorResponse?.EvCause)
            return this.processEvCause(errorResponse?.EvCause);
        return '';
    }
    processErrorCause(errorCause) {
        switch (errorCause) {
            case 'CTClientAlreadyStarted':
                return `Tenant is already running`;
            default:
                return errorCause;
        }
    }
    processEvCause(evCause) {
        switch (evCause) {
            default:
                return evCause;
        }
    }
}
exports.ErrorProcessor = ErrorProcessor;
//# sourceMappingURL=error.processor.js.map