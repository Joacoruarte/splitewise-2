import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

/**
 * Carga un archivo .env y devuelve un objeto con las variables (sin modificar process.env)
 */
export function loadEnvFile(fileName: string): Record<string, string> {
  const filePath = path.resolve(process.cwd(), fileName);

  if (!fs.existsSync(filePath)) {
    throw new Error(`Archivo .env no encontrado: ${filePath}`);
  }

  const envConfig = dotenv.parse(fs.readFileSync(filePath));

  return envConfig;
}
