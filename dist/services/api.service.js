"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.APIService = void 0;
class APIService {
    common;
    /**
     * COMMON VARIABLES
     */
    uploader;
    /**
     * CONSTRUCTOR
     * @param common
     */
    constructor(common) {
        this.common = common;
    }
    /**
     * INITIATES ROUTES
     * @param router
     */
    intializeAPIs(router) {
        router.post('/api/log', (request, response) => {
            this.common.requestProcessor.processLogRequest(request, response);
        });
    }
    /**
     * INITIATES WEBHOOKS
     * @param router
     */
    intializeWebHooks(router) {
        router.post('/', (request, response) => {
            response.send(`<pre>Nothing to see here. Checkout README.md to start.</pre>`);
        });
        router.post('/webhook', (request, response) => {
            this.common.requestProcessor.processGraphApiPostWebHook(request, response);
        });
        router.get('/webhook', (request, response) => {
            this.common.requestProcessor.processGraphApiGetWebHook(request, response);
        });
        router.post('/api/log', (request, response) => {
            this.common.requestProcessor.processLogRequest(request, response);
        });
    }
}
exports.APIService = APIService;
//# sourceMappingURL=api.service.js.map