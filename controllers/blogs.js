const blogsRouter = require('express').Router()
const jwt = require('jsonwebtoken')

const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs.map(blog => blog.toJSON()))
})

 
  blogsRouter.post('/', async (request, response) => {

    const body = request.body
    console.log('printed TOKEN: ',request.token)
    const decodedToken = jwt.verify(request.token.substring(7), process.env.SECRET)
    if (!request.token || !decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }

    const user = await User.findById(decodedToken.id)
    if(body.likes === undefined)
    {body.likes = 0}
    if(body.title !== undefined && body.url !== undefined){

      console.log(body)
      const newBlog = new Blog(
        {
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes,
        user: user._id
        })
      const savedBlog = await newBlog.save()
      user.notes = user.blogs.concat(savedBlog._id)
      await user.save()
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
      likes: body.likes
    }
  
    Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
      .then(updatedBlog => {
        response.json(updatedBlog.toJSON())
      })
      .catch(error => next(error))
  })
  

  module.exports = blogsRouter