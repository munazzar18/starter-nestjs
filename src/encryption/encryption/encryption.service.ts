import { Injectable } from '@nestjs/common';
import { createCipheriv, createDecipheriv, randomBytes, scrypt } from 'crypto';
import { promisify } from 'util';

@Injectable()
export class EncryptionService {
    async encrypt(textToEncrypt: string): Promise<string> {
        const iv = randomBytes(16);
        const password = process.env.ENCRYPTED_KEY

        // The key length is dependent on the algorithm.
        // In this case for aes256, it is 32 bytes.
        const key = (await promisify(scrypt)(password, 'salt', 32)) as Buffer;
        const cipher = createCipheriv('aes-256-ctr', key, iv);

        const encryptedText = Buffer.concat([
            cipher.update(textToEncrypt),
            cipher.final(),
        ]);

        const result = Buffer.concat([iv, encryptedText]);
        // Use URL-safe base64 encoding
        return result.toString('base64url');
    }

    async decrypt(encryptedText: string) {
        const password = process.env.ENCRYPTED_KEY
        // Use URL-safe base64 decoding
        const encryptedBuffer = Buffer.from(encryptedText, 'base64url');

        const iv = encryptedBuffer.slice(0, 16);
        const encryptedText2 = encryptedBuffer.slice(16);

        const key = (await promisify(scrypt)(password, 'salt', 32)) as Buffer;
        const decipher = createDecipheriv('aes-256-ctr', key, iv);
        const decryptedText = Buffer.concat([
            decipher.update(encryptedText2),
            decipher.final(),
        ]);
        return decryptedText.toString('utf-8');
    }
}
