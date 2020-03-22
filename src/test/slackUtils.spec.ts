import { createResponse, parseSlackCommand, SlackPost, SlackResponse } from '../slackUtils'

test('should parse query string coming from Slack correctly', () => {
  const qs = 'some=thing&command=/sauna&text=77&stuff=here'
  const slackPost: SlackPost = parseSlackCommand(qs)
  expect(slackPost.command).toEqual('/sauna')
  expect(slackPost.value).toEqual('77')
})

test('should create SlackReply correctly if everything went fine', () => {
  const status = 200
  const slackResponse: SlackResponse = createResponse(status, '/sauna', '50')
  expect(slackResponse.statusCode).toBe(status)
  expect(slackResponse.body).toMatch('Selvä juttu')
})

test('should create SlackRepl correctly if there was an error', () => {
  const status = 500
  const slackResponse: SlackResponse = createResponse(status, undefined, undefined, 'Error!')
  expect(slackResponse.statusCode).toBe(status)
  expect(slackResponse.body).toMatch('Error!')
})
