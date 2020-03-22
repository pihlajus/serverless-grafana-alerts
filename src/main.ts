import { APIGatewayProxyHandler } from 'aws-lambda'
import 'source-map-support/register'
import { createDashboard, getDashboard, postDashboard } from './grafanaHandler'
import { createResponse, parseSlackCommand, SlackPost, isAuthorized } from './slackUtils'
import { AlertError, handleError } from './errors'

export const setAlarm: APIGatewayProxyHandler = async event => {
  if (!isAuthorized(event)) {
    return handleError(new AlertError("Couldn't verify credentials", 401))
  }
  const slackPost: SlackPost = parseSlackCommand(event.body)
  let dashboardData

  try {
    const getResponse = await getDashboard()
    dashboardData = JSON.parse(getResponse)
  } catch (error) {
    return handleError(new AlertError('Error creating dashboard data', 500))
  }

  try {
    await postDashboard(createDashboard(slackPost, dashboardData.dashboard))
  } catch (error) {
    return handleError(new AlertError('Error posting dashboard data to Grafana', 500))
  }

  return createResponse(200, slackPost.command, slackPost.value)
}
