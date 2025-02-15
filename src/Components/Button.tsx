import React from 'react'

const Button = ({text, status, click}) => {
  const [Click, setClick] = React.useState(false);
  const [Status, setStatus] = React.useState(null);
  
  React.useEffect(() => {
    setStatus(status);
  })
  
  return (
    <button onClick={click} className="btn btn-active btn-neutral">
    {Click ? (<span className="loading loading-spinner"></span>) : (text)}
</button>
  )
}

export default Button