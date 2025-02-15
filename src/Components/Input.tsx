import React from 'react'

const Input = ({value, header, placeholder, type, onChange}) => {
  return (
<label className="form-control w-full max-w-xs">
  <div className="label">
  <span className="label-text text-2xl flex justify-center m-2 w-full text-center">{header}</span>
  </div>
  <input type={type} placeholder={placeholder} value={value} onChange={onChange} className="input input-bordered m-1 max-w-xs" />
  <div className="label">
  </div>
</label>
  )
}

export default Input