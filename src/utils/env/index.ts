export type Env = 'dev' | 'test' | 'prod';

export function getEnv(): Env {
	return import.meta.env.VITE_ENV as Env;
}
