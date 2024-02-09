import mongoose from "mongoose";
import { app } from "./app.js"

const { DB_HOST, PORT=3000 } = process.env;

mongoose.set('strictQuery', true);

// const DB_HOST ="mongodb+srv://scouttyga:pcn9ycLTaBQLJF0J@cluster0.0vwahc6.mongodb.net/contacts"


mongoose.connect(DB_HOST)
    .then(() => {
        app.listen(3000);
        console.log("Database connection successful")
    })
    .catch((e) => {
        console.log(e.message);
        process.exit(1);
    })