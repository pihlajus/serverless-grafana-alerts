import { SlackPost } from '../slackUtils'
import * as dashboardExport from './data/dashboard_export.json'
import { createDashboard } from '../grafanaHandler'

test('should create alert correctly and place it to dashboard', () => {
  const temperature: string = '99'
  const slackPost: SlackPost = new SlackPost('/sauna', temperature)
  const dashboardData = dashboardExport
  const dashboard = createDashboard(slackPost, dashboardData)
  expect(dashboard.panels[14]).toHaveProperty('alert')
  expect(dashboard.panels[14].alert.conditions[0].evaluator.params).toContain(+temperature)
  expect(dashboard.panels[13]).not.toHaveProperty('alert')
})

