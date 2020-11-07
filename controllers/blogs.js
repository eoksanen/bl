const blogsRouter = require('express').Router()
const jwt = require('jsonwebtoken')

const Blog = require('../models/blog')
const User = require('../models/user')
const Comment = require('../models/comment')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 }).populate('comments', { comment: 1 } )
  response.json(blogs.map(blog => blog.toJSON()))
})

 
blogsRouter.post('/:id/comments', async (request, response) => {

  const body = request.body
  console.log(request.params.id)

  const blog = await Blog.findById(request.params.id)

  if(body.comment !== undefined) {

    console.log(body)
    const newComment = new Comment(
      {
      comment: body.comment,
      blog: blog._id
      })
      console.log('newComment: ',newComment)
    let savedComment = await newComment.save()
    console.log('saved Comment: ',savedComment)

    const commentToResponce = {
      id: savedComment._id,
      comment: savedComment.comment,
      blog: savedComment.blog
    }

    blog.comments = blog.comments.concat(commentToResponce.id)

    await blog.save()
    response.status(200).json(commentToResponce)
  }
  else {response.status(400).end()}
})

blogsRouter.delete('/:id/comments/cmid', async (request, response) => {
    
  console.log('printed TOKEN: ',request.token)
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!request.token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  console.log('userid: ', decodedToken.id)

  // user still exists in db
  const user = await User.findById(decodedToken.id)
  const blog = await Blog.findById(request.params.id)

 console.log('user: ', user)
  
  console.log('blog: ', blog)

  if(blog.user && user.id.toString()){

    
    if(decodedToken.id.toString() === blog.user.toString()){

      await Blog.findByIdAndRemove(request.params.id)
      response.status(204).end()
  }
  else{
    response.status(401).end('do not permit to delete')
  }
}
else{
  response.status(400).end('do not permit to delete')
}
})
  

  blogsRouter.post('/', async (request, response) => {

    const body = request.body
    console.log('printed TOKEN: ',request.token)
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
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
      let savedBlog = await newBlog.save()
      console.log('saved Blog: ',savedBlog)

      let savedBlogWithUserInfo = 
      {
        comments: [{comment: 'test comment from backend'}],
        id: savedBlog._id,
        title: savedBlog.title,
        author: savedBlog.author,
        url: savedBlog.url,
        likes: savedBlog.likes,
        user: {
          id: savedBlog.user,
          username: user.username,
          name: user.name     
        }
      }
/*
      const savedFindedBlog = await Blog.findById(savedBlog._id).populate('user', { username: 1, name: 1 })       
      console.log('Finded BLOG: ',savedFindedBlog)
      user.blogs = user.blogs.concat(savedFindedBlog._id)
*/
      user.blogs = user.blogs.concat(savedBlogWithUserInfo.id)

      await user.save()
      console.log('SAVEDBLOGWITHUSERINFO ', savedBlogWithUserInfo)
      response.status(200).json(savedBlogWithUserInfo)
    }
    else {response.status(400).end()}
  })

  blogsRouter.delete('/:id', async (request, response) => {
    
    console.log('printed TOKEN: ',request.token)
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (!request.token || !decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }

    console.log('userid: ', decodedToken.id)

    // user still exists in db
    const user = await User.findById(decodedToken.id)
    const blog = await Blog.findById(request.params.id)

   console.log('user: ', user)
    
    console.log('blog: ', blog)

    if(blog.user && user.id){

      
      if(decodedToken.id.toString() === blog.user.toString()){

        await Blog.findByIdAndRemove(request.params.id)
        response.status(204).end()
    }
    else{
      response.status(401).end('do not permit to delete')
    }
  }
  else{
    response.status(400).end('do not permit to delete')
  }
})

  blogsRouter.put('/:id', async (request, response, next) => {
    const body = request.body

    console.log(body)
  
    const blog = {
      likes: body.likes
    }
  
   const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true, useFindAndModify: false })
   .populate('user', { username: 1, name: 1 })
   response.status(200).json(updatedBlog)
  })
  

  module.exports = blogsRouter