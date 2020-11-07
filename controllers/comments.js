const commentsRouter = require('express').Router()
const jwt = require('jsonwebtoken')

const Comment = require('../models/comment')
const User = require('../models/user')
const Blog = require('../models/blog')


  commentsRouter.delete('/:blog_id/:comment_id', async (request, response) => {
    
    console.log('printed TOKEN: ',request.token)
    console.log('BLOG ID ', request.params.blog_id)
    console.log('COMMENT ID', request.params.comment_id)
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (!request.token || !decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }

    console.log('Userid: ', decodedToken.id)

    // blog, user, comment still exists in db
    const user = await User.findById(decodedToken.id)
    const blog = await Blog.findById(request.params.blog_id)
    const comment = await Comment.findById(request.params.comment_id)
   
    console.log('comment: ', comment)

    console.log('user: ', user)
    
    console.log('blog: ', blog)

    if(blog.user && user.id){

      
      if(decodedToken.id.toString() === blog.user.toString()){

        await Comment.findByIdAndRemove(request.params.comment_id)
        response.status(204).end()
    }
    else{
      response.status(401).end('do not permit to delete')
    }
  }
  else{
    response.status(400).end('do not permit to delete')
  }
}
  )
  module.exports = commentsRouter