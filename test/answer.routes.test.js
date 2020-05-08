const request = require('supertest');
const app = require('../test_server');

/*
  declare the token, answerId and questionId variable in a scope accessible
  by the entire test suite
*/
let token;
let questionId;
let answerId;

beforeAll(async (done) => {

	const res = await request(app)
	.post('/users/register')
	.send({
		name: 'testuser2',
		email: 'test2@email.com',
		password:'123456',
		fcm_token:'sss'
	});

	const tokenRes = await request(app)
	.post('/users/login')
	.send({ 
		email: 'test2@email.com',
		password:'123456'
	});

    token = tokenRes.body.token; // save the token!

    request(app)
    .post('/questions')
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
	    const res = await request(app).get('/answers/question/'+questionId);
	    expect(res.statusCode).toEqual(200);
	    expect(Array.isArray(res.body)).toBe(true);
	});

	
	it('should fetch all answers made by loggedin user', async () => {
	    const res = await request(app).get('/answers/user')
	    .set('Authorization', `${token}`);

	    expect(res.statusCode).toEqual(200);

	    expect(Array.isArray(res.body)).toBe(true);
	});

	it('should answer question', async () => {
	    const res = await request(app)
	      .post('/answers')
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
	    const res = await request(app).get(`/answers/${answerId}`)
	    .set('Authorization', `${token}`);
	    expect(res.statusCode).toEqual(200);
	    expect(res.body).toHaveProperty('title');
	});

	it('should give an upvote to answer', async () => {
	    const res = await request(app).put(`/answers/${answerId}/upvote`).set('Authorization', `${token}`);
	    expect(res.statusCode).toEqual(200);
	    expect(res.body).toHaveProperty('upvotes');
	});

	it('should give an downvote to answer', async () => {
	    const res = await request(app).put(`/answers/${answerId}/downvote`).set('Authorization', `${token}`);
	    expect(res.statusCode).toEqual(200);
	    expect(res.body).toHaveProperty('downvotes');
	});
	
	it('should fetch specific answer by title', async () => {
	    const res = await request(app)
	    .post('/answers/search')
	    .send({
	    	search:'How to log errors in javascript test 3'
	    });
	    
	    expect(res.statusCode).toEqual(200);
	    expect(Array.isArray(res.body)).toBe(true);
	});

	it('should update single answer', async () => {
	    const res = await request(app)
	    .put(`/answers/${answerId}`)
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
	    const res = await request(app).delete(`/answers/${answerId}`).set('Authorization', `${token}`);
	    expect(res.statusCode).toEqual(200);
	});
});