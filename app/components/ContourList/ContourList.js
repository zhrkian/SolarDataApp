import React, {Component} from 'react'
import SelectField from 'material-ui/SelectField'
import MenuItem from 'material-ui/MenuItem'
import Chip from 'material-ui/Chip'

class ContourList extends Component {
  state = {
    values: [],
  }

  selectionRenderer = (values) => {
    switch (values.length) {
      case 0:
        return ''
      default:
        return values.map(value => <Chip>{value}</Chip>)
    }
  }

  handleChange = (event, index, values) => {
    this.setState({ values })
    this.props.onChange(values)
  }
  
  menuItems(values) {
    const { contours } = this.props
    return contours.map((contour) => (
      <MenuItem
        key={contour.title}
        insetChildren={true}
        checked={values && values.includes(contour.title)}
        value={contour.title}
        primaryText={contour.title}
      />
    ))
  }

  render() {
    const { values } = this.state
    return (
      <SelectField labelStyle={{color: 'white'}}
                   listStyle={{color: 'white'}}
                   hintStyle={{color: 'white'}}
                   floatingLabelStyle={{color: 'white'}}
                   multiple={true}
                   hintText="Select a contour"
                   value={values}
                   onChange={this.handleChange}>
        {this.menuItems(values)}
      </SelectField>
    )
  }
}

export default ContourList