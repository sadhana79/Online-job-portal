import React from "react";

export default function Footer() {
  return (
    <footer
      className="text-center text-white py-3"
      style={{ backgroundColor: "#c7d2dcff", marginTop: "0" }}
    >
      <p className="mb-0 text-dark">
        © {new Date().getFullYear()} JobPortal. All rights reserved. | Developed by <strong>Sadhana Gonge</strong>
      </p>
    </footer>
  );
}
