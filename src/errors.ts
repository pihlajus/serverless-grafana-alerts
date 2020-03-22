import { createResponse, SlackResponse } from './slackUtils'

export class AlertError extends Error {
  httpStatusCode: number
  constructor(message?: string, status?: number) {
    super(message) // 'Error' breaks prototype chain here
    this.name = 'AlertError'
    this.httpStatusCode = status
    Object.setPrototypeOf(this, new.target.prototype) // restore prototype chain
  }
}

export const handleError = (error: AlertError): SlackResponse => {
  return createResponse(error.httpStatusCode, undefined, undefined, error.message)
}
