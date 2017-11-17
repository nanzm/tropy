'use strict'

const React = require('react')
const { PureComponent } = require('react')
const { bool, func } = require('prop-types')
const { injectIntl, intlShape } = require('react-intl')
const { ToolbarContext, ToolbarLeft } = require('../toolbar')
const { BufferedInput } = require('../input')
const { ensure } = require('../../dom')


class LinkToolbar extends PureComponent {
  componentWillReceiveProps(props) {
    if (!this.props.isActive && props.isActive) {
      ensure(
        this.container,
        'transitionend',
        this.input.focus,
        850)
    }
  }

  getLabelFor(name) {
    return this.props.intl.formatMessage({
      id: `editor.commands.link.${name}`
    })
  }

  handleBlur = () => true // cancel on blur

  handleTargetChange = (href) => {
    this.props.onCommit({ href })
  }

  setContainer = (container) => {
    this.container = container
  }

  setInput = (input) => {
    this.input = input
  }

  render() {
    return (
      <ToolbarContext
        dom={this.setContainer}
        isActive={this.props.isActive}>
        <ToolbarLeft className="form-inline">
          <BufferedInput
            ref={this.setInput}
            className="form-control link-target"
            isDisabled={!this.props.isActive}
            isRequired
            placeholder={this.getLabelFor('target')}
            value=""
            onBlur={this.handleBlur}
            onCancel={this.props.onCancel}
            onCommit={this.handleTargetChange}/>
        </ToolbarLeft>
      </ToolbarContext>
    )
  }

  static propTypes = {
    isActive: bool.isRequired,
    onCancel: func.isRequired,
    onCommit: func.isRequired,
    intl: intlShape.isRequired
  }
}

function markExtend(cursor, markType) {
  if (!cursor) return
  let startIndex = cursor.index()
  let endIndex = cursor.indexAfter()

  const hasMark = (index) => {
    // clicked outside edge of tag.
    if (index === cursor.parent.childCount) {
      index--
    }
    const result = cursor.parent.child(index).marks.filter(
      mark => mark.type.name === markType)
    return !!result.length
  }

  if (!hasMark(startIndex) && !hasMark(endIndex)) {
    return
  }
  while (startIndex > 0 && hasMark(startIndex)) {
    startIndex--
  }
  while ( endIndex < cursor.parent.childCount && hasMark(endIndex)) {
    endIndex++
  }

  let startPos = cursor.start()
  let endPos = startPos

  for (let i = 0; i < endIndex; i++) {
    let size = cursor.parent.child(i).nodeSize
    if (i < startIndex) startPos += size
    endPos += size
  }

  return { from: startPos, to: endPos }
}

module.exports = {
  LinkToolbar: injectIntl(LinkToolbar),
  markExtend
}
