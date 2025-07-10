import { config } from '../config'

const API_BASE_URL = config.api.baseUrl

export const api = {
  async request(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE_URL}${endpoint}`
    
    const defaultHeaders = {
      'Content-Type': 'application/json',
      ...options.headers
    }

    const config: RequestInit = {
      ...options,
      headers: defaultHeaders
    }

    try {
      const response = await fetch(url, config)
      
      if (!response.ok) {
        console.error('Resposta não OK:', response.status, response.statusText)
      }
      
      let data
      try {
        data = await response.json()
      } catch (jsonError) {
        // Se não conseguir fazer parse do JSON, retorna um objeto com a mensagem de erro
        console.error('Erro ao fazer parse do JSON:', jsonError)
        data = {
          message: `Erro no servidor: ${response.status} ${response.statusText}`,
          error: 'Invalid JSON response'
        }
      }
      
      return {
        ok: response.ok,
        status: response.status,
        data
      }
    } catch (error) {
      console.error('API Error:', error)
      if (error instanceof Error) {
        console.error('Detalhes do erro:', {
          message: error.message,
          name: error.name,
          stack: error.stack
        })
      }
      throw error
    }
  },

  // Métodos específicos
  async post(endpoint: string, body: any, token?: string) {
    const headers: Record<string, string> = {}
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    return this.request(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify(body)
    })
  },


  async put(endpoint: string, body: any, token?: string) {
    const headers: Record<string, string> = {}
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    return this.request(endpoint, {
      method: 'PUT',
      headers,
      body: JSON.stringify(body)
    })
  }
} 