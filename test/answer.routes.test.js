
const request = require('supertest');
const app = require('../test_server');
let rndNum = Math.floor(10000 + Math.random() * 900000);



/*
  declare the token, answerId and questionId variable in a scope accessible
  by the entire test suite
*/
let token;
let questionId;
let answerId;

beforeAll(async (done) => {

	const res = await request(app)
	.post('/api/v1/users/register')
	.send({
		name: `testuser${rndNum}`,
		email: `test${rndNum}@email.com`,
		password:'123456',
		fcm_token:'sss'
	});

	const tokenRes = await request(app)
	.post('/api/v1/users/login')
	.send({ 
		email: `test${rndNum}@email.com`,
		password:'123456'
	});

    token = tokenRes.body.token; // save the token!

    request(app)
    .post('/api/v1/questions')
      .set('Authorization', `${token}`)
      .send({
		"title": "How to log errors in test typescript",
		"description": "I am finding it difficult to log errors in this test please help me out."
	})
    .end((err, response) => {
      questionId = response.body._id; // save the token!
      done();
    });
});

describe('Answer Routes Test', function(){

	it('should fetch all specific question answers by question id', async () => {
	    const res = await request(app).get('/api/v1/answers/question/'+questionId);
	    expect(res.statusCode).toEqual(200);
	    expect(Array.isArray(res.body)).toBe(true);
	});

	
	it('should fetch all answers made by loggedin user', async () => {
	    const res = await request(app).get('/api/v1/answers/user')
	    .set('Authorization', `${token}`);

	    expect(res.statusCode).toEqual(200);

	    expect(Array.isArray(res.body)).toBe(true);
	});

	it('should answer question', async () => {
	    const res = await request(app)
	      .post('/api/v1/answers')
	      .set('Authorization', `${token}`)
	      .send({
		    "question": questionId,
		    "title": "How to log errors in javascript test 3",
		    "description": "make use of the console.error() or console.log() or console.table() method. test"
		});

	    answerId = res.body._id;
	    expect(res.statusCode).toEqual(201);

	    expect(res.body).toHaveProperty('title');
	});

	it('should fetch single answer by id', async () => {
	    const res = await request(app).get(`/api/v1/answers/${answerId}`)
	    .set('Authorization', `${token}`);
	    expect(res.statusCode).toEqual(200);
	    expect(res.body).toHaveProperty('title');
	});

	it('should give an upvote to answer', async () => {
	    const res = await request(app).put(`/api/v1/answers/${answerId}/upvote`).set('Authorization', `${token}`);
	    expect(res.statusCode).toEqual(200);
	    expect(res.body).toHaveProperty('upvotes');
	});

	it('should give an downvote to answer', async () => {
	    const res = await request(app).put(`/api/v1/answers/${answerId}/downvote`).set('Authorization', `${token}`);
	    expect(res.statusCode).toEqual(200);
	    expect(res.body).toHaveProperty('downvotes');
	});
	
	it('should fetch specific answer by title', async () => {
	    const res = await request(app)
	    .post('/api/v1/answers/search')
	    .send({
	    	search:'How to log errors in javascript test 3'
	    });
	    
	    expect(res.statusCode).toEqual(200);
	    expect(Array.isArray(res.body)).toBe(true);
	});

	it('should update single answer', async () => {
	    const res = await request(app)
	    .put(`/api/v1/answers/${answerId}`)
	    .set('Authorization', `${token}`)
	    .send({
		    "question": questionId,
		    "title": "How to log errors in javascript test 3",
		    "description": "make use of the console.error() or console.log() or console.table() method. test"
		});

	    expect(res.statusCode).toEqual(200);
	    expect(res.body).toHaveProperty('title');
	});

	it('should delete answer', async () => {
	    const res = await request(app).delete(`/api/v1/answers/${answerId}`).set('Authorization', `${token}`);
	    expect(res.statusCode).toEqual(200);
	});
});