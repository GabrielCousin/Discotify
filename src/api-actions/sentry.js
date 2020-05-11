import { withScope, captureMessage } from '@sentry/browser'

export default function logError (message, extra) {
  if (PRODUCTION_ENV) {
    withScope(scope => {
      scope.setExtra('extraData', extra)
      captureMessage(message)
    })
  } else {
    console.log(arguments) // eslint-disable-line no-console
  }
}
