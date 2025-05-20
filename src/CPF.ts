export class CPF {
	private readonly value: string;  // Guarda os 11 dígitos já validados

	constructor(cpf: string) {
		// 1. Sanitiza a entrada (remove não-dígitos e limita a 11 caracteres)
		const cleaned = CPF.sanitize(cpf);
		// 2. Valida o CPF sanitizado
		const error = CPF.validate(cleaned);
		if (error) {
			throw new Error(error);
		}
		// 3. Armazena o valor “puro”
		this.value = cleaned;
	}

	/** Retorna o CPF formatado completo “000.000.000-00” */
	public get(): string {
		return this.value.replace(
			/(\d{3})(\d{3})(\d{3})(\d{2})/,
			'$1.$2.$3-$4'
		);
	}

	/**
	 * Sanitiza qualquer string:
	 *  - Remove tudo que não for dígito
	 *  - Trunca para até 11 caracteres
	 */
	public static sanitize(value: string): string {
		return value
			.replace(/\D/g, '')   // tira não-dígitos
			.slice(0, 11);        // máximo 11 dígitos
	}

	/**
	 * Valida um CPF “puro” (deve ter sido pré-sanitizado):
	 *  - Deve ter exatamente 11 dígitos
	 *  - Não pode ser sequência de dígito repetido
	 *  - Dígitos verificadores devem bater
	 * Retorna null se válido, ou string de erro.
	 */
	public static validate(cpf: string): string | null {
		if (cpf.length !== 11) {
			return 'CPF must have 11 digits';
		}
		if (!/^[0-9]{11}$/.test(cpf)) {
			return 'CPF must contain only numbers';
		}
		if (/^(\d)\1{10}$/.test(cpf)) {
			return 'CPF cannot be a sequence of the same digit';
		}

		// cálculo dos dígitos verificadores
		const calc = (len: number): number => {
			const slice = cpf.slice(0, len);
			const sum = slice
				.split('')
				.map((d, i) => parseInt(d, 10) * (len + 1 - i))
				.reduce((a, b) => a + b, 0);
			const rem = (sum * 10) % 11;
			return rem === 10 ? 0 : rem;
		};

		if (calc(9) !== parseInt(cpf[9], 10) ||
			calc(10) !== parseInt(cpf[10], 10)) {
			return 'Invalid CPF check digits';
		}

		return null;
	}

	/**
	 * Máscara dinâmica para usar em um input:
	 *  - Chama sanitize
	 *  - Formata “123.456.789-01” mesmo que ainda incompleto
	 */
	public static mask(value: string): string {
		const digits = CPF.sanitize(value);
		// aplica pontos e traço conforme o tamanho atual
		return digits
			.replace(/(\d{3})(\d)/, '$1.$2')
			.replace(/(\d{3})(\d)/, '$1.$2')
			.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
	}
}