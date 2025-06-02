import app from "../src/app.js";

import {createServer} from "http";
import databseConnection from "./config/db.js";


const PROT = process.env.PORT || 8000;

await databseConnection();

const server = createServer(app);


server.listen(PROT,()=>{
    console.log(`Server is Running on port ${process.env.PORT}`)
})