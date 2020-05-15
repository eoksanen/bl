const Blog = require('../models/blog')
const User = require('../models/user')

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InJvb3QiLCJpZCI6IjVlYmU3NmIwNmY3NjYxMTI2NGQwMDM5NCIsImlhdCI6MTU4OTU0MTc3MH0.ZpDnV5w1JdmXVy74bXOFQMEz4zo9c4KieUA4AKdRPXk"
const root = {
  username: "root",
  password: "sekret"
}

const initialBlogs = [
    { title: "React patterns", author: "Michael Chan", url: "https://reactpatterns.com/", likes: 7 }, 
    { title: "Go To Statement Considered Harmful", author: "Edsger W. Dijkstra", url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html", likes: 5 }, 
    { title: "Canonical string reduction", author: "Edsger W. Dijkstra", url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html", likes: 12 }, 
    { title: "First class tests", author: "Robert C. Martin", url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll", likes: 10 }, 
    { title: "TDD harms architecture", author: "Robert C. Martin", url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html", likes: 0 }, 
    { title: "Type wars", author: "Robert C. Martin", url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html", likes: 2 },
    { title: "A New Hope", author: "Robert C. Martin", url: "https://blog.cleancoder.com/uncle-bob/2020/04/05/ANewHope.html", likes: 102 }
]

const nonExistingId = async () => {
  const blog = new blog({ title: 'willremovethissoon' })
  await blog.save()
  await blog.remove()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(user => user.toJSON())
}

module.exports = {
  initialBlogs, nonExistingId, blogsInDb, usersInDb,
}