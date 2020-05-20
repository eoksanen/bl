const helper = require('./test_helper')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

const Blog = require('../models/blog')

let token;

beforeAll((done) => {
  api
    .post('/api/login')
    .send(
    //helper.root
     {      
      username: 'root',
      password: 'sekret', 
    }
    )
    .end((err, response) => {
      console.log('server response: ', response)
      token = response.body.token; // save the token!
      console.log('res TOKEN: ', token)
      done();
    });
});


beforeEach(async () => {
  await Blog.deleteMany({})
  console.log('all deleted')


  const userIdAdded = helper.initialBlogs.map(bl => {
    bl.user = "5ebe76b06f76611264d00394"
    return bl
  })
  const blogObjects = userIdAdded.map(blog => new Blog(blog))
  const promiseArray = blogObjects.map(blog => blog.save())
  await Promise.all(promiseArray)

  })
  
test('a valid blog can be added ', async () => {
  const newBlog = helper.initialBlogs[2]

  await api
    .post('/api/blogs')
    .send(newBlog)
    .set('Authorization', token)
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
    .set('Authorization', token)
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
    .set('Authorization', token)
    .send({ likes: 100 })
    .expect(200)
    .expect('Content-Type', /application\/json/)
})


test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .set('Authorization', token)
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
  .set('Authorization', token)
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
  .set('Authorization', token)
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
    .set('Authorization', token)
    .send(testBlog2)
    .expect(400)
  
    })
})

afterAll(() => {
  mongoose.connection.close()
})