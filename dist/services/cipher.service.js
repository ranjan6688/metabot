"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CipherService = void 0;
const crypto = __importStar(require("crypto"));
const CryptoJS = __importStar(require("crypto-js"));
class CipherService {
    /**
     * COMMON VARIABLES
     */
    algorithm = 'aes-256-cbc';
    // private key: any = crypto.randomBytes(32);
    // private iv: any = crypto.randomBytes(16);
    key = `f4a643800c1c1b21371dea5926e9af24ba12c424460ef374e3d0055f05e938be`;
    iv = `aaa82fc0c8e950500195e64a1e53efbb`;
    /**
     * CONSTRUCTOR
     */
    constructor() { }
    /**
     * ENCRYPTS THE TEXT
     * @param text
     * @returns
     */
    encrypt(text) {
        let cipher = crypto.createCipheriv(this.algorithm, Buffer.from(this.key, 'hex'), Buffer.from(this.iv, 'hex'));
        let encrypted = cipher.update(text);
        encrypted = Buffer.concat([encrypted, cipher.final()]);
        return encrypted.toString('hex');
    }
    /**
     * DECRYPTS THE TEXT
     * @param text
     * @returns
     */
    decrypt(text) {
        let iv = Buffer.from(this.iv, 'hex');
        let encryptedText = Buffer.from(text, 'hex');
        let decipher = crypto.createDecipheriv(this.algorithm, Buffer.from(this.key, 'hex'), iv);
        let decrypted = decipher.update(encryptedText);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        return decrypted.toString();
    }
    /**
    * Final CIPHER KEY
    */
    AES_CHIPER_KEY = 'c4257a45-dc4d-4fbc-8052-c24f4768b8ca';
    AESencrypt(value, isUri = false) {
        if (isUri === true)
            return encodeURIComponent(CryptoJS.AES.encrypt(value, this.AES_CHIPER_KEY.trim()).toString());
        return CryptoJS.AES.encrypt(value, this.AES_CHIPER_KEY.trim()).toString();
    }
    AESdecrypt(textToDecrypt, isUri = false) {
        if (isUri === true)
            return decodeURIComponent(CryptoJS.AES.encrypt(textToDecrypt, this.AES_CHIPER_KEY.trim()).toString());
        return CryptoJS.AES.decrypt(textToDecrypt, this.AES_CHIPER_KEY.trim()).toString(CryptoJS.enc.Utf8);
    }
}
exports.CipherService = CipherService;
//# sourceMappingURL=cipher.service.js.map