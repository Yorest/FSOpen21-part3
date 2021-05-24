const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const app = express();

let persons = [
    {
        id: 1,
        name: "Arto Hellas",
        number: "040-123456",
    },
    {
        id: 2,
        name: "Ada Lovalace",
        number: "39-44-5323523",
    },
    {
        id: 3,
        name: "Dan Abramov",
        number: "12-43-434345",
    },
    {
        id: 4,
        name: "Mary Poppendick",
        number: "39-23-6423112",
    },
];

app.use(cors());

app.use(express.static("build"));

morgan.token("body", function getId(req) {
    return JSON.stringify(req.body);
});

app.use(morgan(":method :url :status :response-time :body"));

app.use(express.json());

app.get("/api/persons", (request, response) => {
    response.json(persons);
});

app.get("/info", (request, response) => {
    response.send(
        `Phonebook has info for ${persons.length} people <br> ${new Date()}`
    );
});

app.get("/api/persons/:id", (request, response) => {
    const id = Number(request.params.id);
    const person = persons.find((person) => person.id === id);

    if (person) {
        response.json(person);
    } else {
        response.status(404).end();
    }
});

const generateId = () => {
    return Math.ceil(Math.random() * 500);
};

app.post("/api/persons/", (request, response) => {
    const body = request.body;

    if (!body.name || !body.number) {
        return response.status(400).json({
            error: "content missing",
        });
    }

    const existName = persons.find((person) => person.name === body.name);

    if (!existName) {
        return response.status(400).json({
            error: "name must be unique",
        });
    }

    const newPerson = {
        id: generateId(),
        name: body.name,
        number: body.number,
    };

    persons = [...persons, newPerson];

    response.json(persons);
});

app.delete("/api/persons/:id", (request, response) => {
    const id = Number(request.params.id);
    persons = persons.filter((person) => person.id !== id);

    response.status(204).end();
});

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`Server running port ${PORT}`);
});
