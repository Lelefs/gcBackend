const express = require("express");
const cors = require("cors");
const { uuid, isUuid } = require('uuidv4');

const app = express();

app.use(cors());
app.use(express.json());

function parseStringAsArray(arrayAsString) {
    return arrayAsString.split(',').map(tech => tech.trim());
};

const repositories = [];

function validateRepositoryId(req, res, next) {
    const { id } = req.params;

    if (!isUuid(id)) {
        return res.status(400).json({ error: "Invalid repository ID." });
    }

    return next();
};

app.use('/repositories/:id', validateRepositoryId);

app.get("/repositories", (request, response) => {
    const results = repositories;

    return response.json(results);
});

app.post("/repositories", (request, response) => {
    const { title, url, techs } = request.body;

    const techsArray = parseStringAsArray(techs);

    const repository = { id: uuid(), title, url, techs: techsArray, likes: 0 };

    repositories.push(repository);

    return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
    const { id } = request.params;
    const { title, url, techs } = request.body;

    const repIndex = repositories.findIndex(p => p.id === id );
    const rep = repositories.find(r => r.id === id);

    if (!rep) {
        return response.status(400).json({ error: "Repository not found." });
    }

    const techsArray = parseStringAsArray(techs);

    const repository = { id, title, url, techs: techsArray, likes: rep.likes };

    repositories[repIndex] = repository

    return response.json(repository);
});

app.delete("/repositories/:id", (req, res) => {
    const { id } = req.params;

    const repIndex = repositories.findIndex(p => p.id === id );

    if (repIndex < 0) {
        return res.status(400).json({ error: "Repository not found." });
    }

    repositories.splice(repIndex, 1);

    return res.status(204).send();
});

app.post("/repositories/:id/like", (req, res) => {
    const { id } = req.params;

    const rep = repositories.find(r => r.id === id);

    if (!rep) {
        return res.status(400).json({ error: "Repository not found." });
    }

    rep.likes++;

    return res.json(rep);
});

module.exports = app;