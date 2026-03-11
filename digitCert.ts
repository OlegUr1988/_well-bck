export function getCertPath(): string {
  return process.env.CERT_PATH || "";
}

export function getCertPassword(): string {
  return process.env.CERT_PASSWORD || "";
}