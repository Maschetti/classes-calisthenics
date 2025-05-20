export class Password {
    private readonly hash: string;
    private static readonly MAX_LENGTH = 20;

    constructor(raw: string) {
        // 1. Sanitiza: trim + truncate
        const cleaned = Password.sanitize(raw);
        // 2. Valida o valor sanitizado
        const validationError = Password.validatePassword(cleaned);
        if (validationError) {
            throw new Error(validationError);
        }
        // 3. Gera e armazena o hash
        this.hash = Password.hashPlain(cleaned);
    }

    /**
     * Sanitiza a senha de entrada:
     * - remove espaços no início/fim
     * - trunca para MAX_LENGTH caracteres
     */
    public static sanitize(value: string): string {
        const trimmed = value.trim();
        return trimmed.slice(0, Password.MAX_LENGTH);
    }

    /**
     * Valida os critérios de complexidade na senha já sanitizada.
     * Retorna null se válido, ou mensagem de erro.
     */
    public static validatePassword(password: string): string | null {
        if (password.length < 8) {
            return 'Password must be at least 8 characters long';
        }
        if (password.length > Password.MAX_LENGTH) {
            return `Password must not exceed ${Password.MAX_LENGTH} characters`;
        }
        if (!/[A-Za-z]/.test(password)) {
            return 'Password must contain at least one letter';
        }
        if (!/\d/.test(password)) {
            return 'Password must contain at least one number';
        }
        if (!/[\W_]/.test(password)) {
            return 'Password must contain at least one symbol';
        }
        return null;
    }

    /**
     * Stub de hash: transforme em Base64
     * (em produção use bcrypt ou argon2)
     */
    private static hashPlain(s: string): string {
        return Buffer.from(s).toString('base64');
    }

    /** Retorna o hash para armazenar no banco */
    public getHash(): string {
        return this.hash;
    }

    /** Verifica se um texto “plain” corresponde ao hash informado */
    public static verify(plain: string, hashed: string): boolean {
        return Password.hashPlain(plain) === hashed;
    }
}