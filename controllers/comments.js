const commentsRouter = require('express').Router()
const jwt = require('jsonwebtoken')

const Comment = require('../models/comment')
const Blog = require('../models/blog')

commentsRouter.get('/', async (request, response) => {
  const comments = await Comment.find({}).populate('blog', { title: 1, author: 1 })
  response.json(comments.map(comment => comment.toJSON()))
})

 
  commentsRouter.post('/', async (request, response) => {

    const body = request.body
    console.log('printed TOKEN: ',request.token)
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (!request.token || !decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }

    const blog = await Blog.findById(decodedToken.id)
    if(body.likes === undefined)
    {body.likes = 0}
    if(body.title !== undefined && body.url !== undefined){

      console.log(body)
      const newComment = new Comment(
        {
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes,
        blog: blog._id
        })
        console.log('newComment: ',newComment)
      let savedComment = await newComment.save()
      console.log('saved Comment: ',savedComment)

      let savedCommentWithBlogInfo = 
      {
        id: savedComment._id,
        title: savedComment.title,
        author: savedComment.author,
        url: savedComment.url,
        likes: savedComment.likes,
        blog: {
          id: savedComment.blog,
          title: blog.title,
          author: blog.author     
        }
      }
/*
      const savedFindedComment = await Comment.findById(savedComment._id).populate('blog', { title: 1, author: 1 })       
      console.log('Finded Comment: ',savedFindedComment)
      blog.comments = blog.comments.concat(savedFindedComment._id)
*/
      blog.comments = blog.comments.concat(savedCommentWithBlogInfo.id)

      await blog.save()
      response.status(200).json(savedCommentWithBlogInfo)
    }
    else {response.status(400).end()}
  })

  commentsRouter.delete('/:id', async (request, response) => {
    
    console.log('printed TOKEN: ',request.token)
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (!request.token || !decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }

    console.log('blogid: ', decodedToken.id)

    // blog still exists in db
    const blog = await Blog.findById(decodedToken.id)
    const comment = await Comment.findById(request.params.id)

   console.log('blog: ', blog)
    
    console.log('comment: ', comment)

    if(comment.blog && blog.id.toString()){

      
      if(decodedToken.id.toString() === comment.blog.toString()){

        await Comment.findByIdAndRemove(request.params.id)
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

  commentsRouter.put('/:id', async (request, response, next) => {
    const body = request.body

    console.log(body)
  
    const comment = {
      likes: body.likes
    }
  
   const updatedComment = await Comment.findByIdAndUpdate(request.params.id, comment, { new: true })
   .populate('blog', { title: 1, author: 1 })
   response.status(200).json(updatedComment)
  })
  

  module.exports = commentsRouter