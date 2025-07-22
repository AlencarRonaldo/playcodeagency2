import crypto from 'crypto';

interface TokenData {
  customerId: string;
  email: string;
  projectType: string;
  createdAt: number;
  expiresAt: number;
}

export class SecureTokenManager {
  private readonly secretKey: string;
  private readonly algorithm = 'sha256';

  constructor() {
    this.secretKey = process.env.TOKEN_SECRET_KEY || 'default-secret-key-change-in-production';
    
    if (this.secretKey === 'default-secret-key-change-in-production') {
      console.warn('⚠️ Usando chave secreta padrão. Configure TOKEN_SECRET_KEY em produção!');
    }
  }

  /**
   * Gera token seguro com dados embarcados
   */
  generateToken(data: Omit<TokenData, 'createdAt' | 'expiresAt'>): string {
    const now = Date.now();
    const tokenData: TokenData = {
      ...data,
      createdAt: now,
      expiresAt: now + (7 * 24 * 60 * 60 * 1000) // 7 dias
    };

    // Serializar dados
    const dataString = JSON.stringify(tokenData);
    const dataBuffer = Buffer.from(dataString, 'utf8');
    const dataB64 = dataBuffer.toString('base64url');

    // Gerar HMAC
    const hmac = crypto.createHmac(this.algorithm, this.secretKey);
    hmac.update(dataB64);
    const signature = hmac.digest('base64url');

    // Token final: dados.assinatura
    return `${dataB64}.${signature}`;
  }

  /**
   * Valida e decodifica token
   */
  validateToken(token: string): { valid: boolean; data?: TokenData; error?: string } {
    try {
      const [dataB64, signature] = token.split('.');
      
      if (!dataB64 || !signature) {
        return { valid: false, error: 'Formato de token inválido' };
      }

      // Verificar assinatura
      const hmac = crypto.createHmac(this.algorithm, this.secretKey);
      hmac.update(dataB64);
      const expectedSignature = hmac.digest('base64url');

      if (signature !== expectedSignature) {
        return { valid: false, error: 'Token inválido ou adulterado' };
      }

      // Decodificar dados
      const dataBuffer = Buffer.from(dataB64, 'base64url');
      const dataString = dataBuffer.toString('utf8');
      const data: TokenData = JSON.parse(dataString);

      // Verificar expiração
      if (Date.now() > data.expiresAt) {
        return { valid: false, error: 'Token expirado' };
      }

      return { valid: true, data };
    } catch (error) {
      return { valid: false, error: 'Erro ao processar token' };
    }
  }

  /**
   * Verifica se token ainda é válido (sem decodificar)
   */
  isTokenValid(token: string): boolean {
    return this.validateToken(token).valid;
  }

  /**
   * Gera hash único do customer para identificação
   */
  generateCustomerId(email: string): string {
    return crypto.createHash('sha256').update(email.toLowerCase()).digest('hex').substr(0, 12);
  }
}

export const tokenManager = new SecureTokenManager();