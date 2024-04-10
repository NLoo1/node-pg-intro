const express = require("express");
const ExpressError = require("../expressError")
const router = express.Router();
var datetime = require('node-datetime');
const db = require("../db");

router.get('/', async (req, res, next) => {
    try{
        const results = await db.query(`SELECT * FROM invoices`);
        return res.json({ companies: invoices.rows })
    } catch(e){
        next(e) 
    }
})


router.get('/:id', async (req, res, next) => {
    try {
      const { id } = req.params;
      const results = await db.query('SELECT * FROM invoices WHERE id = $1', [id])
      if (results.rows.length === 0) {
        throw new ExpressError(`Can't find invoice with id of ${id}`, 404)
      }
      return res.send({ invoice: results.rows[0] })
    } catch (e) {
      return next(e)
    }
  })

  router.post('/', async (req, res, next) => {
    try {
      const { comp_code, amt} = req.body;
      date = datetime.now()
      const results = await db.query(`INSERT INTO invoice (comp_code, amt, paid, add_date, paid_date) VALUES ($1, $2, true, ${date}, ${date}) RETURNING comp_code, amt, add_date, paid_date`, [comp_code, amt]);
      return res.status(201).json({ company: results.rows[0] })
    } catch (e) {
      return next(e)
    }
  })
  
  router.patch('/:id', async (req, res, next) => {
    try {
      const { id } = req.params;
      const { amt } = req.body;
      const results = await db.query('UPDATE users SET amt=$1 WHERE id=$2 RETURNING id, amt', [amt, id])
      if (results.rows.length === 0) {
        throw new ExpressError(`Can't update company with code of ${id}`, 404)
      }
      return res.send({ company: results.rows[0] })
    } catch (e) {
      return next(e)
    }
  })
  
  router.delete('/:id', async (req, res, next) => {
    try {
      const results = db.query('DELETE FROM companies WHERE id = $1', [req.params.code])
      return res.send({ msg: "DELETED!" })
    } catch (e) {
      return next(e)
    }
  })
  

module.exports = router;