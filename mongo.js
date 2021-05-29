const mongoose = require("mongoose");

if (process.argv.length < 3) {
    console.log(
        "Please provide the password as an argument: node mongo.js <password>"
    );
    process.exit(1);
}

const hasData = process.argv.length > 3 || false;

const password = process.argv[2];
const name = process.argv[3] || "";
const numberphone = process.argv[4] || "";

const url = `mongodb+srv://fullstack:${password}@cluster.gspl2.mongodb.net/phonebook?retryWrites=true&w=majority`;

mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
});

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
});

const Person = mongoose.model("Person", personSchema);

const person = new Person({
    name,
    number: numberphone,
});

if (hasData) {
    person.save().then((result) => {
        console.log(`added ${name} ${numberphone} to phonebook`);
        mongoose.connection.close();
    });
} else {
    Person.find({}).then((persons) => {
        console.log("phonebook");
        persons.forEach((person) => {
            console.log(`${person.name} ${person.number}`);
        });
        mongoose.connection.close();
    });
}
