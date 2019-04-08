const { User, Todo } = require("../model/userTodo.js");
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.CLIENT_ID);
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

class Controller {
  static async createUser(req, res) {
    try {
      console.log(req.body);
      const isUserExist = await User.find({ email: req.body.email });
      if (!isUserExist.length) {
        const createuser = await User.create({ ...req.body });
        res.status(202).json({ newUser: createuser });
      } else {
        res.status(200).json({ user: "you are already register" });
      }
    } catch (err) {
      res.status(500).json({ err: err.message });
    }
  }

  static async login(req, res) {
    try {
      const isUserValid = await User.findOne({ email: req.body.email });
      console.log(isUserValid);
      if (!isUserValid) {
        res.status(404).json({ msg: `can't found any ${req.body.email} ` });
      } else {
        console.log(isUserValid.password, "====", req.body.password);
        bcrypt.compare(
          req.body.password,
          isUserValid.password,
          (err, isMatch) => {
            if (!isMatch) {
              console.log("salah");
              res.status(400).json({ msg: `password is not match` });
            } else {
              console.log("benar");
              req.session.user = isUserValid._id;
              console.log(req.session.user, "sessioon");
              jwt.sign(
                {
                  email: req.body.email,
                  password: req.body.password,
                  name: isUserValid.name
                },
                process.env.SECRET_KEY,
                { expiresIn: 3600 },
                (err, token) => {
                  if (err) {
                    res.status(500).json({ err: err });
                  } else {
                    res.status(200).json({ token, id: isUserValid._id });
                  }
                }
              );
            }
          }
        );
      }
    } catch (err) {
      res.status(500).json({ err: err.message });
    }
  }

  static async createTask(req, res) {
    try {
      console.log(req.session, "ini session plain");
      console.log(req.session.user, "session createTask");
      const createTodo = await Todo.create({
        owned_id: req.body.id,
        task: req.body.task
      });
      console.log(createTodo);
      const user = await User.updateOne(
        { _id: req.body.id },
        { $addToSet: { task: createTodo._id } }
      );
      res.status(202).json({ msg: `successfully created task`, data: user });
    } catch (err) {
      res.status(500).json({ err: err.message });
    }
  }
  static async findMytask(req, res) {
    try {
      const getIt = await User.find({ _id: req.params.id }).populate("task");
      res.status(200).json(getIt);
    } catch (err) {
      res.status(500).json({ err: err.message });
    }
  }

  static async checked(req, res) {
    try {
      const checked = await Todo.findOneAndUpdate(
        {
          owned_id: req.body.id,
          task: req.params.task
        },
        { $set: { done: true } },
        { new: true }
      );
      res.status(200).json({ msg: `it is done now` });
    } catch (err) {
      res.status(500).json({ err: err.message });
    }
  }

  static async checkedbyId(req, res) {
    try {
      const checked = await Todo.findOneAndUpdate(
        {
          _id: req.params.id
        },
        { $set: { done: true } },
        { new: true }
      );
      res.status(200).json({ msg: `it is done now` });
    } catch (err) {
      console.log(err);
      res.status(500).json({ err: err.message });
    }
  }

  static async destroytask(req, res) {
    try {
      const deletedTask = await Todo.findOneAndDelete({ _id: req.params.id });
      console.log(deletedTask, "berhasilll");
      res.status(200).json({ msg: `successfully deleted task` });
    } catch (err) {
      res.status(500).json({ err: err.message });
    }
  }

  static async updateUser(req, res) {
    try {
      const update = await User.update(
        { _id: req.params.id },
        { $set: { ...req.body } },
        { new: true }
      );
      res.status(200).json({ msg: `successfully updated user`, data: update });
    } catch (err) {
      res.status(500).json({ err: err.message });
    }
  }

  static async loginGoogle(req, res) {
    try {
      const ticket = await client.verifyIdToken({
        idToken: req.body.token,
        audience: process.env.CLIENT_ID // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
      });
      const payload = ticket.getPayload();
      const userid = payload["sub"];
      // If request specified a G Suite domain:
      //const domain = payload['hd'];
      // }
      const isUser = await User.findOne({ email: payload.email });

      if (!isUser) {
        const createUser = await User.create({
          email: payload.email,
          password: String(Math.floor(Math.random() * 10000000) + 10000000),
          name: payload.name
        });
        jwt.sign(
          {
            email: payload.email,
            password: String(Math.floor(Math.random() * 10000000) + 10000000),
            name: payload.name
          },
          process.env.SECRET_KEY,
          { expiresIn: 3600 },
          (err, token) => {
            if (err) {
              res.status(500).json({ err: err });
            } else {
              res.status(200).json(token);
            }
          }
        );
      } else {
        jwt.sign(
          {
            email: payload.email,
            password: String(Math.floor(Math.random() * 10000000) + 10000000),
            name: payload.name
          },
          process.env.SECRET_KEY,
          { expiresIn: 3600 },
          (err, token) => {
            if (err) {
              res.status(500).json({ err: err });
            } else {
              res.status(202).json(token);
            }
          }
        );
      }
    } catch (e) {
      res.status(500).json({ err: e.message });
    }
  }
}

module.exports = Controller;
