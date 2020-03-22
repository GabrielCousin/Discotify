function logger (message, extra) {
  if (PRODUCTION_ENV && Sentry) {
    Sentry.withScope(scope => {
      scope.setExtra('extraData', extra)
      Sentry.captureMessage(message)
    })
  } else {
    console.log(arguments) // eslint-disable-line no-console
  }
}

export default logger
