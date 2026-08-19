const db = require('../config/db');

// CREATE JOB
exports.createJob = async (req, res) => {
  const { title, company, role_category, description } = req.body;

  await db.query(
    `INSERT INTO job_posts
     (user_id, title, company, role_category, description)
     VALUES (?, ?, ?, ?, ?)`,
    [req.user.id, title, company, role_category, description]
  );

  res.json({ message: "Job added successfully" });
};

// GET ALL JOBS
exports.getAllJobs = async (req, res) => {
  const [rows] = await db.query(
    `SELECT * FROM job_posts WHERE user_id = ? ORDER BY created_at DESC`,
    [req.user.id]
  );

  res.json(rows);
};

// GET JOB BY ID
exports.getJobById = async (req, res) => {
  const id = req.params.id;

  const [rows] = await db.query(
    `SELECT * FROM job_posts
     WHERE id = ? AND user_id = ?`,
    [id, req.user.id]
  );

  if (!rows.length) {
    return res.status(404).json({ message: "Job not found" });
  }

  res.json(rows[0]);
};

// UPDATE JOB
exports.updateJob = async (req, res) => {
  const { title, company, role_category, description, status } = req.body;
  const id = req.params.id;

  await db.query(
    `UPDATE job_posts
     SET title = ?, 
         company = ?, 
         role_category = ?, 
         description = ?, 
         status = ?
     WHERE id = ? AND user_id = ?`,
    [title, company, role_category, description, status, id, req.user.id]
  );

  res.json({ message: "Job updated successfully" });
};

// DELETE JOB
exports.deleteJob = async (req, res) => {
  const id = req.params.id;

  await db.query(
    `DELETE FROM job_posts
     WHERE id = ? AND user_id = ?`,
    [id, req.user.id]
  );

  res.json({ message: "Job deleted successfully" });
};

// UPDATE STATUS
exports.updateStatus = async (req, res) => {
  const { status } = req.body;
  const id = req.params.id;

  await db.query(
    `UPDATE job_posts 
     SET status = ?
     WHERE id = ? AND user_id = ?`,
    [status, id, req.user.id]
  );

  res.json({ message: "Application status updated" });
};