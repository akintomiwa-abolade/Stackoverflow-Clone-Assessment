const request = require('supertest');
const app = require('../test_server');
let rndNum = Math.floor(10000 + Math.random() * 900000);

describe('User Routes Test', function(){
	it('should register new user', async () => {
	    const res = await request(app)
	      .post('/users/register')
	      .send({
	      	name: 'testuser'+rndNum,
	      	email: 'test'+rndNum+'@email.com',
	      	password:'123456',
	      	fcm_token:'sss'
	      });

	    expect(res.statusCode).toEqual(201);

	    expect(res.body).toHaveProperty('name');
	});

	it('should login user', async () => {
	    const res = await request(app)
	      .post('/users/login')
	      .send({ 
	      	email: `test${rndNum}@email.com`,
	      	password:'123456'
	      });

	    expect(res.statusCode).toEqual(200);
	    
	    expect(res.body).toHaveProperty('token');
	});

	it('should fetch all users', async () => {
	    const res = await request(app).get('/users');
	    expect(res.statusCode).toEqual(200);
	    expect(Array.isArray(res.body)).toBe(true);
	});

	it('should fetch specific user by name', async () => {
	    const res = await request(app)
	    .post('/user/search')
	    .send({
	    	search:'testuser'
	    });
	    
	    expect(res.statusCode).toEqual(200);
	    expect(Array.isArray(res.body)).toBe(true);
	});
});