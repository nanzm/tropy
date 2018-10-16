'use strict'

const React = require('react')
const lazy = require('./node')
const { get } = require('../../common/util')
const { arrayOf, func, number, object, shape } = require('prop-types')


class ListTree extends React.Component {
  isEditing(id) {
    return get(this.props.edit, ['id']) === id
  }

  isExpanded(id) {
    return this.props.expand[id] || this.hasNewListNode(id)
  }

  isSelected(id) {
    return this.props.selection === id
  }

  handleSortPreview = () => {
  }

  handleSortReset = () => {
  }

  handleSort = () => {
    //this.props.onSort({
    //  id: this.props.parent.id,
    //  children: this.state.order
    //})
  }

  hasNewListNode(parent = this.props.parent.id) {
    let { edit } = this.props
    return edit && edit.id == null && edit.parent === parent
  }

  mapChildren(fn) {
    return this.props.parent.children.map(id =>
      (id in this.props.lists) && fn(this.props.lists[id])
    )
  }

  render() {
    return (
      <ol className="list-tree sortable" ref={this.setContainer}>
        {this.mapChildren(list =>
          <lazy.ListNode {...this.props}
            key={list.id}
            list={list}
            isSelected={this.isSelected(list.id)}
            isEditing={this.isEditing(list.id)}
            isExpanded={this.isExpanded(list.id)}
            isHolding={this.props.hold[list.id]}
            onSortPreview={this.handleSortPreview}
            onSortReset={this.handleSortReset}
            onSort={this.handleSort}/>)}
        {this.hasNewListNode() &&
          <lazy.NewListNode
            parent={this.props.edit.parent}
            onCancel={this.props.onEditCancel}
            onSave={this.props.onSave}/>}
      </ol>
    )
  }

  static propTypes = {
    parent: shape({
      id: number.isRequired,
      children: arrayOf(number).isRequired
    }).isRequired,
    lists: object.isRequired,
    hold: object.isRequired,
    edit: object,
    expand: object.isRequired,
    selection: number,
    onClick: func.isRequired,
    onCollapse: func.isRequired,
    onContextMenu: func.isRequired,
    onDropFiles: func.isRequired,
    onDropItems: func.isRequired,
    onEditCancel: func.isRequired,
    onExpand: func.isRequired,
    onSave: func.isRequired,
    onSort: func.isRequired
  }
}

module.exports.ListTree = ListTree
