import React, { useEffect, useState } from "react";

export default function About() {
  const fullText =
    "We connect talented candidates with great companies. This portal allows Admins, HRs, and Users to collaborate efficiently in the hiring process.";

  const [typedText, setTypedText] = useState("");

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setTypedText((prev) => {
        if (index < fullText.length) {
          const nextChar = fullText.charAt(index);
          index++;
          return prev + nextChar;
        } else {
          clearInterval(interval);
          return prev;
        }
      });
    }, 40);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      title: "For Job Seekers",
      img: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
      desc: "Easily browse, apply, and track job applications in one place.",
      color: "linear-gradient(135deg, #8f9934ff, #b7c579ff)",
    },
    {
      title: "For HR Managers",
      img: "https://cdn-icons-png.flaticon.com/512/1995/1995574.png",
      desc: "Post jobs, manage applicants, and schedule interviews seamlessly.",
      color: "linear-gradient(135deg, #b74145ff, #da9581ff)",
    },
    {
      title: "For Admins",
      img: "https://cdn-icons-png.flaticon.com/512/992/992651.png",
      desc: "Monitor the platform, manage HRs and users, and ensure smooth operations.",
      color: "linear-gradient(135deg, #7b59ccff, #c06ea8ff)",
    },
  ];

  return (
    <div
      style={{
        background: "linear-gradient(135deg, #89f7fe, #66a6ff)", // keep page blue background
        minHeight: "100vh",
        paddingTop: "60px",
        paddingBottom: "60px",
      }}
    >
      <div className="container py-5">
        {/* Heading */}
        <h2
          className="text-center fw-bold mb-4"
          style={{
            color: " #2a2a2cff",
            fontSize: "2.8rem",
          }}
        >
          About Our Job Portal
        </h2>

        {/* Typing effect paragraph */}
        <p className="text-center mb-5 fs-5 text-white">
          {typedText}
          <span className="cursor">|</span>
        </p>

        {/* Feature Cards */}
        <div className="row g-4">
          {features.map((f, idx) => (
            <div className="col-md-4" key={idx}>
              <div
                className="card h-100 text-center shadow feature-card text-white"
                style={{
                  borderRadius: "20px",
                  background: f.color,
                  transition: "transform 0.3s, box-shadow 0.3s",
                }}
              >
                <div className="card-body d-flex flex-column justify-content-center align-items-center p-4">
                  <img
                    src={f.img}
                    alt={f.title}
                    className="mb-3 rounded-circle bg-white p-3"
                    style={{
                      width: "90px",
                      height: "90px",
                      objectFit: "contain",
                    }}
                  />
                  <h5 className="fw-bold mb-2">{f.title}</h5>
                  <p className="mb-0">{f.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Extra Section */}
        <div className="mt-5 p-5 text-center shadow-sm highlight-box">
          <h4 className="fw-bold mb-3">Why Choose Us?</h4>
          <p className="fs-5">
            With a modern and user-friendly design, our platform bridges the gap
            between employers and job seekers, ensuring opportunities are just a
            click away.
          </p>
        </div>
      </div>

      {/* Styles */}
      <style>{`
        .feature-card:hover {
          transform: translateY(-10px) scale(1.05);
          box-shadow: 0 15px 30px rgba(0,0,0,0.25);
        }

        .highlight-box {
          background: linear-gradient(135deg, #542f84ff, #380952ff);
          color: #fff;
          border-radius: 25px;
        }

        .cursor {
          display: inline-block;
          width: 1ch;
          animation: blink 0.7s steps(1) infinite;
          color: white;
        }

        @keyframes blink {
          0%, 50%, 100% { opacity: 1; }
          25%, 75% { opacity: 0; }
        }

        @media (max-width: 768px) {
          .feature-card img {
            width: 70px !important;
            height: 70px !important;
          }
        }
      `}</style>
    </div>
  );
}
