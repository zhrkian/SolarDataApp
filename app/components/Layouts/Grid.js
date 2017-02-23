import React from 'react'
import s from './Grid.css'

export const Grid = props => <div className={s.container}>{props.children}</div>

export const GridItem = props =>
  <div className={s.item}>
    {props.children}
  </div>