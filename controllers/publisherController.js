const Publisher = require('../models/publisher');

exports.createPublisher = (req, res) => {
  if (!req.body) {
    res.status(400).send({ message: 'Content cannot be empty!' });
    return;
  }

  const newPublisher = new Publisher({
    name: req.body.name,
    address: req.body.address,
    contactInfo: req.body.contactInfo,
  });

  Publisher.create(newPublisher, (err, data) => {
    if (err) {
      res.status(500).send({
        message: err.message || 'Error creating publisher.',
      });
    } else {
      res.status(201).send(data);
    }
  });
};

exports.updatePublisher = (req, res) => {
  if (!req.body) {
    res.status(400).send({ message: 'Content cannot be empty!' });
    return;
  }

  const publisherId = req.params.id;
  const updatedFields = req.body;


  Publisher.updateById(publisherId, updatedFields, (err, data) => {
    if (err) {
      if (err.kind === 'not_found') {
        res.status(404).send({
          message: `Publisher with id ${publisherId} not found.`,
        });
      } else {
        res.status(500).send({
          message: `Error updating publisher with id ${publisherId}`,
        });
      }
    } else {
      res.status(200).send(data);
    }
  });
};

exports.deletePublisher = (req, res) => {
  const publisherId = req.params.id;

  Publisher.remove(publisherId, (err, data) => {
    if (err) {
      if (err.kind === 'not_found') {
        res.status(404).send({
          message: `Publisher with id ${publisherId} not found.`,
        });
      } else {
        res.status(500).send({
          message: `Could not delete publisher with id ${publisherId}`,
        });
      }
    } else {
      res.status(204).send();
    }
  });
};

exports.getAllPublishers = (req, res) => {
  Publisher.getAll((err, data) => {
    if (err) {
      res.status(500).send({
        message: err.message || 'Error retrieving publishers.',
      });
    } else {
      res.status(200).send(data);
    }
  });
};

exports.viewPublisher = (req, res) => {
  const publisherId = req.params.id;

  Publisher.findById(publisherId, (err, data) => {
    if (err) {
      if (err.kind === 'not_found') {
        res.status(404).send({
          message: `Publisher with id ${publisherId} not found.`,
        });
      } else {
        res.status(500).send({
          message: `Error retrieving publisher with id ${publisherId}`,
        });
      }
    } else {
      res.status(200).send(data);
    }
  });
};