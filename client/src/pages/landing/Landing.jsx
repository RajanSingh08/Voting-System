import React from 'react'
import './landing.scss'
import { useNavigate } from 'react-router-dom'

const Landing = () => {

    const navigate = useNavigate()

  return (
    <div className='landing'>

        <div className="landing_head">
            <h3><span>Voting</span> System</h3>
            <button onClick={()=>navigate("/login")} >login</button>
        </div>
        <div className="landing_body">
            <h1>Cast your precious vote at &nbsp; &nbsp; <span><span>V</span>oting System</span></h1>
            <p>Vote for your favorite candidate and see the results in real time</p>
            <button onClick={()=>navigate("/login")} >Get Started</button>
        </div>
    </div>
  )
}

export default Landing