'use strict';

const express = require('express');
const knex = require('../knex');

const router = express.Router();


router.get('/folders', (req, res, next) => {
  knex.select('id', 'name')
    .from('folders')
    .then(results => {
      res.json(results);
    })
    .catch(err => next(err));
});


router.get('/folders/:id', (req, res, next) => {
  const folderId = req.params.id;


  knex.select()
    .from('folders')
    .where('id', folderId)
    .then(([result]) => {
      if (result) {
        res.json(result);
      } else {
        next();
      }
    })
    .catch(next);
});

router.put('/folders/:id', (req, res, next) => {
  const folderId = req.params.id;
  /***** Never trust users - validate input *****/
  const updateObj = {};
  const updateableFields = ['name'];

  updateableFields.forEach(field => {
    if (field in req.body) {
      updateObj[field] = req.body[field];
    }
  });

  /***** Never trust users - validate input *****/
  if (!updateObj.name) {
    const err = new Error('Missing `name` in request body');
    err.status = 400;
    return next(err);
  }

  knex
    .from('folders')
    .update(updateObj)
    .where('id', folderId)
    .returning(['id', 'name'])
    .then(result => {
      if (result) {
        res.json(result);
      } else {
        next();
      }
    })
    .catch(err => next());
});

router.post('/folders', (req, res, next) => {
  const { name }  = req.body;

  const newItem = { name };
  /***** Never trust users - validate input *****/
  if (!newItem.name) {
    const err = new Error('Missing `name` in request body');
    err.status = 400;
    return next(err);
  }
  knex
    .insert(newItem)
    .into('folders')
    .returning('id','name')
    .then(result => {
      if (result) {
        res.location(`http://${req.headers.host}/folders/${result.id}`).status(201).json(result);
      }
    })
    .catch(err => next());
});

router.delete('/folders/:id', (req, res, next) => {
  const id = req.params.id;

  knex.select()
    .from('folders')
    .where('id', id)
    .del()
    .then(count => {
      if (count) {
        res.status(204).end();
      } else {
        next();
      }
    })
    .catch(err => next(err));
});




module.exports = router;