const blogsRouter = require('express').Router()

const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs.map(blog => blog.toJSON()))
})
  
  blogsRouter.post('/', async (request, response) => {

    const body = request.body
    if(body.likes === undefined)
    {body.likes = 0}
    if(body.title !== undefined && body.url !== undefined){

      console.log(body)
      const newBlog = new Blog(body)
      const savedBlog = await newBlog.save()
      response.status(200).json(savedBlog.toJSON)
    }
    else {response.status(400).end()}
  })

  blogsRouter.delete('/:id', async (request, response) => {
    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()
  })

  blogsRouter.put('/:id', (request, response, next) => {
    const body = request.body

    console.log(body)
  
    const blog = {
      likes: body.likes,
    }
  
    Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
      .then(updatedBlog => {
        response.json(updatedBlog.toJSON())
      })
      .catch(error => next(error))
  })
  

  module.exports = blogsRouter