export class Email {
    private static readonly MAX_LENGTH = 254;    // Limite técnico de RFC
    private readonly value: string;              // E-mail já sanitizado e validado

    constructor(address: string) {
        // 1. Sanitiza o valor cru
        const sanitized = Email.sanitize(address);
        // 2. Valida o valor sanitizado
        const error = Email.validateEmail(sanitized);
        if (error) {
            throw new Error(error);
        }
        // 3. Armazena
        this.value = sanitized;
    }

    /**
     * Sanitiza um e-mail:
     * - remove espaços e converte para lowercase
     * - mantém só o primeiro "@"
     * - limita comprimento a MAX_LENGTH
     * - remove caracteres fora de [a-z0-9@._-+]
     */
    public static sanitize(value: string): string {
        // Remove espaços e passa para minúsculas
        const spacesRemoved = value.replace(/\s/g, '').toLowerCase();

        // Se houver mais de um "@", mantém só o primeiro
        const parts = spacesRemoved.split('@');
        const singleAt =
            parts.length <= 2
                ? spacesRemoved
                : `${parts[0]}@${parts.slice(1).join('')}`;

        // Limita o tamanho
        const lengthLimited =
            singleAt.length > Email.MAX_LENGTH
                ? singleAt.slice(0, Email.MAX_LENGTH)
                : singleAt;

        // Remove caracteres inválidos
        return lengthLimited.replace(/[^a-z0-9@._\-+]/g, '');
    }

    /**
     * Valida um e-mail já sanitizado:
     * - não vazio
     * - não excede MAX_LENGTH
     * - corresponde à regex básica
     * Retorna null se válido, ou string de erro caso contrário.
     */
    private static validateEmail(address: string): string | null {
        if (address.length === 0) {
            return 'Email must not be empty';
        }
        if (address.length > Email.MAX_LENGTH) {
            return `Email must not exceed ${Email.MAX_LENGTH} characters`;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(address)) {
            return 'Invalid email address format';
        }
        return null;
    }

    /** Retorna somente o domínio (parte após "@") */
    public getDomain(): string {
        return this.value.split('@')[1];
    }

    /** Retorna o e-mail completo */
    public get(): string {
        return this.value;
    }

    public static mask(value: string): string {
    return Email.sanitize(value);
  }
}