import s from './ContourList.css'
import React from 'react'
import ContourEditModal from '../ContourEditModal/ContourEditModal'
import ContourListItem from '../ContourListItem/ContourListItem'

class ContourList extends React.Component {
  state = {}
  onOpenContourEditModal = contour => this.setState({ contourEditModal: true, contour })
  onCloseContourEditModal = () => this.setState({ contourEditModal: false, contour: null })

  render() {
    const { contourEditModal, contour } = this.state
    const { contours, active, onSelect, onEdit, onRemove } = this.props

    return (
      <div className={s.list}>
        {
          contours.map(contour =>
            <ContourListItem key={contour.title}
                             contour={contour}
                             active={active.title === contour.title}
                             onEdit={this.onOpenContourEditModal}
                             onRemove={onRemove}
                             onClick={onSelect} />)
        }


        {
          contourEditModal ? (
            <ContourEditModal active={contourEditModal}
                              contour={contour}
                              onSave={name => onEdit(name, contour) & this.onCloseContourEditModal()}
                              onClose={this.onCloseContourEditModal}/>
          ) : null
        }

      </div>
    )
  }
}

export default ContourList