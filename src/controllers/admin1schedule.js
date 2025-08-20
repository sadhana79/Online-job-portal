exports.scheduleInterview = (req, res) => {
  const { candidateId, jobId, date, time, mode, location, meetingLink, notes } = req.body;

  if (!candidateId || !jobId) return res.status(400).json({ error: "candidateId and jobId required" });
  const iso = `${date}T${time}:00`;

  if (!isFutureDateTime(iso)) return res.status(400).json({ error: "Interview date must be in the future" });
  if (!isHHmm(time)) return res.status(400).json({ error: "Invalid time (HH:mm)" });

  if (mode === "ONLINE") {
    if (!meetingLink || !isURL(meetingLink)) return res.status(400).json({ error: "Valid meetingLink required for ONLINE mode" });
  } else if (mode === "OFFLINE") {
    if (!location) return res.status(400).json({ error: "Location required for OFFLINE mode" });
  } else return res.status(400).json({ error: "mode must be ONLINE or OFFLINE" });

  // verify candidate and job exist
  db.query("SELECT id FROM users WHERE id = ?", [candidateId])
    .then((rows) => {
      if (!rows.length) throw { status: 404, message: "Candidate not found" };
      return db.query("SELECT id FROM jobs WHERE id = ?", [jobId]);
    })
    .then((rows) => {
      if (!rows.length) throw { status: 404, message: "Job not found" };
      return db.query("INSERT INTO schedules (candidate_id, job_id, date_time, mode, location, meeting_link, notes, status) VALUES (?,?,?,?,?,?,?,'SCHEDULED')", [candidateId, jobId, `${date} ${time}:00`, mode, location || null, meetingLink || null, notes || null]);
    })
    .then(() => res.status(201).json({ message: "Interview scheduled and notification sent to candidate." }))
    .catch((err) => {
      if (err.status) return res.status(err.status).json({ error: err.message });
      res.status(500).json({ error: "Failed to schedule interview" });
    });
};
