import * as crypto from "crypto";
import * as CryptoJS from 'crypto-js';

export class CipherService {

    /**
     * COMMON VARIABLES
     */
    private algorithm: string = 'aes-256-cbc';
    // private key: any = crypto.randomBytes(32);
    // private iv: any = crypto.randomBytes(16);
    private key: any = `f4a643800c1c1b21371dea5926e9af24ba12c424460ef374e3d0055f05e938be`;
    private iv: any = `aaa82fc0c8e950500195e64a1e53efbb`;

    /**
     * CONSTRUCTOR
     */
    constructor() { }

    /**
     * ENCRYPTS THE TEXT
     * @param text 
     * @returns 
     */
    private encrypt(text: string) {
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
    private decrypt(text: string) {
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
    private readonly AES_CHIPER_KEY = 'c4257a45-dc4d-4fbc-8052-c24f4768b8ca';
  
    AESencrypt(value: string, isUri: boolean = false): string {
      if(isUri === true)
        return encodeURIComponent(CryptoJS.AES.encrypt(value, this.AES_CHIPER_KEY.trim()).toString());
      
      return CryptoJS.AES.encrypt(value, this.AES_CHIPER_KEY.trim()).toString();
    }
  
    AESdecrypt(textToDecrypt: string, isUri: boolean = false) {
      if(isUri === true)
        return decodeURIComponent(CryptoJS.AES.encrypt(textToDecrypt, this.AES_CHIPER_KEY.trim()).toString());

      return CryptoJS.AES.decrypt(textToDecrypt, this.AES_CHIPER_KEY.trim()).toString(CryptoJS.enc.Utf8);
    }
}