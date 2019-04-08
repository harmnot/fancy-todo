//toogle
$("#toggle").click(function() {
  $(this).toggleClass("active");
  $("#overlay").toggleClass("open");
});
alertify.defaults = {
  // dialogs defaults
  autoReset: true,
  basic: false,
  closable: true,
  closableByDimmer: true,
  frameless: false,
  maintainFocus: true, // <== global default not per instance, applies to all dialogs
  maximizable: true,
  modal: true,
  movable: true,
  moveBounded: false,
  overflow: true,
  padding: true,
  pinnable: true,
  pinned: true,
  preventBodyShift: false, // <== global default not per instance, applies to all dialogs
  resizable: true,
  startMaximized: false,
  transition: "pulse",

  // notifier defaults
  notifier: {
    // auto-dismiss wait time (in seconds)
    delay: 5,
    // default position
    position: "top-center",
    // adds a close button to notifier messages
    closeButton: false
  },

  // language resources
  glossary: {
    // dialogs default title
    title: "AlertifyJS",
    // ok button text
    ok: "OK",
    // cancel button text
    cancel: "Cancel"
  },

  // theme settings
  theme: {
    // class name attached to prompt dialog input textbox.
    input: "ajs-input",
    // class name attached to ok button
    ok: "ajs-ok",
    // class name attached to cancel button
    cancel: "ajs-cancel"
  }
};
const todolist = async () => {
  try {
    const todo = await fetch("../dashboard.html");
    const load = await todo.text();
    $(".container-nav").html(load);
  } catch (err) {
    alertify.error(err.message);
  }
};

const showTodo = async () => {
  $(document).ready(async function() {
    try {
      const id = localStorage.getItem("id");
      const list = await fetch(`http://localhost:4000/api/mytask/${id}`);
      const getList = await list.json();

      const lists = [];
      await getList.forEach(el => {
        el["task"].forEach(getList => {
          lists.push(getList);
        });
      });
      for (let todo of lists) {
        $(`#listtodo`).append(
          "<li class='list-group-item' id='" +
            todo._id +
            "'>" +
            "<div align='right' style='float:right'>" +
            "<button class='btn btn-danger btn-xs' id='btn-" +
            todo._id +
            "' onClick='deleteItem(this.id)'>" +
            "Delete" +
            "</button>" +
            "</div>" +
            "<div align='left'>" +
            todo.task +
            "</div>" +
            "</li>"
        );
      }
    } catch (err) {
      alertify.error(err.message);
    }
  });
};

const deleteItem = async clicked_id => {
  const id = clicked_id.substring(4);
  try {
    const deleteTask = await fetch(
      `http://localhost:4000/api/deletetask/${id}`,
      {
        method: "DELETE"
      }
    );
    const tryDelete = await deleteTask.json();
    console.log(tryDelete, "di deleted");
    $(document).ready(async function() {
      $(`#${id}`).remove();
    });
  } catch (e) {
    alertify.error(err.message);
  }
};

const homepage = async () => {
  const home = await fetch("../homepage.html");
  const page = await home.text();
  $("#goo").show();
  $(".container-nav").html(page);
};

//google signin
async function onSignIn(googleUser) {
  const profile = googleUser.getBasicProfile();
  console.log("ID: " + profile.getId()); // Do not send to your backend! Use an ID token instead.
  console.log("Name: " + profile.getName());
  console.log("Image URL: " + profile.getImageUrl());
  console.log("Email: " + profile.getEmail()); // This is null if the 'email' scope is not present.
  const id_token = googleUser.getAuthResponse().id_token;

  const giveToken = await fetch(`http://localhost:4000/api/loginGoogle`, {
    method: "POST",
    body: JSON.stringify({
      token: id_token
    }),
    headers: new Headers({
      "Content-Type": "application/json"
    })
  });
  // $(".footer").hide();
  const receive = await giveToken.json();

  console.log(receive, "ini token");
  $("#logout").show();

  showTodo();
  todolist();
  $(".footer").hide();
  localStorage.setItem("token", receive.token);
  localStorage.setItem("token", receive.id);
}

//google signOut
function signOut() {
  const auth2 = gapi.auth2.getAuthInstance();
  auth2
    .signOut()
    .then(function() {
      homepage();
      $("#logout").hide();
      window.location.reload();
      localStorage.removeItem("token");

      console.log("User signed out.");
    })
    .catch(err => {
      alertify.error(err.message);
    });
  $(".footer").show();
  homepage();
  localStorage.removeItem("token");
}

if (localStorage.getItem("token")) {
  // $("#homepage").hide();
  $(".footer").hide();
  showTodo();
  todolist();
  $("#logout").show();
} else {
  $(".footer").show();
  $("#goo").show();
  $("#homepage").show();
  $("#logout").hide();
}

const gotologin = () => {
  const login = `<form action="" method="POST" id="loginplain">
<div id="warning"> </div>
  <div class="form-group row">
    <label for="staticEmail" class="col-sm-2 col-form-label">Email</label>
    <div class="col-sm-10">
      <input type="text"  class="form-control" id="staticEmail" placeholder="your valid email" require>
    </div>
  </div>
  <div class="form-group row">
    <label for="inputPassword" class="col-sm-2 col-form-label">Password</label>
    <div class="col-sm-10">
      <input type="password" class="form-control" id="inputPassword" placeholder="Password" require>
    </div>
  </div>
  </div>
  </form>
    <button type="button" class="btn btn-primary" onclick="nowlogin()"> Login </button>`;
  $("#masuk").hide();
  $("#masuk2").hide();
  $("#loginregister").html(login);
};

const nowlogin = async () => {
  try {
    const email = $("#staticEmail").val(),
      password = $("#inputPassword").val();
    const loginUser = await fetch("http://localhost:4000/api/login", {
      method: "POST",
      body: JSON.stringify({
        email,
        password
      }),
      headers: new Headers({
        "Content-Type": "application/json"
      })
    });
    const trylogin = await loginUser.json();
    if (loginUser.status == 404 || loginUser.status == 400) {
      alertify.warning(trylogin.msg);
    } else {
      alertify.success(`successfully login`);
      showTodo();
      todolist();
      $(".footer").hide();
      $("#logout").show();
      localStorage.setItem("token", trylogin.token);
      localStorage.setItem("id", trylogin.id);
      console.log(trylogin.id, "ini id");
    }
  } catch (err) {
    if (err) {
      alertify.error(err.message);
    }
  }
};

const register = async () => {
  try {
    const email = $("#staticEmail").val(),
      password = $("#inputPassword").val(),
      name = $("#inputName").val();

    const registerThem = await fetch("http://localhost:4000/api/sigup", {
      method: "POST",
      body: JSON.stringify({
        email,
        password,
        name
      }),
      headers: new Headers({
        "Content-Type": "application/json"
      })
    });
    const creating = await registerThem.json();
    alertify.success(`thank you for registration, you can login now`);
    gotologin();
  } catch (err) {
    alertify.error(err.message);
  }
};

const addTodo = async () => {
  const textarea = $("#textarea").val();
  const id = localStorage.getItem("id");
  try {
    const creatingTask = await fetch("http://localhost:4000/api/addtask", {
      method: "POST",
      body: JSON.stringify({ id, task: textarea }),
      headers: new Headers({ "Content-Type": "application/json" })
    });
    const nowCreated = await creatingTask.json();
    $("#mytodo").append(`<p> ${textarea} </p>`);
    if (textarea == "") {
      alertify.warning(`fill your task`);
    } else {
      alertify.success(`success created ${textarea}`);
    }
  } catch (err) {
    alertify.error(err.message);
  }
};
