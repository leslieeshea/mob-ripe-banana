const request = require('supertest');
const Reviewer = require('../../lib/models/Reviewer');
const app = require('../../lib/app');
require('../data-helpers');

describe('reviewer routes', () => {
  it('can create a new reviewer', () => {
    return request(app)
      .post('/reviewers')
      .send({
        name: 'Carol',
        company: 'ABC Company'
      })
      .then(res => {
        expect(res.body).toEqual({
          name: 'Carol',
          company: 'ABC Company',
          _id: expect.any(String),
          __v: 0
        });
      });
  });

  it('can get list a of reviewers', () => {
    return Reviewer.create({
      name: 'Toddman',
      company: 'BuzzFeed'
    })
      .then(() => {
        return request(app)
          .get('/reviewers'); 
      })
      .then(res => {
        expect(res.body).toHaveLength(51);
      });
  });

  it('can get a reviewer by id', () => {
    return Reviewer.create({
      name: 'Toddman',
      company: 'BuzzFeed'
    })
      .then(createdReviewer => {
        return request(app)
          .get(`/reviewers/${createdReviewer._id}`);
      })
      .then(res => {
        expect(res.body).toEqual({
          name: 'Toddman',
          company: 'BuzzFeed',
          _id: expect.any(String)
        });
      });
  });

  it('can update a reviewer by id', () => {
    return Reviewer.create({
      name: 'Toddman',
      company: 'BuzzFeed'
    })
      .then(createdReviewer => {
        return Promise.all([
          Promise.resolve(createdReviewer),
          request(app)
            .put(`/reviewers/${createdReviewer._id}`)
            .send({
              name: 'Tina',
              company: 'BuzzFeed'
            })
        ]);
      })
      .then(([reviewer, updatedReviewer]) => {
        expect(updatedReviewer.body).toEqual({
          name: 'Tina',
          company: 'BuzzFeed',
          _id: reviewer._id.toString()
        });
      });
  });

  it('can delete a reviewer by id', () => {
    return Reviewer.create({
      name: 'Crystal',
      company: 'Dood Inc.'
    })
      .then(createdReviewer => {
        return Promise.all([
          Promise.resolve(createdReviewer),
          request(app)
            .delete(`/reviewers/${createdReviewer._id}`)
        ]);
      })
      .then(([createdReviewer, res]) => {
        expect(res.body._id).toEqual(createdReviewer._id.toString());
      });
  });
});
