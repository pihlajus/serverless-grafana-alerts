export const saunaAlertTemplate = `{
        "conditions": [
          {
            "evaluator": {
              "params": [
                {{temperature}}
              ],
              "type": "gt"
            },
            "operator": {
              "type": "and"
            },
            "query": {
              "params": [
                "A",
                "10s",
                "now"
              ]
            },
            "reducer": {
              "params": [],
              "type": "max"
            },
            "type": "query"
          }
        ],
        "executionErrorState": "keep_state",
        "for": "0m",
        "frequency": "1m",
        "handler": 1,
        "message": "Sauna lämmin!",
        "name": "Sauna lämmin!",
        "noDataState": "keep_state",
        "notifications": [
          {
            "uid": "46ezAOuZz"
          }
        ]
      }`
