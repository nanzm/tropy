'use strict'

const { basename } = require('path')
const pkg = require('../../package')
const exe = basename(process.argv[0])

module.exports = require('yargs')
  .usage(`Usage: ${exe} [options]`)
  .strict()
  .wrap(78)

  .option('environment', {
    alias: 'e',
    type: 'string',
    describe: 'Set environment',
    choices: ['dev', 'test', 'production']
  })
  .default('environment',
      () => (process.env.NODE_ENV || 'production'), '"production"')

  .option('debug', {
    type: 'boolean',
    describe: 'Set debug flag'
  })

  .help('help')
  .version(pkg.version)

  .epilogue([
    'Environment Variables:',
    '  NODE_ENV  Set default environment'
  ].join('\n'))
