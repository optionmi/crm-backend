const db = require('../config/db');

class Publisher {
  constructor(publisher) {
    this.name = publisher.name;
    this.address = publisher.address;
    this.contactInfo = publisher.contactInfo;
  }

  static create(newPublisher, result) {
    db.query('INSERT INTO publishers SET ?', newPublisher, (err, res) => {
      if (err) {
        console.error('Error creating publisher: ', err);
        result(err, null);
        return;
      }
      console.log('Created publisher: ', { id: res.insertId, ...newPublisher });
      result(null, { id: res.insertId, ...newPublisher });
    });
  }

  static getAll(result) {
    db.query('SELECT * FROM publishers', (err, res) => {
      if (err) {
        console.error('Error retrieving publishers: ', err);
        result(err, null);
        return;
      }
      console.log('Publishers: ', res);
      result(null, res);
    });
  }


  static updateById(publisherId, updatedPublisher, result) {
    db.query(
      'UPDATE publishers SET name = ?, address = ?, contactInfo = ? WHERE id = ?',
      [updatedPublisher.name, updatedPublisher.address, updatedPublisher.contactInfo, publisherId],
      (err, res) => {
        if (err) {
          console.error('Error updating publisher: ', err);
          result(err, null);
          return;
        }
        if (res.affectedRows === 0) {
          // Publisher not found with the given ID
          result({ kind: 'not_found' }, null);
          return;
        }
        console.log('Updated publisher: ', { id: publisherId, ...updatedPublisher });
        result(null, { id: publisherId, ...updatedPublisher });
      }
    );
  }

  static remove(publisherId, result) {
    db.query('DELETE FROM publishers WHERE id = ?', publisherId, (err, res) => {
      if (err) {
        console.error('Error deleting publisher: ', err);
        result(err, null);
        return;
      }
      if (res.affectedRows === 0) {
        // Publisher not found with the given ID
        result({ kind: 'not_found' }, null);
        return;
      }
      console.log('Deleted publisher with id: ', publisherId);
      result(null, res);
    });
  }

  static findById(publisherId, result) {
    db.query('SELECT * FROM publishers WHERE id = ?', publisherId, (err, res) => {
      if (err) {
        console.error('Error retrieving publisher: ', err);
        result(err, null);
        return;
      }
      if (res.length === 0) {
        // Publisher not found with the given ID
        result({ kind: 'not_found' }, null);
        return;
      }
      console.log('Publisher with id: ', publisherId, res[0]);
      result(null, res[0]);
    });
  }
}

module.exports = Publisher;