import React from 'react'
import './title.element.css'
const TitleElement = ({title}) => {
  return (
    <div className="page-width titleElement">
    <div className="title-wrapper">
      <h1 className="title kalam">{title}</h1>
    </div>
  </div>
  )
}

export default TitleElement
