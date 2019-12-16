const express = require('express')

const server = express()

server.use(express.json())

let projects = [
    {
        id: "0",
        title: 'Novo projeto 0',
        tasks: []
    }
]

let countRequests = 0

server.use((req, res, next) => {
    console.log(`Quantidade de requisições: ${++countRequests}`)
    next()
})

function checkTitleExists(req, res, next) {
    const { title } = req.body
    if (!title) {
        return res.json({ error: 'Title is required!' })
    }
    return next()
}

function checkProjectInArray(req, res, next) {
    const { id } = req.params
    if (!projects[id]) {
        return res.status(400).json({ error: 'Project not exists!' })
    }
    return next()
}

server.post('/projects', ((req, res) => {
    const project = req.body
    projects.push(project)
    res.json(project)
}))

server.get('/projects', ((req, res) => {
    res.json(projects)
}))

server.put('/projects/:id', checkProjectInArray, checkTitleExists, ((req, res) => {
    const { id } = req.params
    const { title } = req.body
    projects[id].title = title
    res.json(projects[id])
}))

server.delete('/projects/:id', checkProjectInArray, ((req, res) => {
    const { id } = req.params
    projects.splice(id, 1)
    res.send()
}))

server.post('/projects/:id/tasks', checkProjectInArray, checkTitleExists, ((req, res) => {
    const { id } = req.params
    const { title } = req.body
    projects[id].tasks.push(title)
    res.json(projects[id])
}))

server.listen(3001)