'use strict'

const { CLOSE } = require('../constants/prefs')
const { ontology } = require('./ontology')
const { history } = require('./history')
const { ipc } = require('./ipc')
const { shell } = require('./shell')
const { debug, warn } = require('../common/log')
const storage = require('./storage')

const {
  all, call, cancel, cancelled, fork, take
} = require('redux-saga/effects')

module.exports = {
  *main() {
    debug('*prefs.main start')
    let aux

    try {
      aux = yield all([
        fork(ontology, { max: 2 }),
        fork(history),
        fork(ipc),
        fork(shell)
      ])
      debug('*prefs.main fork complete')

      yield all([
        call(storage.restore, 'prefs'),
        call(storage.restore, 'settings')
      ])
      debug('*prefs.main waiting for close')

      yield take(CLOSE)

    } catch (e) {
      warn(`unexpected error in *prefs.main: ${e.message}`, {
        stack: e.stack
      })

    } finally {
      yield all([
        call(storage.persist, 'prefs'),
        call(storage.persist, 'settings')
      ])

      if (!(yield cancelled())) {
        yield all(aux.map(t => cancel(t)))
      }

      debug('*prefs.main terminated')
    }
  }
}
