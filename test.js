const _ = require('lodash')

const initialBlogs = [
    { title: "React patterns", author: "Michael Chan", url: "https://reactpatterns.com/", likes: 7 }, 
    { title: "Go To Statement Considered Harmful", author: "Edsger W. Dijkstra", url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html", likes: 5 }, 
    { title: "Canonical string reduction", author: "Edsger W. Dijkstra", url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html", likes: 12 }, 
    { title: "First class tests", author: "Robert C. Martin", url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll", likes: 10 }, 
    { title: "TDD harms architecture", author: "Robert C. Martin", url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html", likes: 0 }, 
    { title: "Type wars", author: "Robert C. Martin", url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html", likes: 2 },
    { title: "A New Hope", author: "Robert C. Martin", url: "https://blog.cleancoder.com/uncle-bob/2020/04/05/ANewHope.html", likes: 102 }
]
const initialBlogs2 = [
    { title: "React patterns", author: "Michael Chan", url: "https://reactpatterns.com/", likes: 7 }, 
    { title: "Go To Statement Considered Harmful", author: "Edsger W. Dijkstra", url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html", likes: 5 }, 
    { title: "Canonical string reduction", author: "Edsger W. Dijkstra", url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html", likes: 12 }, 
    { title: "First class tests", author: "Robert C. Martin", url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll", likes: 10 }, 
    { title: "TDD harms architecture", author: "Robert C. Martin", url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html", likes: 0 }, 
    { title: "Type wars", author: "Robert C. Martin", url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html", likes: 2 },
    { title: "A New Hope", author: "Robert C. Martin", url: "https://blog.cleancoder.com/uncle-bob/2020/04/05/ANewHope.html", likes: 102 }
]

var data = [{
    "name": "jim",
    "color": "blue",
    "age": "22"
  }, {
    "name": "Sam",
    "color": "blue",
    "age": "33"
  }, {
    "name": "eddie",
    "color": "green",
    "age": "77"
  }];

//console.log(_.max(initialBlogs2))

/*
console.log(initialBlogs.map(u => {
     u.user = "ikfj98u23rfh238"
    return u
     
    }))
    const addedUser = initialBlogs.map(u => {
        u.user = "ikfj98u23rfh238"
       return u
        
       })

       console.log('USER ADDED: ',addedUser)

console.log(initialBlogs2.forEach(u => {u.user = "ikfj98u23rfh238"}))

console.log(initialBlogs)
console.log(initialBlogs2)
*/

//console.log(_.groupBy(initialBlogs2, 'author'))

//_.groupBy(initialBlogs2, 'author').map(bl => console.log(bl))



let auth = _(initialBlogs2)
.groupBy(x => x.author).value()
//.map((value, key) => ({author: key, likes: value}))



console.log(auth)



 console.log(_.chain(data)
 .groupBy("color")
 .toPairs()
 .map(item => _.zipObject(["color", "users"], item))
 .value())