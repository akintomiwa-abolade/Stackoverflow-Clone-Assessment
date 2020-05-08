const request = require('supertest');
const app = require('../test_server');

/*
  declare the token and questionId variable in a scope accessible
  by the entire test suite
*/
let token;
let questionId;

beforeAll(async (done) => {
	const res = await request(app)
	.post('/users/register')
	.send({
		name: 'testuser1',
		email: 'test1@email.com',
		password:'123456',
		fcm_token:'sss'
	});

  request(app)
    .post('/users/login')
    .send({ 
		email: 'test1@email.com',
		password:'123456'
	})
    .end((err, response) => {
      token = response.body.token; // save the token!
      done();
    });
});

describe('Questions Routes Test', function(){

	it('should fetch all questions', async () => {
	    const res = await request(app).get('/questions');
	    expect(res.statusCode).toEqual(200);
	    expect(Array.isArray(res.body)).toBe(true);
	});

	it('should create new question', async () => {
	    const res = await request(app)
	      .post('/questions')
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
	    const res = await request(app).get('/questions/user')
	    .set('Authorization', `${token}`);

	    expect(res.statusCode).toEqual(200);

	    expect(Array.isArray(res.body)).toBe(true);
	});

	it('should fetch single question by id', async () => {
	    const res = await request(app).get(`/questions/${questionId}`)
	    .set('Authorization', `${token}`);
	    expect(res.statusCode).toEqual(200);
	    expect(res.body).toHaveProperty('title');
	});

	it('should give an upvote to question', async () => {
	    const res = await request(app).put(`/questions/${questionId}/upvote`).set('Authorization', `${token}`);
	    expect(res.statusCode).toEqual(200);
	    expect(res.body).toHaveProperty('upvotes');
	});

	it('should give an downvote to question', async () => {
	    const res = await request(app).put(`/questions/${questionId}/downvote`).set('Authorization', `${token}`);
	    expect(res.statusCode).toEqual(200);
	    expect(res.body).toHaveProperty('downvotes');
	});

	it('should update single question', async () => {
	    const res = await request(app)
	    .put(`/questions/${questionId}`)
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
	    .post('/questions/search')
	    .send({
	    	search:'How to log errors in test javascript updated'
	    });
	    
	    expect(res.statusCode).toEqual(200);
	    expect(Array.isArray(res.body)).toBe(true);
	});

	it('should delete question', async () => {
	    const res = await request(app).delete(`/questions/${questionId}`).set('Authorization', `${token}`);
	    expect(res.statusCode).toEqual(200);
	});
});