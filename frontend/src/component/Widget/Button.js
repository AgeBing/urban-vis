import React from "react";
import { Button } from 'antd'
import Icon from  './iconfont'
import "./Button.scss"

function Btn(props){
  const  { type } = props 
  return (
    <>
      <Button
        className="btn"
        {...props}
        type="primary"
        shape="circle"
        size='large'>
        <Icon type={type} />
      </Button>
    </>
  )
}

export default Btn
