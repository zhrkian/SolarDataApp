import s from './Block.css'
import React from 'react'

const Block = props =>
  <div className={s.block}>
    <div className={s.blockTitleHolder}>
      <span className={s.blockTitleMessage}>{props.title}</span>
    </div>
    <div className={s.blockContent}>
      {props.children}
    </div>
  </div>

export default Block