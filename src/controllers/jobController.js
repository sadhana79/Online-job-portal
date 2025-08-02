const Job = require("../models/jobModel");

exports.createJob = (req, res) => {
  const job = req.body;

  Job.create(job)
    .then((jobId) => res.status(201).json({ message: "Job posted successfully", jobId }))
    .catch((err) => res.status(500).json({ error: "Failed to post job", details: err }));
};

exports.listJobs = (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  Job.count()
    .then((total) => {
      Job.listPaginated(limit, offset)
        .then((data) => {
          res.json({
            data,
            pagination: {
              currentPage: page,
              totalPages: Math.ceil(total / limit),
              totalJobs: total
            }
          });
        });
    })
    .catch((err) => res.status(500).json({ error: "Unable to fetch job listings", details: err }));
};

exports.getJobById = (req, res) => {
  Job.findById(req.params.id)
    .then((job) => {
      if (!job) return res.status(404).json({ error: "Job not found" });
      res.json(job);
    })
    .catch((err) => res.status(500).json({ error: "Error retrieving job", details: err }));
};

exports.updateJob = (req, res) => {
  const id = req.params.id;
  const job = req.body;

  Job.update(id, job)
    .then(() => res.json({ message: "Job updated successfully" }))
    .catch((err) => res.status(500).json({ error: "Failed to update job", details: err }));
};

exports.deleteJob = (req, res) => {
  Job.delete(req.params.id)
    .then(() => res.json({ message: "Job deleted successfully" }))
    .catch((err) => res.status(500).json({ error: "Failed to delete job", details: err }));
};


exports.searchJobs = (req, res) => {
  const { title } = req.query;
  if (!title) {
    return res.status(400).json({ error: "Title is required" });
  }

  Job.searchByTitle(title)
    .then((results) => {
      if (results.length === 0) {
        return res.status(404).json({ error: "Job not found" });
      }
      res.status(200).json({ data: results });
    })
    .catch((err) => {
      res.status(500).json({ error: "Search failed", details: err });
    });
};

