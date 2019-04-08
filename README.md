| Route            | HTTP   | BODY                                        | DESCRIPTION           |
| ---------------- | ------ | ------------------------------------------- | --------------------- |
| /api/sigup       | POST   | email: String, password:String, name:String | register user         |
| /api/login       | POST   | email: String, password:String              | login for user        |
| /api/addtask     | POST   | owned_id: ObjectID, task: String            | add task / todo       |
| /api/mytask/:id  | GET    | none                                        | show list user todo   |
| /api/delete/:id  | DELETE | none                                        | delete task user todo |
| /api/loginGoogle | POST   | email:String, password:String               | login by Google       |
