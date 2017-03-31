import s from './ContourResultModal.css'
import React from 'react'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import TextField from 'material-ui/TextField'
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table'

/**
 * Dialog content can be scrollable.
 */
class ContourResultModal extends React.Component {
  constructor() {
    super()
    this.state = { contourName: '', error: '' }
  }

  onContourNameChange = (e, value) => this.setState({ contourName: value, error: '' })

  onSaveContour = () => {
    const { contourName } = this.state

    if (!contourName) return this.setState({ error: 'Please enter the contour name...'})

    return this.props.onSave(contourName)
  }

  render() {
    const { contourName, error } = this.state
    const { active, contourSquareInfo, contourIntensityInfo, onClose } = this.props
    const { totalContourSquarePixels, totalSquarePixels, totalContourSphericalSquare, totalVisibleSphericalSquare } = contourSquareInfo || {}
    const { aveIntensity } = contourIntensityInfo || {}


    const actions = [
      <FlatButton
        label="Save Contour Data"
        primary={true}
        keyboardFocused={true}
        onClick={this.onSaveContour}
      />,
      <FlatButton
        label="Close"
        primary={true}
        onClick={onClose}
      />,
    ]

    return (
      <div>
        <Dialog
          actions={actions}
          modal={false}
          open={!!active}
          onRequestClose={onClose}
          autoScrollBodyContent={true}
        >
          <div className={s.container}>
            <h2>Contour Info</h2>
            <TextField className={s.input}
                       hintText="Contour Name"
                       value={contourName}
                       errorText={error}
                       onChange={this.onContourNameChange}/>
            {
              contourSquareInfo ? (
                <Table selectable={false}>
                  <TableHeader displaySelectAll={false}
                               adjustForCheckbox={false}
                               enableSelectAll={false}>
                    <TableRow>
                      <TableHeaderColumn>Name</TableHeaderColumn>
                      <TableHeaderColumn>Contour Sqare</TableHeaderColumn>
                      <TableHeaderColumn>Total Visible Square</TableHeaderColumn>
                    </TableRow>
                  </TableHeader>
                  <TableBody displayRowCheckbox={false}>
                    <TableRow>
                      <TableRowColumn>Flat</TableRowColumn>
                      <TableRowColumn>{totalContourSquarePixels.toFixed(4)}</TableRowColumn>
                      <TableRowColumn>{totalSquarePixels.toFixed(4)}</TableRowColumn>
                    </TableRow>
                    <TableRow>
                      <TableRowColumn>Spherical</TableRowColumn>
                      <TableRowColumn>{totalContourSphericalSquare.toFixed(4)}</TableRowColumn>
                      <TableRowColumn>{totalVisibleSphericalSquare.toFixed(4)}</TableRowColumn>
                    </TableRow>
                  </TableBody>
                </Table>
              ) : null
            }

            <p>{ `Contour average intensity: ${aveIntensity}` }</p>
          </div>
        </Dialog>
      </div>
    )
  }
}

export default ContourResultModal