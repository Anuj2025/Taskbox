  import React from 'react'
  
  const Label = ({text, labels, setLabels}) => {
    const [Active, setActive] = React.useState(false);
    
   
   function handleLabel() {
    setActive((prev) => !prev);

    setLabels((prevLabels) => {
      if (prevLabels.includes(text)) {
        return prevLabels.filter((label) => label !== text);
      } else {
        return [...prevLabels, text];
      }
    });
  }
    return (
  <>
  <button type="button" onClick={() => handleLabel()} className={"m-1.5 btn btn-primary " + (Active ? "btn-active" : "btn-outline") } >{text}</button>
  </>
    )
  }
  
  export default Label