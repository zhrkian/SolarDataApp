import React from 'react'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table'

/**
 * Dialog content can be scrollable.
 */
export default class ContourResultModal extends React.Component {
  render() {
    const actions = [
      <FlatButton
        label="Ok"
        primary={true}
        keyboardFocused={true}
        onClick={this.props.onClose}
      />,
    ]

    const { contourInfo } = this.props
    const { totalContourSquarePixels, totalSquarePixels, totalContourSphericalSquare, totalVisibleSphericalSquare } = contourInfo || {}

    return (
      <div>
        <Dialog
          title="Contour info"
          actions={actions}
          modal={false}
          open={!!this.props.contourInfo}
          onRequestClose={this.props.onClose}
          autoScrollBodyContent={true}
        >
          {
            contourInfo ? (
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
        </Dialog>
      </div>
    );
  }
}