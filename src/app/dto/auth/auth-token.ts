export interface AuthToken {
  tokenValue: string,
  issuedAt: string,
  expiresAt: string,
  tokenType: {value: string},
  scopes: string[]
}
