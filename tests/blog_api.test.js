const helper = require('./test_helper')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

const Blog = require('../models/blog')

beforeEach(async () => {
  await Blog.deleteMany({})
  console.log('all deleted')

  const blogObjects = helper.initialBlogs.map(blog => new Blog(blog))
  const promiseArray = blogObjects.map(blog => blog.save())
  await Promise.all(promiseArray)
/*
   helper.initialBlogs.forEach(async (blog) => {
    let blogObject = new Blog(blog)
    await blogObject.save()
    
    console.log('saved')
   })
   */
  console.log('done')
})

test('a valid blog can be added ', async () => {
  const newBlog = helper.initialBlogs[2]

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

  const titles = blogsAtEnd.map(n => n.title)

})

test('a blog can be deleted', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToDelete = blogsAtStart[0]

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .expect(204)

  const blogsAtEnd = await helper.blogsInDb()

  expect(blogsAtEnd).toHaveLength(
    helper.initialBlogs.length - 1
  )

  const titles = blogsAtEnd.map(r => r.title)

  expect(titles).not.toContain(blogToDelete.title)
})

test('blog can be edited', async () => {
  const allBlogs = await helper.blogsInDb()


console.log(allBlogs[0].id)
  await api
    .put(`/api/blogs/${allBlogs[0].id}`)
    .send({ likes: 100 })
    .expect(200)
    .expect('Content-Type', /application\/json/)
})


test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('is id defined', async () => {

  const blogs = await helper.blogsInDb()
  expect(blogs[0].id).toBeDefined()
 // console.log(blogs)
})

test('blogs without likes goes to zero', async () => {
  const testBlog = {
    title: "test",
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
  }
  console.log(testBlog)

  await api
  .post('/api/blogs')
  .send(testBlog)
  .expect(200)
  .expect('Content-Type', /application\/json/)

const blogsAtEnd = await helper.blogsInDb()

expect(blogsAtEnd[blogsAtEnd.length-1].likes).toBeDefined()

})

describe('if added blog not contain title and url server res error code 400 bad req', () => {

test('title missing', async () => {

  const testBlog = {
   // title: "url missing",
    author: 'Robert C. Martin',
    url: "www.www.www"
  
  }

  await api
  .post('/api/blogs')
  .send(testBlog)
  .expect(400)

  })

  test('url missing', async () => {

    const testBlog2 = {
      title: "url missing",
      author: 'Robert C. Martin',
     // url: "www.www.www"
    
    }
  
    await api
    .post('/api/blogs')
    .send(testBlog2)
    .expect(400)
  
    })
})

afterAll(() => {
  mongoose.connection.close()
})