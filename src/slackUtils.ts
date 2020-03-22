import * as queryString from 'querystring'
import * as crypto from 'crypto'
import { ALERT_ENTITIES, AlertEntity } from './constants'

export class SlackPost {
  command: string
  value: string
  constructor(command: string, value: string) {
    this.command = command
    this.value = value;
  }
}

export interface SlackResponse {
  statusCode: number
  body: string
}

export const createResponse = (httpStatusCode: number, slackCommand?: string, alertValue?: string, error?: string): SlackResponse => {
  const entity: AlertEntity = ALERT_ENTITIES.find(entity => entity.slackCommand === slackCommand)
  const msg = alertValue ? entity.slackBotReply + alertValue : error
  return {
    statusCode: httpStatusCode,
    body: JSON.stringify({
      response_type: 'ephemeral', // Reply is only shown to message sender
      text: msg,
    }),
  }
}

export const parseSlackCommand = postBody => {
  const parsedBody = queryString.parse(postBody.toString())
  return new SlackPost(parsedBody.command as string, parsedBody.text as string)
}

const verifySlackSignature = (event): boolean => {
  const rawString = `v0:${event.headers['X-Slack-Request-Timestamp']}:${event.body}`
  const hmac = crypto.createHmac('sha256', process.env['SLACK_SIGNING_SECRET'])
  return `v0=${hmac.update(rawString).digest('hex')}` === event.headers['X-Slack-Signature']
}

export const isAuthorized = (event): boolean => {
  if (process.env.IS_OFFLINE) {
    return true
  } else {
    return verifySlackSignature(event)
  }
}
