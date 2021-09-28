import React from "react";

const ModalElement = ({ modalElement }) => {
  console.log(modalElement.logo[0]);
  return (
    <div className="accordion-item">
      <h2 className="accordion-header">
        <img src={modalElement.logo[0]} width="24" height="24" />
      </h2>
      Some text
    </div>
  );
};

export default ModalElement;
