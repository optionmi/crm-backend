const db = require('../config/db');

class Salesperson {
  constructor(salesperson) {
    this.name = salesperson.name;
    this.phone_number = salesperson.phone_number;
    this.address = salesperson.address
  }

  static create(newSalesperson, result) {
    db.query('INSERT INTO salespersons SET ?', newSalesperson, (err, res) => {
      if (err) {
        console.error('Error creating salesperson: ', err);
        result(err, null);
        return;
      }
      console.log('Created salesperson: ', { id: res.insertId, ...newSalesperson });
      result(null, { id: res.insertId, ...newSalesperson });
    });
  }

  static updateById(salespersonId, updatedSalesperson, result) {
    db.query(
      'UPDATE salespersons SET name = ?, email = ? WHERE id = ?',
      [updatedSalesperson.name, updatedSalesperson.phone_number, updatedSalesperson.address,  salespersonId],
      (err, res) => {
        if (err) {
          console.error('Error updating salesperson: ', err);
          result(err, null);
          return;
        }
        if (res.affectedRows === 0) {
          // Salesperson not found with the given ID
          result({ kind: 'not_found' }, null);
          return;
        }
        console.log('Updated salesperson: ', { id: salespersonId, ...updatedSalesperson });
        result(null, { id: salespersonId, ...updatedSalesperson });
      }
    );
  }

  static remove(salespersonId, result) {
    db.query('DELETE FROM salespersons WHERE id = ?', salespersonId, (err, res) => {
      if (err) {
        console.error('Error deleting salesperson: ', err);
        result(err, null);
        return;
      }
      if (res.affectedRows === 0) {
        // Salesperson not found with the given ID
        result({ kind: 'not_found' }, null);
        return;
      }
      console.log('Deleted salesperson with id: ', salespersonId);
      result(null, res);
    });
  }

  static findById(salespersonId, result) {
    db.query('SELECT * FROM salespersons WHERE id = ?', salespersonId, (err, res) => {
      if (err) {
        console.error('Error retrieving salesperson: ', err);
        result(err, null);
        return;
      }
      if (res.length === 0) {
        // Salesperson not found with the given ID
        result({ kind: 'not_found' }, null);
        return;
      }
      console.log('Salesperson with id: ', salespersonId, res[0]);
      result(null, res[0]);
    });
  }

  static getAll(result) {
    db.query('SELECT * FROM salespersons', (err, res) => {
      if (err) {
        console.error('Error retrieving salespersons: ', err);
        result(err, null);
        return;
      }
      console.log('Salespersons: ', res);
      result(null, res);
    });
  }
}

module.exports = Salesperson;
