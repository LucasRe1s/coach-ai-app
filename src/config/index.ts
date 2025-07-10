export const config = {
  api: {
    baseUrl: import.meta.env.VITE_API_URL || '/api',
    timeout: 10000
  },
  app: {
    name: 'Coach AI',
    version: '1.0.0'
  },
  auth: {
    tokenKey: 'token',
    refreshTokenKey: 'refreshToken'
  }
} 