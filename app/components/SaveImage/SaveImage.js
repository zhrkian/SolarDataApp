import s from './SaveImage.css'
import React, { Component } from 'react'

class SaveImage extends Component {
  onClick = () => {
    const { images, width, height } = this.props
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    canvas.width = width
    canvas.height = height

    images.forEach(image => {
      const imageLayerCanvas = document.querySelector(`[name="${image}"]`)
      ctx.drawImage(imageLayerCanvas, 0, 0)
    })

    this.Link.href = canvas.toDataURL()
    this.Link.download = 'image.png'
  }

  render() {
    return (
      <a ref={link => { this.Link = link; }}
         className={s.saveButton}
         onClick={this.onClick} href="">
        Save Image
      </a>
    )
  }
}

export default SaveImage