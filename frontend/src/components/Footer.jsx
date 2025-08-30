import React from 'react'
export default function Footer(){
  return (
    <footer className="mt-5 py-4 bg-light border-top">
      <div className="container d-flex justify-content-between align-items-center">
        <div>&copy; {new Date().getFullYear()} Job Portal</div>
        <div className="small text-muted">All rights reserved</div>
      </div>
    </footer>
  )
}
