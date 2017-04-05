import s from './SaveImage.css'
import React, { Component } from 'react'
import * as Icons from '../Icons/Icons'

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
    const { label } = this.props
    return (
      <a ref={link => { this.Link = link; }}
         className={s.container}
         onClick={this.onClick} href="">
        <div className={s.icon}>
          <Icons.Image />
        </div>
        <div className={s.label}>
          <div className={s.text}>{label}</div>
        </div>
      </a>
    )
  }
}

export default SaveImage