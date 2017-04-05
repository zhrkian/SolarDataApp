import theme from './theme.css'
import s from './ContourNewModal.css'
import React from 'react'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import TextField from 'material-ui/TextField'

class ContourNewModal extends React.Component {
  constructor() {
    super()
    this.state = { contourName: '', error: '' }
  }

  onContourNameChange = (e, value) => this.setState({ contourName: value, error: '' })

  onSaveContour = () => {
    const { contourName } = this.state

    if (!contourName) return this.setState({ error: 'Please enter the contour name...'})

    return this.props.onAdd(contourName)
  }

  render() {
    const { contourName, error } = this.state
    const { active, onClose } = this.props

    const actions = [
      <FlatButton
        label="Add"
        primary={true}
        keyboardFocused={true}
        onClick={this.onSaveContour}
      />,
      <FlatButton
        label="Cancel"
        secondary={true}
        onClick={onClose}
      />,
    ]

    return (
      <div>
        <Dialog
          contentStyle={{width: '30%'}}
          theme={theme}
          title="Add new contour"
          actions={actions}
          modal={false}
          open={!!active}
          onRequestClose={onClose}
          autoScrollBodyContent={true}
        >
          <div className={s.container}>
            <TextField className={s.input}
                       hintText="Contour Name"
                       value={contourName}
                       errorText={error}
                       onChange={this.onContourNameChange}/>
          </div>
        </Dialog>
      </div>
    )
  }
}

export default ContourNewModal