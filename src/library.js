const http = require ("node:http")

const IO = require("./utils/io")
const Books = new IO ("src/database/books.json")
const Book = require("./models/model")
const Parse = require("./utils/parse")


const server = async (req, res) => {
    res.setHeader ("Content-Type", "application/json")

    if(req.url == "/books" && req.method == "GET"){
        const data = await Books.read()
        const finalData = data.sort((a,b) => a.name.localeCompare(b.name))
        res.writeHead(200)
        return res.end(JSON.stringify(data))
    }
    else if (req.url == "/books/getByName" && req.method == "POST"){
        const {name} = await Parse(req) 
        const data = await Books.read()
        const foundData = data.find((book) => book.name == name)
        if (!foundData) {
            res.writeHead(404)
            return res.end(JSON.stringify({message : "Book not found"}))
        }
        res.writeHead(200)
        return res.end(JSON.stringify(foundData))
    }
    else if(req.url == "/books/getByAuthor" && req.method == "POST"){
        const {author} = await Parse(req)
        const data = await Books.read()
        const foundData = data.filter((book) => book.author == author)
        if (foundData.length == 0) {
            res.writeHead(404)
            return res.end(JSON.stringify({message: "Book not found!"}))
        }
        res.writeHead(200)
        return res.end(JSON.stringify(foundData))
    }
    else if(req.url == "/books/getByGenre" && req.method == "POST"){
        const {genre} = await Parse(req)
        const data = await Books.read()
        const foundData = data.filter((book) => book.genre = genre)
        if(foundData.length == 0){
            res.writeHead(404)
            return res.end(JSON.stringify({message: "Book not found!"}))
        }
        res.writeHead(200)
        return res.end(JSON.stringify(foundData))
    }
    else if(req.url == "/books/add" && req.method == "POST"){
        const {name, author, yearPublished, genre} = await Parse(req)
        const data = await Books.read()
        const id = (Number(data[data.length - 1]?.id) || 0) + 1;
        const newBook = new Book(id, name, author, yearPublished, genre)
        const totalData = data.length ? [...data, newBook] : [newBook]
        res.writeHead(201)
        Books.write(totalData)
        return res.end(JSON.stringify({message: "New Book Added!"}))
   }
   else if(req.url == "/books/edit" && req.method == "PUT"){
        const {name} = await Parse(req)
        const data = await Books.read()
        const updatedData = data.find((book) => book.name == name ? {...book, name, author, yearPublished, genre} : book)
        res.writeHead(201)
        Books.write(updatedData)
        return res.end(JSON.stringify({message: "Book edited"}))

   }
   else if(req.url == "/books/delete" && req.method == "DELETE"){
       const {name} = await Parse(req)
       const data = await Books.read()
       const filteredData = data.filter((book) => book.name !== name)
       res.writeHead(201) 
       Books.write(filteredData)
       return res.end(JSON.stringify({message: "Book successfully deleted!"}))
   }
   else{
    res.writeHead(404)
    return res.end("Route not found!")
   }
}

http.createServer(server).listen(1111, () => {
    console.log("Server is running on port 1111");
})