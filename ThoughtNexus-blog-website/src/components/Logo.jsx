import React from 'react'
import Logo1 from '../assets/logo1.png'
function Logo({ width = '100px' }) {
    return (
        <div><img src={Logo1} alt="" width={width} /></div>
    )
}

export default Logo