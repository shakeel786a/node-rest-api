const express = require('express');
const { getDB } = require('../config/mangoDB');
const userSchema = require('../schemas/user-schema');
const router = express.Router();

const users = [
    { name: 'user1', id: 1 },
    { name: 'user2', id: 2 },
    { name: 'user3', id: 3 },
]

//#region -----------start get--------------
    router.get('/', (req, res) => {
        res.send('Hello world!!')
    });

    router.get('/list', (req, res) => {
        const db = getDB();
        db.collection('users').find({}).toArray().then(data => {
            // console.log('res =>', data)
            res.send({ message: 'Data found', status: 200, data: data })
        });
        
    });

    // router.get('/users/:year/:month', (req, res) => {
    //     res.send(req.params);
    // });

    // router.get('/users-query/:year/:month', (req, res) => {
    //     res.send(req.query);
    // });

    router.get('/user-detail/:id', (req, res) => {
        const user = users.find(u => u.id === parseInt(req.params.id));
        if (!user) return res.status(404).send({ message: 'Record not found!', status: 404, data: null });
        
        res.status(200).send({ message: 'Record found!', status: 200, data: user });
    });
//#endregion -----------end get---------------

//#region -----------start post-------------
    router.post('/submit', (req, res) => {
        console.log('req=========>', req.body)
        const user = {
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            gender: req.body.gender,
            father_name: req.body.father_name
        };

        new userSchema(user).save()
            .then(data=> {
                res.json({message: 'Record added successfully', status: 200, data});
            })
            .catch(err => {
                res.json({ message: err, status: 400 })
            })

        // res.status(200).send({ message: 'Record added successfully', status: 200, data: user });
    });
//#endregion --------------end post----------------

//#region -----------start input validation--------------
    router.post('/users-input-validataion', (req, res) => {
        const validation = validationUser(req.body);
        if (validation.error) return res.status(400).send({ message: validation.error.details[0].message, status: 400, data: null });

        const user = {
            id: users.length + 1,
            name: req.body.name
        };
        users.push(user);
        res.status(200).send({ message: 'Record added successfully', status: 200, data: user });
    });
//#endregion -----------end input validation---------------

//#region -----------start put--------------
    router.put('/user-detail/:id', (req, res) => {
        // Look up the users
        // If not existing, return 404
        const user = users.find(u => u.id === parseInt(req.params.id));
        if (!user) return res.status(404).send({ message: 'Record not found!', status: 404, data: null });
        
        // Validate
        // If invalid, return 400 - Bad request
        const validation = validationUser(req.body);
        if (validation.error) return res.status(400).send({ message: validation.error.details[0].message, status: 400, data: null });

        // Update users
        // Return the updated users
        user.name = req.body.name;
        user.address = req.body.address;
        res.status(200).send({ message: 'Record updated!', status: 200, data: user })    
    });
//#endregion ------------end put---------------

//#region -----------start delete-----------
    router.delete('/user-delete/:id', (req, res) => {
        // Look up the user
        // Not exist, return 404
        const user = users.find(u => u.id === parseInt(req.params.id));
        if (!user) return res.status(404).send({ message: 'Record not found!', status: 404, data: null });

        // Delete
        const index = users.indexOf(user);
        users.splice(index, 1);

        // Return the same course
        res.status(200).send({ message: 'Record deleted!', status: 200, data: user });
    });
//#endregion ------------end delete--------------

function validationUser(user){
    const schema = Joi.object({
        name: Joi.string().min(3).required(),
        address: Joi.string().min(5).required()
    });

    return schema.validate(user);
}

module.exports = router;