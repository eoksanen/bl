const commentsRouter = require('express').Router()
const jwt = require('jsonwebtoken')

const Comment = require('../models/comment')


  commentsRouter.delete('/:id', async (request, response) => {
    
    console.log('printed TOKEN: ',request.token)
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (!request.token || !decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }

    console.log('Userid: ', decodedToken.id)

    // blog still exists in db
    const comment = await Comment.findById(request.params.id)
   
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
}
  )
  module.exports = commentsRouter