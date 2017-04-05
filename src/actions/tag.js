'use strict'

const { TAG, EDIT } = require('../constants')
const { array } = require('../common/util')

module.exports = {
  new(payload, meta) {
    return {
      type: EDIT.START,
      payload: {
        tag: { name: '', ...payload, }
      },
      meta
    }
  },

  edit(payload, meta) {
    const context = (payload.items != null) ? 'tabTag' : 'tag'

    return {
      type: EDIT.START,
      payload: {
        [context]: payload
      },
      meta
    }
  },

  create(payload, meta) {
    return {
      type: TAG.CREATE,
      payload,
      meta: {
        async: true,
        record: true,
        ipc: TAG.CHANGED,
        ...meta
      }
    }
  },

  save(payload, meta) {
    return {
      type: TAG.SAVE,
      payload,
      meta: { async: true, record: true, ...meta }
    }
  },

  delete(payload, meta) {
    return {
      type: TAG.DELETE,
      payload: array(payload),
      meta: {
        async: true,
        record: true,
        search: true,
        ipc: TAG.CHANGED,
        ...meta
      }
    }
  },

  load(payload, meta) {
    return {
      type: TAG.LOAD,
      payload,
      meta: { async: true, ipc: TAG.CHANGED, ...meta }
    }
  },

  update(payload, meta) {
    return {
      type: TAG.UPDATE,
      payload,
      meta: { ipc: TAG.CHANGED, ...meta }
    }
  },

  select(payload, meta) {
    return {
      type: TAG.SELECT,
      payload,
      meta: { search: true, ...meta }
    }
  }
}
