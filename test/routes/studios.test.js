const request = require('supertest');
const app = require('../../lib/app');
const Studio = require('../../lib/models/Studio');
const { getFilm } = require('../data-helpers');

describe('studio routes', () => {
  it('can create a new studio', () => {
    return request(app)
      .post('/studios')
      .send({
        name: 'Warner Bros',
        address: {
          city: 'Portland',
          state: 'OR',
          country: 'USA'
        }
      })
      .then(res => {
        expect(res.body).toEqual({
          name: 'Warner Bros',
          address: {
            city: 'Portland',
            state: 'OR',
            country: 'USA'
          },
          _id: expect.any(String),
          __v: 0
        });
      });
  });

  it('can get list a of studios', () => {
    return Studio.create({
      name: 'Warner Bros'
    })
      .then(() => {
        return request(app)
          .get('/studios'); 
      })
      .then(res => {
        expect(res.body).toHaveLength(6);
      });
  });

  it('can get a studio by id', () => {
    return Studio.create({
      name: 'Warner Bros'
    })
      .then(createdStudio => {
        return request(app)
          .get(`/studios/${createdStudio._id}`);
      })
      .then(res => {
        expect(res.body).toEqual({
          name: 'Warner Bros',
          _id: expect.any(String)
        });
      });
  });

  it('cannot delete a studio that has a film', () => {
    return getFilm()
      .then(() => {
        return request(app)
          .get('/films');
      })
      .then(filmList => {
        return request(app)
          .delete(`/studios/${filmList.body[0].studio}`);
      })
      .then(res => {
        expect(res.body.error).toEqual('This studio cannot be deleted.');
      });
  });
  
  it('can delete a studio if it has no films', () => {
    return Studio.create({
      name: 'Warner Bros'
    })
      .then(createdStudio => {
        return Promise.all([
          Promise.resolve(createdStudio),
          request(app)
            .delete(`/studios/${createdStudio._id}`)
        ]);
      })
      .then(([createdStudio, res]) => {
        expect(res.body._id).toEqual(createdStudio._id.toString());
      });
  });
});
