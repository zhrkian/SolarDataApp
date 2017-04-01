import React from 'react'

export const Remove = () =>
  <svg xmlns="http://www.w3.org/2000/svg" width="46" height="46" viewBox="0 0 46 46">
    <g stroke="#FF1453" strokeWidth="2" fill="none" fillRule="evenodd" strokeLinecap="round">
      <path d="M34.795 10.41L9.893 35.31M35.713 36.006L10.812 11.105"/>
    </g>
  </svg>

export const RemoveOne = () =>
  <svg xmlns="http://www.w3.org/2000/svg" width="46" height="46" viewBox="0 0 46 46">
    <g fill="none" fillRule="evenodd">
      <g stroke="#FF1453" strokeWidth="2" strokeLinecap="round">
        <path d="M34.795 10.41L9.893 35.31M35.713 36.006L10.812 11.105"/>
      </g>
      <path fill="#FF1453" d="M42.827 13h-.999V6.377l-2.003.736v-.902l2.846-1.069h.156z"/>
    </g>
  </svg>

export const Contour = () =>
  <svg width="46" height="46" viewBox="0 0 46 46" xmlns="http://www.w3.org/2000/svg">
    <g fill="none" fillRule="evenodd">
      <path stroke="#FE0" strokeWidth="2" d="M21.806 38.895L7 13.145 38 6v21.33z"/>
      <circle fill="#FFF" cx="7" cy="13" r="3"/><circle fill="#FFF" cx="38" cy="6" r="3"/>
      <circle fill="#FFF" cx="38" cy="28" r="3"/><circle fill="#FFF" cx="22" cy="39" r="3"/>
    </g>
  </svg>

export const Area = () =>
  <svg width="46" height="46" viewBox="0 0 46 46" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <path id="a" d="M14.806 32.895L0 7.145 31 0v21.33z"/>
    </defs>
    <g transform="translate(7 7)" fill="none" fillRule="evenodd">
      <mask id="b" fill="#fff">
        <use xlinkHref="#a"/>
      </mask>
      <use stroke="#00C7FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xlinkHref="#a"/>
      <path d="M8.5-2.25l-22.804 34.205M13.5-2.25L-9.304 31.955M18.5-2.25L-4.304 31.955M23.5-2.25L.696 31.955M28.5-2.25L5.696 31.955M33.5-2.25L10.696 31.955M38.5-2.25L15.696 31.955M43.5-2.25L20.696 31.955M48.5-2.25L25.696 31.955" stroke="#0E95C6" strokeLinecap="square" mask="url(#b)"/>
    </g>
  </svg>

export const Calc = () =>
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 46 46" width="46" height="46">
    <path fill="#50E3C2" fill-rule="evenodd" d="M24 22V7h-2v15H7v2h15v15h2V24h15v-2H24zM5 8c0-1.7 1.3-3 3-3h30c1.7 0 3 1.3 3 3v30c0 1.7-1.3 3-3 3H8c-1.7 0-3-1.3-3-3V8zm3-1h30c.5 0 1 .5 1 1v30c0 .5-.5 1-1 1H8c-.5 0-1-.5-1-1V8c0-.5.5-1 1-1z"/>
    <path fill="#50E3C2" fill-rule="evenodd" d="M14 14h-3v1h3v3h1v-3h3v-1h-3v-3h-1v3zm.5 16.8L11.7 28l-.7.7 2.8 2.8-2.8 3 .7.6 2.8-2.6 3 3 .6-.8-2.6-3 3-2.7-.8-.8-3 3zM28 14h7v1h-7v-1zm0 16h7v1h-7v-1zm0 2h7v1h-7v-1z"/>
  </svg>
