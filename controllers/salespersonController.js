const Salesperson = require('../models/salesperson');

exports.createSalesperson = (req, res) => {
  if (!req.body) {
    res.status(400).send({ message: 'Content cannot be empty!' });
    return;
  }

  const newSalesperson = new Salesperson({
    name: req.body.name,
    email: req.body.email,
  });

  Salesperson.create(newSalesperson, (err, data) => {
    if (err) {
      res.status(500).send({
        message: err.message || 'Error creating salesperson.',
      });
    } else {
      res.status(201).send(data);
    }
  });
};

exports.updateSalesperson = (req, res) => {
  if (!req.body) {
    res.status(400).send({ message: 'Content cannot be empty!' });
    return;
  }

  const salespersonId = req.params.id;
  const updatedSalesperson = {
    name: req.body.name,
    email: req.body.email,
    // Add more fields as needed
  };

  Salesperson.updateById(salespersonId, updatedSalesperson, (err, data) => {
    if (err) {
      if (err.kind === 'not_found') {
        res.status(404).send({
          message: `Salesperson with id ${salespersonId} not found.`,
        });
      } else {
        res.status(500).send({
          message: `Error updating salesperson with id ${salespersonId}`,
        });
      }
    } else {
      res.status(200).send(data);
    }
  });
};

exports.deleteSalesperson = (req, res) => {
  const salespersonId = req.params.id;

  Salesperson.remove(salespersonId, (err, data) => {
    if (err) {
      if (err.kind === 'not_found') {
        res.status(404).send({
          message: `Salesperson with id ${salespersonId} not found.`,
        });
      } else {
        res.status(500).send({
          message: `Could not delete salesperson with id ${salespersonId}`,
        });
      }
    } else {
      res.status(204).send();
    }
  });
};

exports.viewSalesperson = (req, res) => {
  const salespersonId = req.params.id;

  Salesperson.findById(salespersonId, (err, data) => {
    if (err) {
      if (err.kind === 'not_found') {
        res.status(404).send({
          message: `Salesperson with id ${salespersonId} not found.`,
        });
      } else {
        res.status(500).send({
          message: `Error retrieving salesperson with id ${salespersonId}`,
        });
      }
    } else {
      res.status(200).send(data);
    }
  });
};

exports.getAllSalespersons = (req, res) => {
  Salesperson.getAll((err, data) => {
    if (err) {
      res.status(500).send({
        message: err.message || 'Error retrieving salespersons.',
      });
    } else {
      res.status(200).send(data);
    }
  });
};