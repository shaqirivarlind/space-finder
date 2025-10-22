import { SNSEvent } from 'aws-lambda'

const webHookUrl = 'the url from slack hook created in a chanel'

export async function handler(event: SNSEvent, context) {
  for (const record of event.Records) {
    await fetch(webHookUrl, {
      method: 'POST',
      body: JSON.stringify({
        "text": `Test, we have a problem: ${record.Sns.Message}`,
      })
    })
  }
}