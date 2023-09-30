const UserController = require('../controllers/user.controller');
module.exports = (app) => {
    app.get('/api', UserController.index);
    app.post('/api/user/new', UserController.createUser); 
    app.get('/api/user', UserController.getAllUsers); 
    app.get('/api/user/:id', UserController.getUser);
    app.patch('/api/user/:id', UserController.updateUser);
    app.delete('/api/user/:id', UserController.deleteUser);



}