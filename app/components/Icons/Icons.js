import React from 'react'

export const Remove = () =>
  <svg xmlns="http://www.w3.org/2000/svg" width="46" height="46" viewBox="0 0 46 46">
    <g stroke="#FFFFFF" strokeWidth="2" fill="none" fillRule="evenodd" strokeLinecap="round">
      <path d="M34.795 10.41L9.893 35.31M35.713 36.006L10.812 11.105"/>
    </g>
  </svg>

export const RemoveOne = () =>
  <svg xmlns="http://www.w3.org/2000/svg" width="46" height="46" viewBox="0 0 46 46">
    <g fill="none" fillRule="evenodd">
      <g stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round">
        <path d="M34.795 10.41L9.893 35.31M35.713 36.006L10.812 11.105"/>
      </g>
      <path fill="#FFFFFF" d="M42.827 13h-.999V6.377l-2.003.736v-.902l2.846-1.069h.156z"/>
    </g>
  </svg>

export const Contour = () =>
  <svg width="46" height="46" viewBox="0 0 46 46" xmlns="http://www.w3.org/2000/svg">
    <g fill="none" fillRule="evenodd">
      <path stroke="#FFFFFF" strokeWidth="2" d="M21.806 38.895L7 13.145 38 6v21.33z"/>
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
      <use stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xlinkHref="#a"/>
      <path d="M8.5-2.25l-22.804 34.205M13.5-2.25L-9.304 31.955M18.5-2.25L-4.304 31.955M23.5-2.25L.696 31.955M28.5-2.25L5.696 31.955M33.5-2.25L10.696 31.955M38.5-2.25L15.696 31.955M43.5-2.25L20.696 31.955M48.5-2.25L25.696 31.955" stroke="#FFFFFF" opacity="0.5" strokeLinecap="square" mask="url(#b)"/>
    </g>
  </svg>

export const Calc = () =>
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 46 46" width="46" height="46">
  <path fill="#FFFFFF" fillRule="evenodd" d="M24 22V7h-2v15H7v2h15v15h2V24h15v-2H24zM5 8c0-1.7 1.3-3 3-3h30c1.7 0 3 1.3 3 3v30c0 1.7-1.3 3-3 3H8c-1.7 0-3-1.3-3-3V8zm3-1h30c.5 0 1 .5 1 1v30c0 .5-.5 1-1 1H8c-.5 0-1-.5-1-1V8c0-.5.5-1 1-1z"/>
  <path fill="#FFFFFF" fillRule="evenodd" d="M14 14h-3v1h3v3h1v-3h3v-1h-3v-3h-1v3zm.5 16.8L11.7 28l-.7.7 2.8 2.8-2.8 3 .7.6 2.8-2.6 3 3 .6-.8-2.6-3 3-2.7-.8-.8-3 3zM28 14h7v1h-7v-1zm0 16h7v1h-7v-1zm0 2h7v1h-7v-1z"/>
  </svg>

export const Image = () =>
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 46 46" width="46" height="46">
    <path fill="#FFFFFF" fillRule="evenodd" d="M35.2 5h-25C7.2 5 5 7.3 5 10.2v25c0 3 2.3 5.3 5.2 5.3h25c3 0 5.3-2.4 5.3-5.3v-25c0-3-2.4-5.2-5.3-5.2zm3.2 30.2c0 1.8-1.4 3.2-3.2 3.2h-25c-1.7 0-3-1.4-3-3.2v-3.7l8.3-9.4L27 32.7l6.2-5.3 5.2 4.4v3.6zm0-6.4l-5.2-4.3-6.3 5.2-11.7-10.5L7 28.4V10.2c0-1.7 1.5-3 3.2-3h25c1.8 0 3.2 1.3 3.2 3v18.6z"/>
    <path fill="#FFFFFF" fillRule="evenodd" d="M30 20.6c3 0 5.2-2.3 5.2-5.2 0-2.8-2.3-5.2-5.2-5.2-2.8 0-5.2 2.4-5.2 5.2 0 3 2.4 5.2 5.2 5.2zm0-8.3c1.8 0 3.2 1.4 3.2 3 0 2-1.4 3.3-3.2 3.3-1.7 0-3-1.4-3-3.2 0-1.7 1.3-3 3-3z"/>
  </svg>

export const New = () =>
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 46 46" width="46" height="46">
    <path fill="#FFFFFF" fillRule="evenodd" d="M36.7 24.5v12.2H9.3V10.3h13.4V8H7v31h32V24.5"/>
    <path fill="#FFFFFF" fillRule="evenodd" d="M30.8 20.5H33V16h4.7v-2.4H33V9h-2v4.6h-4.5V16H31"/>
  </svg>
