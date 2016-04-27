import ExtendableError from 'es6-error'

export class ApiError extends ExtendableError {
  constructor (message, code) {
    super(`[${code}] ${message}`)
    this.code = code
  }

  async getCode () {
    try {
      const json = await this.response.json()
      return json.code || 'network'
    } catch (err) {
      console.error('Cannot decode JSON error:', err.stack)
      return 'network'
    }
  }
}

class ApiClient {

  get (url) {
    return this.do(url, {
      credentials: 'same-origin',
      headers: {
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + global.localStorage.accessToken
      }
    })
  }

  post (url, body) {
    return this.do(url, {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json; charset=UTF-8',
        'Authorization': 'Bearer ' + global.localStorage.accessToken
      },
      body: JSON.stringify(body)
    })
  }

  postFiles (url, body, files) {
    const formData = new FormData()
    formData.append('json', JSON.stringify(body))
    for (let key of Object.keys(files)) {
      formData.append(key, files[key])
    }

    return this.do(url, {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'Accept': 'application/json'
      },
      body: formData
    })
  }

  async do (url, opt) {
    try {
      const response = await fetch('/api' + url, opt)
      if (!response.ok) {
        const json = await response.json()
        const code = json.code || 'network'
        const message = json.error || 'Network error'
        throw new ApiError(message, code)
      }
      return await response.json()
    } catch (err) {
      if (err instanceof ApiError) throw err
      throw new ApiError('Network error', 'network')
    }
  }

}

export default new ApiClient()
