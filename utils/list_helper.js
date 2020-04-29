const dummy = (blogs) => {
    
  return 1
  }

  const totalLikes = (blogs) => {

    const result = blogs.reduce((sum, bl)=>{

  

    return sum = sum + bl.likes

 
  },0)
  console.log(result)
return result
  }
  const maxLikes = (blogs) => {


    const likes = blogs.map(blog => {
    
      return blog.likes

    })
    console.log(Math.max(...likes))
    return Math.max(...likes)


  }

  
  module.exports = {
    dummy,
    totalLikes,
    maxLikes,
  }