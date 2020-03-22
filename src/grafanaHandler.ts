import { ALERT_ENTITIES } from './constants'
import * as request from 'request-promise-native'
import * as Sqrl from 'squirrelly'
import { saunaAlertTemplate } from './templates/alertTemplates'
import { SlackPost } from './slackUtils'

export const getDashboard = async (): Promise<string> => {
  const options = {
    uri: `${process.env.GRAFANA_DASHBOARD_API}/uid/${process.env.GRAFANA_DASHBOARD_UID}`,
    headers: {
      Authorization: `Bearer ${process.env.GRAFANA_API_KEY}`,
    },
  }
  try {
    const response = await request.get(options)
    return Promise.resolve(response)
  } catch (error) {
    return Promise.reject(error)
  }
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const apifyDashboard = dashboard => {
  dashboard.version += 1
  return {
    dashboard,
    overwrite: true,
    message: 'Modified by Lambda',
  }
}

export const postDashboard = async (dashboard): Promise<string> => {
  const postObj = apifyDashboard(dashboard)
  const options = {
    uri: `${process.env.GRAFANA_DASHBOARD_API}/db`,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.GRAFANA_API_KEY}`,
    },
    body: JSON.stringify(postObj),
  }
  try {
    const response = await request.post(options)
    return Promise.resolve(response)
  } catch (error) {
    return Promise.reject(error)
  }
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const createDashboard = (slackPost: SlackPost, dashboard) => {
  const createdAlert = Sqrl.Render(saunaAlertTemplate, { temperature: slackPost.value })
  const alertJson = JSON.parse(createdAlert)
  const title = ALERT_ENTITIES.find(entity => entity.slackCommand === slackPost.command).panelName
  const pIndex = dashboard.panels.findIndex(p => p.title == title)
  if (pIndex < 0) {
    throw new Error(`Coulnd't find Grafana panel named "${title}"`)
  }
  dashboard.panels[pIndex].alert = alertJson
  return dashboard
}

