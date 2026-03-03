// @ts-nocheck

        export class GistEncrypt {
            static ENCRYPTED_MARKER = '_encrypted';
            static DEFAULT_ITERATIONS = 600000;

            static _uint8ArrayToBase64(arr) {
                // Chunked conversion: String.fromCharCode(...arr) dépasse la limite d'arguments (~65k)
                const CHUNK = 0x8000;
                let s = '';
                for (let i = 0; i < arr.length; i += CHUNK) {
                    const chunk = arr.subarray(i, Math.min(i + CHUNK, arr.length));
                    s += String.fromCharCode.apply(null, chunk);
                }
                return btoa(s);
            }
            static _base64ToUint8Array(base64) {
                const raw = atob(base64);
                const arr = new Uint8Array(raw.length);
                for (let i = 0; i < raw.length; i++) arr[i] = raw.charCodeAt(i);
                return arr;
            }

            /** Génère une passphrase aléatoire (32 caractères hex, type 68cd597ba5da05ceba24fb975c05384f) */
            static generatePassphrase() {
                const bytes = new Uint8Array(16);
                crypto.getRandomValues(bytes);
                return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
            }

            /** Dérive une clé AES depuis la passphrase */
            static async deriveKey(passphrase, salt, iterations = this.DEFAULT_ITERATIONS) {
                const enc = new TextEncoder();
                const keyMaterial = await crypto.subtle.importKey('raw', enc.encode(passphrase), 'PBKDF2', false, ['deriveBits', 'deriveKey']);
                return crypto.subtle.deriveKey(
                    { name: 'PBKDF2', salt, iterations, hash: 'SHA-256' },
                    keyMaterial,
                    { name: 'AES-GCM', length: 256 },
                    false,
                    ['encrypt', 'decrypt']
                );
            }

            /**
             * Chiffre une chaîne JSON. Format versionnable et auto-documenté :
             * { _encrypted, kdf, iterations, salt, iv, ciphertext }
             */
            static async encrypt(plaintext, passphrase) {
                const salt = crypto.getRandomValues(new Uint8Array(16));
                const iv = crypto.getRandomValues(new Uint8Array(12));
                const key = await this.deriveKey(passphrase, salt);
                const enc = new TextEncoder();
                const ciphertext = await crypto.subtle.encrypt(
                    { name: 'AES-GCM', iv },
                    key,
                    enc.encode(plaintext)
                );
                return {
                    [this.ENCRYPTED_MARKER]: true,
                    kdf: 'PBKDF2',
                    iterations: this.DEFAULT_ITERATIONS,
                    salt: this._uint8ArrayToBase64(salt),
                    iv: this._uint8ArrayToBase64(iv),
                    ciphertext: this._uint8ArrayToBase64(new Uint8Array(ciphertext))
                };
            }

            /**
             * Déchiffre. Format attendu: { _encrypted, kdf, iterations, salt, iv, ciphertext }
             */
            static async decrypt(encryptedObj, passphrase) {
                if (!encryptedObj || !encryptedObj[this.ENCRYPTED_MARKER] || !encryptedObj.ciphertext || !encryptedObj.salt || encryptedObj.iv === undefined) {
                    throw new Error('Contenu non chiffré ou format invalide');
                }

                const salt = this._base64ToUint8Array(encryptedObj.salt);
                const iv = this._base64ToUint8Array(encryptedObj.iv);
                const ciphertext = this._base64ToUint8Array(encryptedObj.ciphertext);
                const iterations = encryptedObj.iterations || this.DEFAULT_ITERATIONS;

                const key = await this.deriveKey(passphrase, salt, iterations);
                const decrypted = await crypto.subtle.decrypt(
                    { name: 'AES-GCM', iv },
                    key,
                    ciphertext
                );
                return new TextDecoder().decode(decrypted);
            }

            static isEncrypted(obj) {
                return obj && obj[this.ENCRYPTED_MARKER] === true && !!obj.ciphertext && !!obj.salt && obj.iv !== undefined;
            }
        }
