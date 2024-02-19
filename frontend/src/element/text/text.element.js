import React from 'react'
import './text.element.css'
const TextElement = ({text}) => {
  return (
    <div className="page-width textElement">
    <div className="text-wrapper">
      <p className="text">{text}</p>
    </div>
  </div>
  )
}

export default TextElement
