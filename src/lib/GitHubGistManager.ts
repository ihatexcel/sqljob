import { GistEncrypt } from './GistEncrypt'

        export class GitHubGistManager {
            static CLIENT_ID = ''; // À configurer par l'utilisateur
            static REDIRECT_URI = window.location.origin + window.location.pathname;
            static ACCESS_TOKEN_KEY = 'github_access_token';

            /**
             * Vérifie si un token d'accès est stocké
             */
            static hasAccessToken() {
                return !!localStorage.getItem(this.ACCESS_TOKEN_KEY);
            }

            /**
             * Récupère le token d'accès stocké
             */
            static getAccessToken() {
                return localStorage.getItem(this.ACCESS_TOKEN_KEY);
            }

            /**
             * Stocke le token d'accès
             */
            static setAccessToken(token) {
                localStorage.setItem(this.ACCESS_TOKEN_KEY, token);
            }

            /**
             * Supprime le token d'accès
             */
            static clearAccessToken() {
                localStorage.removeItem(this.ACCESS_TOKEN_KEY);
            }

            /**
             * Vérifie si nous revenons d'une authentification GitHub
             * et extrait le code d'autorisation
             */
            static checkAuthCallback() {
                const urlParams = new URLSearchParams(window.location.search);
                const code = urlParams.get('code');
                const state = urlParams.get('state');

                if (code && state === 'github_gist_auth') {
                    // Nettoyer l'URL
                    window.history.replaceState({}, document.title, window.location.pathname);
                    return code;
                }
                return null;
            }

            /**
             * Redirige vers GitHub pour l'authentification OAuth
             */
            static initiateAuth() {
                if (!this.CLIENT_ID) {
                    throw new Error('GitHub Client ID non configuré. Veuillez configurer CLIENT_ID dans GitHubGistManager.');
                }

                const authUrl = new URL('https://github.com/login/oauth/authorize');
                authUrl.searchParams.set('client_id', this.CLIENT_ID);
                authUrl.searchParams.set('redirect_uri', this.REDIRECT_URI);
                authUrl.searchParams.set('scope', 'gist');
                authUrl.searchParams.set('state', 'github_gist_auth');

                window.location.href = authUrl.toString();
            }

            /**
             * Échange le code d'autorisation contre un token d'accès
             * Note: Cela nécessite un backend proxy car GitHub ne permet pas CORS
             * Pour une solution client-only, on peut utiliser le Device Flow ou demander à l'utilisateur
             * de créer un Personal Access Token
             */
            static async exchangeCodeForToken(code) {
                // Cette méthode nécessiterait un backend proxy
                // Pour l'instant, nous utiliserons une approche avec Personal Access Token
                throw new Error('Exchange code nécessite un backend proxy. Utilisez setAccessToken() avec un Personal Access Token.');
            }

            /**
             * Crée un gist avec la configuration
             * @param {Object} config - Configuration à partager
             * @param {string} description - Description du gist
             * @param {string} fileName - Nom du fichier JSON (par défaut: notebook-config.json)
             * @param {string} [passphrase] - Passphrase pour chiffrer (optionnel). Si fourni, la config et datachunks sont chiffrés.
             * @returns {Promise<string>} URL du gist créé
             */
            static async createGist(config, description = 'sqljob Notebook Configuration', fileName = 'gistconfig.sqljob.json', passphrase = null) {
                const token = this.getAccessToken();
                if (!token) {
                    throw new Error('Non authentifié. Veuillez configurer un Personal Access Token.');
                }

                let contentToUpload;
                if (passphrase && passphrase.trim()) {
                    const jsonString = JSON.stringify(config);
                    const encrypted = await GistEncrypt.encrypt(jsonString, passphrase.trim());
                    encrypted.createdAt = config.createdAt || new Date().toISOString();
                    contentToUpload = JSON.stringify(encrypted);
                } else {
                    contentToUpload = JSON.stringify(config);
                }

                // S'assurer que le nom de fichier a l'extension .json
                const finalFileName = fileName.endsWith('.json') ? fileName : `${fileName}.json`;

                const gistData = {
                    description: description,
                    public: false,
                    files: {
                        [finalFileName]: {
                            content: contentToUpload
                        }
                    }
                };

                try {
                    const response = await fetch('https://api.github.com/gists', {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Accept': 'application/vnd.github+json',
                            'Content-Type': 'application/json',
                            'X-GitHub-Api-Version': '2022-11-28'
                        },
                        body: JSON.stringify(gistData)
                    });

                    if (!response.ok) {
                        const error = await response.json();
                        throw new Error(error.message || 'Erreur lors de la création du gist');
                    }

                    const result = await response.json();
                    return result.html_url;
                } catch (error) {
                    console.error('Erreur création gist:', error);
                    throw error;
                }
            }

            /**
             * Génère une URL sqljob avec le gist (sans passphrase dans l'URL pour des raisons de sécurité)
             * @param {string} gistUrl - URL du gist GitHub
             * @returns {string} URL sqljob avec le paramètre gist
             */
            static generateSqljobUrl(gistUrl) {
                const gistId = gistUrl.match(/gist\.github\.com\/[^\/]+\/([a-f0-9]{32})/i)?.[1];
                if (!gistId) {
                    throw new Error('URL de gist invalide');
                }

                /*const baseUrl = window.location.origin + window.location.pathname;*/
                const baseUrl = 'https://ihatexcel.github.io/sqljob/';
                return `${baseUrl}?gist=${gistId}`;
            }
        }
