const helper = require('./test_helper')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('is id defined', async () => {

  const blogs = await helper.blogsInDb()
  //const blogs = await Blog.find({})
  /*
  api
  .get('/api/blogs')
  .expect(200)
  .expect('Content-Type', /application\/json/)
  //.expect(blogs.id).toBeDefined()
  */
 expect(blogs[0].id).toBeDefined()
  console.log(blogs)
})

test('add blog test', async () => {


  api.post('/api/blogs', async (request, Response) => {
    const body = request.body

    const newBlog = new Blog({
      content: 'testBlog',
      title: 'Testing',
      author: 'String',
      url: 'String',
      likes: 100
    })
    
  const savedBlog = await newBlog.save()
  response.json(savedBlog.toJSON())
  })
})


afterAll(() => {
  mongoose.connection.close()
})