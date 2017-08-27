'use strict'

const React = require('react')
const { PureComponent } = React
const { DragSource, DropTarget } = require('react-dnd')
const { ResourceSelect } = require('../resource/select')
const { IconButton } = require('../button')
const { FormField, FormGroup, FormToggle, Label } = require('../form')
const { IconGrip, IconPlusCircle, IconMinusCircle } = require('../icons')
const { DND } = require('../../constants')
const cx = require('classnames')
const { array, bool, func, number, object } = require('prop-types')
const { bounds } = require('../../dom')
const { round } = Math


class TemplateField extends PureComponent {
  get classes() {
    return {
      'template-field': true,
      'dragging': this.props.isDragging
    }
  }

  get isDragAndDropEnabled() {
    return !this.props.isDisabled && !this.props.isSingle
  }

  setContainer = (container) => {
    this.container = container
  }

  handlePropertyChange = ({ id }) => {
    this.handleChange({ property: id })
  }

  handleDatatypeChange = ({ id }) => {
    this.handleChange({ datatype: id })
  }

  handleLabelChange = () => {
  }

  handleChange = (data) => {
    this.props.onSave(this.props.field.id, data, this.props.position)
  }

  handleInsert = () => {
    this.props.onInsert(this.props.field, this.props.position + 1)
  }

  handleRemove = () => {
    this.props.onRemove(this.props.field)
  }

  connectDragSource(element) {
    return this.isDragAndDropEnabled ? this.props.ds(element) : element
  }

  connectDropTarget(element) {
    return this.isDragAndDropEnabled ? this.props.dt(element) : element
  }

  renderInsertButton() {
    return !this.props.isDisabled && (
      <IconButton
        icon={<IconPlusCircle/>}
        isDisabled={this.props.isTransient}
        onClick={this.handleInsert}/>
    )
  }

  renderRemoveButton() {
    return !this.props.isDisabled && (
      <IconButton
        icon={<IconMinusCircle/>}
        isDisabled={this.props.isTransient && this.props.isSingle}
        onClick={this.handleRemove}/>
    )
  }

  render() {
    return this.connectDropTarget(
      <li
        className={cx(this.classes)}
        ref={this.setContainer}>
        {this.connectDragSource(
          <fieldset>
            {this.isDragAndDropEnabled && <IconGrip/>}
            <FormGroup isCompact>
              <Label
                id="template.field.property"
                size={3}/>
              <div className="col-9">
                <ResourceSelect
                  resources={this.props.properties}
                  selected={this.props.field.property}
                  isRequired={!this.props.isTransient}
                  isDisabled={this.props.isDisabled}
                  placeholder="property.select"
                  tabIndex={0}
                  onChange={this.handlePropertyChange}/>
              </div>
            </FormGroup>
            <FormField
              id="template.field.label"
              name="label"
              value={this.props.field.label}
              isDisabled={this.props.isDisabled || this.props.isTransient}
              tabIndex={0}
              isCompact
              size={9}
              placeholder=""
              onChange={this.handleLabelChange}/>
            <FormGroup isCompact>
              <Label
                id="template.field.datatype"
                size={3}/>
              <div className="col-9">
                <ResourceSelect
                  resources={this.props.datatypes}
                  selected={this.props.field.datatype}
                  isRequired
                  isDisabled={this.props.isDisabled}
                  placeholder="datatype.select"
                  tabIndex={0}
                  onChange={this.handleDatatypeChange}/>
              </div>
            </FormGroup>
            <FormToggle
              id="template.field.isRequired"
              name="isRequired"
              value={this.props.field.isRequired}
              isDisabled={this.props.isDisabled || this.props.isTransient}
              tabIndex={0}
              onChange={this.handleChange}
              isCompact
              size={9}/>
            <FormField
              id="template.field.hint"
              name="hint"
              value={this.props.field.hint || ''}
              isDisabled={this.props.isDisabled || this.props.isTransient}
              onChange={this.handleChange}
              tabIndex={0}
              isCompact
              size={9}/>
            <FormField
              id="template.field.value"
              name="value"
              value={this.props.field.value || ''}
              isDisabled={this.props.isDisabled || this.props.isTransient}
              onChange={this.handleChange}
              tabIndex={0}
              isCompact
              size={9}/>
            <FormToggle
              id="template.field.isConstant"
              name="isConstant"
              value={this.props.field.isConstant}
              isDisabled={this.props.isDisabled || this.props.isTransient}
              tabIndex={0}
              onChange={this.handleChange}
              isCompact
              size={9}/>
          </fieldset>
        )}
        <div className="btn-group">
          {this.renderInsertButton()}
          {this.renderRemoveButton()}
        </div>
      </li>
    )
  }

  static propTypes = {
    field: object.isRequired,
    isDragging: bool,
    isDisabled: bool,
    isTransient: bool,
    isSingle: bool,
    position: number.isRequired,
    datatypes: array.isRequired,
    properties: array.isRequired,
    ds: func.isRequired,
    dt: func.isRequired,
    onInsert: func.isRequired,
    onRemove: func.isRequired,
    onSave: func.isRequired,
    onSort: func.isRequired,
    onSortPreview: func.isRequired,
    onSortReset: func.isRequired,
    onSortStart: func.isRequired
  }
}


const DragSourceSpec = {
  beginDrag({ field, onSortStart }) {
    onSortStart(field)
    return field
  },

  endDrag({ field, onSort, onSortReset }, monitor) {
    if (monitor.didDrop()) {
      onSort(field)
    } else {
      onSortReset(field)
    }
  }
}

const DragSourceCollect = (connect, monitor) => ({
  ds: connect.dragSource(),
  isDragging: monitor.isDragging()
})


const DropTargetSpec = {
  hover({ field, onSortPreview }, monitor, { container }) {
    const item = monitor.getItem()
    if (item === field) return

    const { top, height } = bounds(container)
    const offset = round((monitor.getClientOffset().y - top) / height)

    onSortPreview(item, field, offset)
  },

  drop({ field }) {
    return field
  }
}

const DropTargetCollect = (connect, monitor) => ({
  dt: connect.dropTarget(),
  isOver: monitor.isOver()
})


module.exports = {
  TemplateField:
    DragSource(
      DND.TEMPLATE.FIELD, DragSourceSpec, DragSourceCollect)(
        DropTarget(
          DND.TEMPLATE.FIELD,
          DropTargetSpec,
          DropTargetCollect)(TemplateField))
}
