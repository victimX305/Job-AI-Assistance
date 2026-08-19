const db = require('../config/db');

// CREATE CV
exports.createCV = async (req, res) => {
  const { role_category, cv_text } = req.body;

  await db.query(
    `INSERT INTO cvs (user_id, role_category, cv_text)
     VALUES (?, ?, ?)`,
    [req.user.id, role_category, cv_text]
  );

  res.json({ message: "CV created successfully" });
};

// GET ALL CVs
exports.getAllCVs = async (req, res) => {
  const [rows] = await db.query(
    `SELECT * FROM master_cv WHERE user_id = ?`,
    [req.user.id]
  );

  res.json(rows);
};

// GET CV BY ROLE
exports.getCVByRole = async (req, res) => {
  const role = req.params.role;

  const [rows] = await db.query(
    `SELECT * FROM master_cv
     WHERE user_id = ? AND role_category = ?`,
    [req.user.id, role]
  );

  if (!rows.length) {
    return res.status(404).json({ message: "CV not found for this role" });
  }

  res.json(rows[0]);
};

// UPDATE CV
exports.updateCV = async (req, res) => {
  const {id} = req.params;
  const {role_category, cv_text} = req.body;
  

  await db.query(
    `UPDATE master_cv 
     SET role_category = ?, cv_text = ?
     WHERE id = ? AND user_id = ?`,
    [role_category, cv_text, id, req.user.id]
  );

  res.json({ message: "CV updated successfully" });
};

// DELETE CV
exports.deleteCV = async (req, res) => {
  const {id} = req.params;

  await db.query(
    `DELETE FROM master_cv
     WHERE id = ? AND user_id = ?`,
    [id, req.user.id]
  );

  res.json({ message: "CV deleted successfully" });
};