import theme from './theme.css'
import s from './ContourEditModal.css'
import React from 'react'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import TextField from 'material-ui/TextField'

class ContourEditModal extends React.Component {
  constructor(props) {
    super(props)
    const { contour } = props
    this.state = { contourName: contour.title, error: '' }
  }

  onContourNameChange = (e, value) => this.setState({ contourName: value, error: '' })

  onSave = () => {
    const { contourName } = this.state

    if (!contourName) return this.setState({ error: 'Please enter the contour name...'})

    return this.props.onSave(contourName)
  }

  render() {
    const { contourName, error } = this.state
    const { active, onClose } = this.props

    const actions = [
      <FlatButton
        label="Save"
        primary={true}
        keyboardFocused={true}
        onClick={this.onSave}
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
          title="Edit contour"
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

export default ContourEditModal