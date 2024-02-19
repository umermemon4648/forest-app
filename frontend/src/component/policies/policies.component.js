import React from 'react';
import './policies.component.css';
import { TitleElement } from '../../element';

const Policy = ({ policy }) => {
  const { title, content } = policy;

  return (
    <div className="policycontainer">
      {/* heading */}
      <div className="title">
        <TitleElement title={title} />
      </div>

      {/* content */}
      <div className="policybody">
        <div>
          {content}
        </div>
      </div>
    </div>

  );
};

export default Policy;
