const [express, cors, mongoose, session, cookieParser] = [
  require("express"),
  require("cors"),
  require("mongoose"),
  require("express-session"),
  require("cookie-parser")
];
require("dotenv").config();
const app = express();
const todo = require("./routes/todo.js");

// connect with mongoDB_ATLAS
const uri = `mongodb+srv://${process.env.MONGO_DB_NAME}:${
  process.env.MONGO_DB_KEY
}@hamrnot-iasow.mongodb.net/${process.env.MONGO_DATABASE}?retryWrites=true`;

mongoose
  .connect(
    uri,
    { useNewUrlParser: true }
  )
  .then(() => console.log(`======> MongoDB connected <=====`))
  .catch(err => console.log(err, "ini error"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  session({
    secret: process.env.SESSION_KEY,
    resave: true,
    saveUninitialized: true
  })
);
app.use(cors());

app.use("/api", todo);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log("connected with portn http://localhost:4000");
});
