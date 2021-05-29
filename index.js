const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

require("dotenv").config();

const Person = require("./models/person");

const app = express();

app.use(cors());

app.use(express.static("build"));

morgan.token("body", function getId(req) {
    return JSON.stringify(req.body);
});

app.use(morgan(":method :url :status :response-time :body"));

app.use(express.json());

app.get("/api/persons", (request, response) => {
    Person.find({}).then((persons) => {
        response.json(persons);
    });
});

app.get("/info", (request, response) => {
    Person.find({}).then((persons) => {
        response.send(
            `Phonebook has info for ${persons.length} people <br> ${new Date()}`
        );
    });
});

app.get("/api/persons/:id", (request, response, next) => {
    Person.findById(request.params.id)
        .then((person) => {
            if (person) {
                response.json(person);
            } else {
                response.status(404).end();
            }
        })
        .catch((error) => {
            next(error);
        });
});

// const generateId = () => {
//     return Math.ceil(Math.random() * 500);
// };

app.post("/api/persons/", (request, response, next) => {
    const body = request.body;

    if (!body.name || !body.number) {
        return response.status(400).json({
            error: "content missing!",
        });
    }

    // let existName = false;

    // if (!existName) {
    //     return response.status(400).json({
    //         error: "name must be unique",
    //     });
    // }

    // Note.find({name:body.name})
    // .then((person) => {
    //     existName = person || false
    // });

    const newPerson = new Person({
        name: body.name,
        number: body.number,
    });

    newPerson
        .save()
        .then((person) => response.JSON())
        .then((personFormat) => {
            response.json(person);
        })
        .catch((error) => next(error));
});

app.put("/api/persons/:id", (request, response, next) => {
    const body = request.body;

    const person = {
        name: body.name,
        number: body.number,
    };

    Person.findByIdAndUpdate(request.params.id, person, { new: true })
        .then((updatedPerson) => {
            response.json(updatedPerson);
        })
        .catch((error) => next(error));
});

app.delete("/api/persons/:id", (request, response, next) => {
    Person.findByIdAndRemove(request.params.id)
        .then((result) => {
            response.status(204).end();
        })
        .catch((error) => next(error));
});

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: "unknown endpoint" });
};

// handler of requests with unknown endpoint
app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
    console.log(`linea 122`, error.message, error.name);

    if (error.name === "CastError") {
        return response.status(400).send({ error: "malformatted id" });
    } else if (error.name === "ValidationError") {
        return response.status(400).json({ error: error.message });
    }

    next(error);
};

// handler of requests with result to errors
app.use(errorHandler);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`Server running port ${PORT}`);
});
