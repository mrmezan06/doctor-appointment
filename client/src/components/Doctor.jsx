import React from 'react'

function Doctor({doctor}) {
  return (
    <div className="card p-2">
        <div className="card-title">
            {doctor.firstName} {doctor.lastName}
        </div>
        <hr />
        <div className="card-text"><b>{doctor.specialization}</b></div>
        <div className="card-text"><b>Experience : </b>{doctor.experience}</div>
        <div className="card-text"><b>Fee Per Visit : </b>{doctor.feePerConsultation}</div>
        <div className="card-text"><b>Location : </b>{doctor.address}</div>
        <div className="card-text"><b>Visiting Hours : </b>{doctor.timings[0]} - {doctor.timings[1]}</div>

    </div>
  )
}

export default Doctor
