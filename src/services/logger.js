function logger (...args) {
  PRODUCTION_ENV && Raven ? Raven.captureMessage(...args) : console.log(...args) // eslint-disable-line no-console
}

export default logger
