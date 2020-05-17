
const request = require('supertest');
const app = require('../test_server');
let rndNum = Math.floor(10000 + Math.random() * 900000);


/*
  declare the token and questionId variable in a scope accessible
  by the entire test suite
*/
let token;
let questionId;

beforeAll(async (done) => {
	const res = await request(app)
	.post('/api/v1/users/register')
	.send({
		name: `testuser${rndNum}`,
		email: `test${rndNum}@email.com`,
		password:'123456',
		fcm_token:'sss'
	});

  request(app)
    .post('/api/v1/users/login')
    .send({ 
		email: `test${rndNum}@email.com`,
		password:'123456'
	})
    .end((err, response) => {
      token = response.body.token; // save the token!
      done();
    });
});

describe('Questions Routes Test', function(){

	it('should fetch all questions', async () => {
	    const res = await request(app).get('/api/v1/questions');
	    expect(res.statusCode).toEqual(200);
	    expect(Array.isArray(res.body)).toBe(true);
	});

	it('should create new question', async () => {
	    const res = await request(app)
	      .post('/api/v1/questions')
	      .set('Authorization', `${token}`)
	      .send({
			"title": "How to log errors in test javascript",
			"description": "I am finding it difficult to log errors in this test please help me out."
		});

	    questionId = res.body._id;
	    expect(res.statusCode).toEqual(201);

	    expect(res.body).toHaveProperty('title');
	});

	it('should fetch all questions made by logged in user', async () => {
	    const res = await request(app).get('/api/v1/questions/user')
	    .set('Authorization', `${token}`);

	    expect(res.statusCode).toEqual(200);

	    expect(Array.isArray(res.body)).toBe(true);
	});

	it('should fetch single question by id', async () => {
	    const res = await request(app).get(`/api/v1/questions/${questionId}`)
	    .set('Authorization', `${token}`);
	    expect(res.statusCode).toEqual(200);
	    expect(res.body).toHaveProperty('title');
	});

	it('should give an upvote to question', async () => {
	    const res = await request(app).put(`/api/v1/questions/${questionId}/upvote`).set('Authorization', `${token}`);
	    expect(res.statusCode).toEqual(200);
	    expect(res.body).toHaveProperty('upvotes');
	});

	it('should give an downvote to question', async () => {
	    const res = await request(app).put(`/api/v1/questions/${questionId}/downvote`).set('Authorization', `${token}`);
	    expect(res.statusCode).toEqual(200);
	    expect(res.body).toHaveProperty('downvotes');
	});

	it('should update single question', async () => {
	    const res = await request(app)
	    .put(`/api/v1/questions/${questionId}`)
	    .set('Authorization', `${token}`)
	    .send({
	    	"title": "How to log errors in test javascript updated",
			"description": "I am finding it difficult to log errors in this test please help me out. updated"
	    });
	    expect(res.statusCode).toEqual(200);
	    expect(res.body).toHaveProperty('title');
	});
	
	it('should fetch specific question by title', async () => {
	    const res = await request(app)
	    .post('/api/v1/questions/search')
	    .send({
	    	search:'How to log errors in test javascript updated'
	    });
	    
	    expect(res.statusCode).toEqual(200);
	    expect(Array.isArray(res.body)).toBe(true);
	});

	it('should delete question', async () => {
	    const res = await request(app).delete(`/api/v1/questions/${questionId}`).set('Authorization', `${token}`);
	    expect(res.statusCode).toEqual(200);
	});
});