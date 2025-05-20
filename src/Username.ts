export class Username {
    private readonly value: string;
    private static readonly MAX_LENGTH = 16;

    constructor(raw: string) {
        // 1. Sanitiza a entrada
        const cleaned = Username.sanitize(raw);
        // 2. Valida o valor sanitizado
        const error = Username.validate(cleaned);
        if (error) {
            throw new Error(error);
        }
        // 3. Armazena o username definitivo
        this.value = cleaned;
    }

    /**
     * Sanitiza um nome de usuário:
     * - remove espaços em branco
     * - remove tudo que não for letra ou número
     * - converte para minúsculas (opcional)
     * - trunca para MAX_LENGTH
     */
    public static sanitize(value: string): string {
        const trimmed = value.trim();
        const alnumOnly = trimmed.replace(/[^a-zA-Z0-9]/g, '');
        // converte para minúsculas, se desejar:
        const lower = alnumOnly.toLowerCase();
        return lower.slice(0, Username.MAX_LENGTH);
    }

    /**
     * Valida o username já sanitizado:
     * - comprimento entre 3 e MAX_LENGTH
     * - só letras e números (já garantido no sanitize)
     *
     * Retorna null se válido, ou mensagem de erro.
     */
    public static validate(username: string): string | null {
        if (username.length < 3) {
            return 'Username must be at least 3 characters long';
        }
        if (username.length > Username.MAX_LENGTH) {
            return `Username must not exceed ${Username.MAX_LENGTH} characters`;
        }
        // regex aqui é redundante pois sanitize já removeu outros chars
        if (!/^[a-z0-9]+$/.test(username)) {
            return 'Username can only contain letters and numbers';
        }
        return null;
    }

    /** Retorna o username válido e sanitizado */
    public get(): string {
        return this.value;
    }

    public static mask(value: string) {
        return Username.sanitize(value);
    }
}