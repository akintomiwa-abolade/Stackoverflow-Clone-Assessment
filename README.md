# HacktivOverflow

Mini StackOverflow

## Dependencies

* [Node.js](https://nodejs.org/en/download/)
* [MongoDB](https://www.mongodb.com/download-center/community)
* [MongoDb Compass](https://docs.mongodb.com/compass/current/install/)

## Environtment Variables

```
SECRET=    (**For JWT SECRET**)
MONGOLAB_URI=  (**For MonogoDB Connection**)
```

## Project Setup

```
$ npm install
$ npm run dev
```

## REST API Routes

### Authentication Routes

#### Registration
  - Description:
    - Creates a new user
  - URL:
    - `POST` `/register`
  - Body:
    - `name`: `String` (**required**)
    - `email`: `String` (**required**)
    - `password`: `String` (**required**)
    - `fcm_token`: `String` (**required**)
  - Success response: `201` Created
  ```json
    {
      "_id": "...",
      "name": "...",
      "email": "...",
      "password": "<hashed password>",
      "fcm_token": ".."
    }
  ```
  - Fail response(s):
    - `400` Bad request
    - `500` Internal Server Error

#### Login
  - Description:
    - Logs a user in
  - URL:
    - `POST` `/login`
  - Body:
    - `email`: `String` (**required**)
    - `password`: `String` (**required**)
  - Success response: `200` OK
  ```json
    {
      "token": "...",
      "name": "...",
      "email": "...",
    }
  ```
  - Fail response(s):
    - `400` Bad request
    - `500` Internal Server Error

### Question & Answer Routes

#### Create Question
  - Description:
    - Create a question
  - URL:
    - `POST` `/questions`
  - Headers:
    - `Authorization`: `String` (**required**)
  - Body:
    - `title`: `String` (**required**)
    - `description`: `String` (**required**)

  - Success response: `201` Created
  ```json
    {
      "_id": "...",
      "title": "...",
      "description": "...",
    }
  ```
  - Fail response(s):
    - `401` Unauthorized
    - `500` Internal Server Error

#### Question List
  - Description:
    - GET list of all questions
  - URL:
    - `GET` `/questions`
  - Headers:
    - `Authorization`: `String` (**required**)
  - Success response: `200` OK
  ```json
    [
      {
          "upvotes": [
              {
                  "_id": "...",
                  "name": "..."
              }
          ],
          "downvotes": [],
          "_id": "5eb467eea5fc0408d03ff67b",
          "title": "...",
          "description": "...",
          "user": {
              "_id": "...",
              "name": "..."
          },
          "createdAt": "2020-05-07T19:56:30.355Z",
          "totalVote": 1,
          "__v": 0
      }
    ]
  ```
  - Fail response(s):
    - `401` Unauthorized
    - `500` Internal Server Error

#### Find one question
  - Description:
    - Find one question
  - URL:
    - `GET` `/questions/:questionId`
  - Headers:
    - `Authorization`: `String` (**required**)
  - Success response: `200` OK
  ```json
    {
      "upvotes": [
          {
              "_id": "...",
              "name": "..."
          }
      ],
      "downvotes": [],
      "_id": "5eb467eea5fc0408d03ff67b",
      "title": "...",
      "description": "...",
      "user": {
          "_id": "...",
          "name": "..."
      },
      "createdAt": "2020-05-07T19:56:30.355Z",
      "totalVote": 1,
      "__v": 0
    }
  ```
  - Fail response(s):
    - `401` Unauthorized
    - `500` Internal Server Error

#### Fetch all loggedin user questions
  - Description:
    - Fetch all questions created by loggedin user
  - URL:
    - `GET` `/questions/user`
  - Headers:
    - `Authorization`: `String` (**required**)
  - Success response: `200` OK
  ```json
  [

    {
      "upvotes": [
          {
              "_id": "...",
              "name": "..."
          }
      ],
      "downvotes": [],
      "_id": "...",
      "title": "...",
      "description": "...",
      "user": {
          "_id": "...",
          "name": "..."
      },
      "createdAt": "2020-05-07T19:56:30.355Z",
      "totalVote": 1,
      "__v": 0
    },
    {
      "upvotes": [
          {
              "_id": "...",
              "name": "..."
          }
      ],
      "downvotes": [],
      "_id": "...",
      "title": "...",
      "description": "...",
      "user": {
          "_id": "...",
          "name": "..."
      },
      "createdAt": "2020-05-07T19:56:30.355Z",
      "totalVote": 1,
      "__v": 0
    }
  ]
  ```
  - Fail response(s):
    - `401` Unauthorized
    - `500` Internal Server Error

#### Subscribe to Question
  - Description:
    - Subscribe to a question
  - URL:
    - `POST` `/questions/subscribe`
  - Headers:
    - `Authorization`: `String` (**required**)
  - Body:
    - `questionId`: `Integer` (**required**)

  - Success response: `201` Created
  ```json
    {
      "error": false,
      "message": "Subscription Successful."
    }
  ```
  - Fail response(s):
    - `401` Unauthorized
    - `500` Internal Server Error

#### Search for Question
  - Description:
    - Search for a question
  - URL:
    - `POST` `/questions/search`
  - Headers:
    - `Authorization`: `String` (**required**)
  - Body:
    - `search`: `String` (**required**)

  - Success response: `200` Created
  ```json
    {
        "upvotes": [
            {
                "_id": "...",
                "name": "..."
            }
        ],
        "downvotes": [],
        "_id": "...",
        "title": "...",
        "description": "...",
        "user": {
            "_id": "...",
            "name": "..."
        },
        "createdAt": "2020-05-07T19:56:30.355Z",
        "totalVote": 1,
        "__v": 0
    }
  ```
  - Fail response(s):
    - `401` Unauthorized
    - `500` Internal Server Error

#### Update one question
  - Description:
    - Update one question
  - URL:
    - `PUT` `/questions/:questionId`
  - Headers:
    - `Authorization`: `String` (**required**)
  - Body:
    - `title`: `String` (**required**)
    - `description`: `String` (**required**)

  - Success response: `200` OK
  ```json
    {
      "upvotes": [
          {
              "_id": "...",
              "name": "..."
          }
      ],
      "downvotes": [],
      "_id": "...",
      "title": "...",
      "description": "...",
      "user": {
          "_id": "...",
          "name": "..."
      },
      "createdAt": "2020-05-07T19:56:30.355Z",
      "totalVote": 1,
      "__v": 0
    }
  ```
  - Fail response(s):
    - `401` Unauthorized
    - `500` Internal Server Error

#### Upvote one question
  - Description:
    - Upvote one question
  - URL:
    - `PUT` `/questions/:questionId/upvote`
  - Headers:
    - `Authorization`: `String` (**required**)
  - Success response: `200` OK
  ```json
    {
      "upvotes": [
          {
              "_id": "...",
              "name": "..."
          },
          {
              "_id": "...",
              "name": "..."
          }
      ],
      "downvotes": [],
      "_id": "...",
      "title": "...",
      "description": "...",
      "user": {
          "_id": "...",
          "name": "..."
      },
      "createdAt": "2020-05-07T19:56:30.355Z",
      "totalVote": 2,
      "__v": 0
    }
  ```
  - Fail response(s):
    - `401` Unauthorized
    - `500` Internal Server Error

#### Downvote one question
  - Description:
    - Downvote one question
  - URL:
    - `PUT` `/questions/:questionId/upvote`
  - Headers:
    - `Authorization`: `String` (**required**)
  - Success response: `200` OK
  ```json
    {
      "upvotes": [
          {
              "_id": "...",
              "name": "..."
          },
          {
              "_id": "...",
              "name": "..."
          }
      ],
      "downvotes": [
        {
            "_id": "...",
            "name": "..."
        }
      ],
      "_id": "...",
      "title": "...",
      "description": "...",
      "user": {
          "_id": "...",
          "name": "..."
      },
      "createdAt": "2020-05-07T19:56:30.355Z",
      "totalVote": 2,
      "__v": 0
    }
  ```
  - Fail response(s):
    - `401` Unauthorized
    - `500` Internal Server Error

#### Delete one question
  - Description:
    - Delete one question
  - URL:
    - `DELETE` `/questions/:questionId`
  - Headers:
    - `Authorization`: `String` (**required**)
  - Success response: `200` OK
  ```json
    {
      "message": "Successfully deleted question.",
      "id": "<questionId>",
    }
  ```
  - Fail response(s):
    - `401` Unauthorized
    - `500` Internal Server Error

#### Answer Question
  - Description:
    - Answer a question
  - URL:
    - `POST` `/answers`
  - Headers:
    - `Authorization`: `String` (**required**)
  - Body:
    - `title`: `String` (**required**)
    - `description`: `String` (**required**)
    - `question`: `String` (**required**)

  - Success response: `201` Created
  ```json
    {
      "upvotes": [
          "5eb33ef1abc19614a45e64d6"
      ],
      "downvotes": [],
      "_id": "5eb474156c69f32540d76477",
      "title": "How to log errors in javascript",
      "description": "make use of the console.error() or console.log()  method.",
      "question": "5eb3417c697524105cd1e785",
      "user": "5eb33ef1abc19614a45e64d6",
      "createdAt": "2020-05-07T20:48:21.195Z",
      "totalVote": 1,
      "__v": 0
    }
  ```
  - Fail response(s):
    - `401` Unauthorized
    - `500` Internal Server Error

#### Find specific question answers
  - Description:
    - Find all answers associated to question
  - URL:
    - `GET` `/answers/question/:questionId`
  - Success response: `200` OK
  ```json
  [
    {
        "upvotes": [
            {
                "_id": "5eb338416173480834f7d5db",
                "name": "jhon doe"
            }
        ],
        "downvotes": [],
        "_id": "5eb34385b2a56a1688c5ca92",
        "title": "How to log errors in javascript",
        "description": "make use of the console.log() method.",
        "question": "5eb3417c697524105cd1e785",
        "user": {
            "_id": "5eb338416173480834f7d5db",
            "name": "jhon doe"
        },
        "createdAt": "2020-05-06T23:08:53.804Z",
        "totalVote": 1,
        "__v": 0
    },
    {
        "upvotes": [
            {
                "_id": "..",
                "name": "..."
            }
        ],
        "downvotes": [],
        "_id": "...",
        "title": "...",
        "description": "...",
        "question": "...",
        "user": {
            "_id": "...",
            "name": "..."
        },
        "createdAt": "2020-05-06T23:23:50.957Z",
        "totalVote": 1,
        "__v": 0
    },
    {
        "upvotes": [
            {
                "_id": "...",
                "name": "..."
            }
        ],
        "downvotes": [],
        "_id": "...",
        "title": "...",
        "description": "...",
        "question": "...",
        "user": {
            "_id": "...",
            "name": "..."
        },
        "createdAt": "2020-05-07T12:46:21.568Z",
        "totalVote": 1,
        "__v": 0
    }
  ]
    
  ```
  - Fail response(s):
    - `401` Unauthorized
    - `500` Internal Server Error

#### Fetch all loggedin user questions answered
  - Description:
    - Fetch all questions answered by loggedin user
  - URL:
    - `GET` `/answers/user`
  - Headers:
    - `Authorization`: `String` (**required**)
  - Success response: `200` OK
  ```json
    [
      {
          "upvotes": [
              "5eb33ef1abc19614a45e64d6"
          ],
          "downvotes": [],
          "_id": "5eb4031d1e6b5022d44148e0",
          "title": "How to log errors in javascript 1",
          "description": "make use of the console.error() or console.log() or console.table() method.",
          "question": {
              "upvotes": [
                  "5eb338416173480834f7d5db",
                  "5eb33ef1abc19614a45e64d6"
              ],
              "downvotes": [],
              "_id": "5eb3417c697524105cd1e785",
              "title": "How to log errors in javascript",
              "description": "I am finding it difficult to log errors please help me out.",
              "user": "5eb338416173480834f7d5db",
              "createdAt": "2020-05-06T23:00:12.034Z",
              "totalVote": 2,
              "__v": 0
          },
          "user": {
              "_id": "5eb33ef1abc19614a45e64d6",
              "name": "francis",
              "email": "francis@gmail.com",
              "password": "$2a$10$vIEpkmvWgPvRJ0ic//eXb.it2m5XXgPb7g7ABalmJmfFiv4fFKUqa",
              "fcm_token": "AAAAv4S2FIE:APA91bEca7xdX_e7NYUk2X4dhr1xhVPjQPqX5V0nKwfGDl9JwOXXwuv69JALuNTqZFkieNcVeTaTaUYEnCelD3KDvu_nmQ11YW6-eGZ4DAQm1mwKjqxiZ9NO6WWbVDVJb3G2GEM0j3Il",
              "__v": 0
          },
          "createdAt": "2020-05-07T12:46:21.568Z",
          "totalVote": 1,
          "__v": 0
      },
      {
          "upvotes": [
              "5eb33ef1abc19614a45e64d6"
          ],
          "downvotes": [],
          "_id": "5eb474156c69f32540d76477",
          "title": "How to log errors in javascript 2",
          "description": "make use of the console.error() or console.log() method.",
          "question": {
              "upvotes": [
                  "5eb338416173480834f7d5db",
                  "5eb33ef1abc19614a45e64d6"
              ],
              "downvotes": [],
              "_id": "5eb3417c697524105cd1e785",
              "title": "How to log errors in javascript",
              "description": "I am finding it difficult to log errors please help me out.",
              "user": "5eb338416173480834f7d5db",
              "createdAt": "2020-05-06T23:00:12.034Z",
              "totalVote": 2,
              "__v": 0
          },
          "user": {
              "_id": "5eb33ef1abc19614a45e64d6",
              "name": "johndoe",
              "email": "johndoe@email.com",
              "password": "$2a$10$vIEpkmvWgPvRJ0ic//eXb.it2m5XXgPb7g7ABalmJmfFiv4fFKUqa",
              "fcm_token": "AAAAv4S2FIE:APA91bEca7xdX_e7NYUk2X4dhr1xhVPjQPqX5V0nKwfGDl9JwOXXwuv69JALuNTqZFkieNcVeTaTaUYEnCelD3KDvu_nmQ11YW6-eGZ4DAQm1mwKjqxiZ9NO6WWbVDVJb3G2GEM0j3Il",
              "__v": 0
          },
          "createdAt": "2020-05-07T20:48:21.195Z",
          "totalVote": 1,
          "__v": 0
      }
    ]
  ```
  - Fail response(s):
    - `401` Unauthorized
    - `500` Internal Server Error

#### Find one specific answer
  - Description:
    - Find one answer using id
  - URL:
    - `GET` `/answers/:answerId`
  - Success response: `200` OK
  ```json
    {
      "upvotes": [
          "5eb33ef1abc19614a45e64d6"
      ],
      "downvotes": [],
      "_id": "5eb347063bc49c0a501022e8",
      "title": "How to log errors in javascript2",
      "description": "make use of the console.error() or console.log() method.",
      "question": {
          "upvotes": [
              "5eb338416173480834f7d5db",
              "5eb33ef1abc19614a45e64d6"
          ],
          "downvotes": [],
          "_id": "5eb3417c697524105cd1e785",
          "title": "How to log errors in javascript",
          "description": "I am finding it difficult to log errors please help me out.",
          "user": "5eb338416173480834f7d5db",
          "createdAt": "2020-05-06T23:00:12.034Z",
          "totalVote": 2,
          "__v": 0
      },
      "user": {
          "_id": "5eb33ef1abc19614a45e64d6",
          "name": "johndoe",
          "email": "johndoe@gmail.com",
          "password": "$2a$10$vIEpkmvWgPvRJ0ic//eXb.it2m5XXgPb7g7ABalmJmfFiv4fFKUqa",
          "fcm_token": "AAAAv4S2FIE:APA91bEca7xdX_e7NYUk2X4dhr1xhVPjQPqX5V0nKwfGDl9JwOXXwuv69JALuNTqZFkieNcVeTaTaUYEnCelD3KDvu_nmQ11YW6-eGZ4DAQm1mwKjqxiZ9NO6WWbVDVJb3G2GEM0j3Il",
          "__v": 0
      },
      "createdAt": "2020-05-06T23:23:50.957Z",
      "totalVote": 1,
      "__v": 0
    }
  ```
  - Fail response(s):
    - `401` Unauthorized
    - `500` Internal Server Error

#### Upvote one answer
  - Description:
    - Upvote one question
  - URL:
    - `PUT` `/answers/:answerId/upvote`
  - Headers:
    - `Authorization`: `String` (**required**)
  - Success response: `200` OK
  ```json
    {
      "upvotes": [
          "5eb33ef1abc19614a45e64d6"
      ],
      "downvotes": [],
      "_id": "5eb347063bc49c0a501022e8",
      "title": "How to log errors in javascript2",
      "description": "make use of the console.error() or console.log() method.",
      "question": "5eb3417c697524105cd1e785",
      "user": "5eb33ef1abc19614a45e64d6",
      "createdAt": "2020-05-06T23:23:50.957Z",
      "totalVote": 1,
      "__v": 0
    }
  ```
  - Fail response(s):
    - `401` Unauthorized
    - `500` Internal Server Error

#### Downvote one answer
  - Description:
    - Downvote one answer
  - URL:
    - `PUT` `/answers/:answerId/downvote`
  - Headers:
    - `Authorization`: `String` (**required**)
  - Success response: `200` OK
  ```json
    {
      "upvotes": [
          "..."
      ],
      "downvotes": [
          "..."
      ],
      "_id": "5eb347063bc49c0a501022e8",
      "title": "How to log errors in javascript2",
      "description": "make use of the console.error() or console.log() method.",
      "question": "5eb3417c697524105cd1e785",
      "user": "5eb33ef1abc19614a45e64d6",
      "createdAt": "2020-05-06T23:23:50.957Z",
      "totalVote": 1,
      "__v": 0
    }
  ```
  - Fail response(s):
    - `401` Unauthorized
    - `500` Internal Server Error

#### Update answer
  - Description:
    - Update answer to a question
  - URL:
    - `PUT` `/answers/:answerId`
  - Headers:
    - `Authorization`: `String` (**required**)
  - Body:
    - `title`: `String` (**required**)
    - `description`: `String` (**required**)
    - `question`: `String` (**required**)

  - Success response: `200` Created
  ```json
    {
      "upvotes": [
          "5eb33ef1abc19614a45e64d6"
      ],
      "downvotes": [],
      "_id": "5eb474156c69f32540d76477",
      "title": "How to log errors in javascript",
      "description": "make use of the console.error() or console.log()  method.",
      "question": "5eb3417c697524105cd1e785",
      "user": "5eb33ef1abc19614a45e64d6",
      "createdAt": "2020-05-07T20:48:21.195Z",
      "totalVote": 1,
      "__v": 0
    }
  ```
  - Fail response(s):
    - `401` Unauthorized
    - `500` Internal Server Error

#### Search for Answer
  - Description:
    - Search for answer
  - URL:
    - `POST` `/answers/search`
  - Headers:
    - `Authorization`: `String` (**required**)
  - Body:
    - `search`: `String` (**required**)

  - Success response: `200` Created
  ```json
    [
      {
          "upvotes": [
              "5eb33ef1abc19614a45e64d6"
          ],
          "downvotes": [],
          "_id": "5eb474156c69f32540d76477",
          "title": "How to log errors in javascript 3",
          "description": "make use of the console.error() or console.log() or console.table() method.",
          "question": "5eb3417c697524105cd1e785",
          "user": "5eb33ef1abc19614a45e64d6",
          "createdAt": "2020-05-07T20:48:21.195Z",
          "totalVote": 1,
          "__v": 0
      }
    ]
  ```
  - Fail response(s):
    - `401` Unauthorized
    - `500` Internal Server Error

#### Delete Answer
  - Description:
    - Delete one answer
  - URL:
    - `DELETE` `/answers/:answersId`
  - Headers:
    - `Authorization`: `String` (**required**)
  - Success response: `200` OK
  ```json
    {
      "message": "Successfully deleted answer.",
      "id": "<questionId>",
    }
  ```
  - Fail response(s):
    - `401` Unauthorized
    - `500` Internal Server Error

### Error statuses

```json
  {
    "message": "<error message>"
  }
```
  - `400` Bad Request
  <div style="text-align: justify"> The request cannot be fulfilled due to bad syntax. General error when fulfilling the request would cause an invalid state. Domain validation errors, missing data, etc. are some examples. </div>
  - `401` Unauthorized
  <div style="text-align: justify"> The request requires user authentication. If the request already included Authorization credentials, then this response indicates that authorization has been refused for those credentials. This happens when authentication is possible but has failed or not yet been provided. </div>
  - `404` Not Found 😥
  <div style="text-align: justify"> The server has not found anything matching the Request-URI or the requested resource is not found. </div>
  - `500` Internal Server Error
  <div style="text-align: justify"> The server encountered an unexpected condition which prevented it from fulfilling the request. </div>
