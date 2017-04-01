import React, { Component } from 'react'

const s = {}

class SaveFile extends Component {
  onClick = (text, name, type) => {
    const file = new Blob([text], {type: type})

    this.Link.href = URL.createObjectURL(file)
    this.Link.download = name
  }

  render() {
    return (
      <a ref={link => { this.Link = link; }}
         className={s.saveButton}
         onClick={this.onClick.bind(this, localStorage.getItem('SolarAppStorage'), 'SolarAppStorage.txt', 'text/plain')}>
        Save Image
      </a>
    )
  }
}

export default SaveFile