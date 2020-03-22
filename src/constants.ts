export interface AlertEntity {
  slackCommand: string
  panelName: string
  slackBotReply: string
}

export const ALERT_ENTITIES: Array<AlertEntity> = [
  {
    slackCommand: '/sauna',
    panelName: 'Saunan lämpötilan seuranta',
    slackBotReply: 'Selvä juttu, ilmoitan kun saunan lämpötila on ',
  },
]
