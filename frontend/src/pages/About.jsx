import React from "react";

export default function About() {
  const features = [
    {
      title: "For Job Seekers",
      img: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
      desc: "Easily browse, apply, and track job applications in one place.",
      color: "linear-gradient(135deg, #6dd5ed, #2193b0)",
    },
    {
      title: "For HR Managers",
      img: "https://cdn-icons-png.flaticon.com/512/1995/1995574.png",
      desc: "Post jobs, manage applicants, and schedule interviews seamlessly.",
      color: "linear-gradient(135deg, #ff9a9e, #fad0c4)",
    },
    {
      title: "For Admins",
      img: "https://cdn-icons-png.flaticon.com/512/992/992651.png",
      desc: "Monitor the platform, manage HRs and users, and ensure smooth operations.",
      color: "linear-gradient(135deg, #a18cd1, #fbc2eb)",
    },
  ];

  return (
    <div className="container py-5">
      <h2 className="text-center mb-4 fw-bold text-gradient">About Our Job Portal</h2>
      <p className="text-center mb-5 text-muted fs-5">
        We connect talented candidates with great companies. This portal allows
        Admins, HRs, and Users to collaborate efficiently in the hiring process.
      </p>

      <div className="row g-4">
        {features.map((f, index) => (
          <div className="col-md-4" key={index}>
            <div
              className="card h-100 text-center shadow feature-card text-white"
              style={{
                borderRadius: "15px",
                transition: "transform 0.3s, box-shadow 0.3s",
                background: f.color,
              }}
            >
              <div className="card-body d-flex flex-column justify-content-center align-items-center p-4">
                <img
                  src={f.img}
                  alt={f.title}
                  className="mb-3 bg-white p-2 rounded-circle"
                  style={{ width: "80px", height: "80px", objectFit: "contain" }}
                />
                <h5 className="fw-bold mb-2">{f.title}</h5>
                <p>{f.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Extra Section */}
      <div className="mt-5 p-5 text-center rounded shadow-sm highlight-box">
        <h4 className="fw-bold mb-3">Why Choose Us?</h4>
        <p className="fs-5">
          With a modern and user-friendly design, our platform bridges the gap
          between employers and job seekers, ensuring opportunities are just a
          click away.
        </p>
      </div>

      <style>{`
        .feature-card:hover {
          transform: translateY(-10px) scale(1.03);
          box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        }

        .text-gradient {
          background: linear-gradient(135deg, #007bff, #00d4ff);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .highlight-box {
          background: linear-gradient(135deg, #e0c3fc, #8ec5fc);
          color: #333;
          border-radius: 20px;
        }
      `}</style>
    </div>
  );
}