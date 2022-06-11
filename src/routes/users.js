const express = require('express');
const { isEmpty } = require('lodash');
const { ObjectId } = require('mongodb');
const { getDB } = require('../config/mangoDB');
const Users = require('../schemas/user-schema');
const router = express.Router();

const dummyUser = [
    { name: 'user1', id: 1 },
    { name: 'user2', id: 2 },
    { name: 'user3', id: 3 },
]

const collectionName = 'users';

//#region -----------start get--------------
    router.get('/', (req, res) => {
        res.send('Hello world!!')
    });

    router.get('/list', (req, res) => {
        getUserList().then(list => {
            res.status(200).send({ message: !isEmpty(list) ? 'Data found' : 'Data not found', status: 200, data: list })
        }).catch(err => {
            res.status(400).send({ message: err, status: 400 })
        })
    });

    // router.get('/users/:year/:month', (req, res) => {
    //     res.send(req.params);
    // });

    // router.get('/users-query/:year/:month', (req, res) => {
    //     res.send(req.query);
    // });

    router.get('/user-detail/:id', (req, res) => {
        getUserList({"_id": ObjectId(req.params.id)}).then(findedData => {
            res.status(200).send({ message: !isEmpty(findedData) ? 'Data found' : 'Data not found', status: 200, data: findedData })
        }).catch(err => {
            res.status(400).send({ message: err, status: 400 })
        })
    });
//#endregion -----------end get---------------

//#region -----------start post-------------
    router.post('/submit', (req, res) => {
        const newUser = new Users(req.body);

        getDB().collection(collectionName).insertOne(newUser)
            .then(data=> {
                res.json({message: 'Record added successfully', status: 200, data});
            })
            .catch(err => {
                res.status(400).json({ message: "Unable to save to database", status: 400 });
            })
    });
//#endregion --------------end post----------------

//#region -----------start input validation--------------
    router.post('/users-input-validataion', (req, res) => {
        const validation = validationUser(req.body);
        if (validation.error) return res.status(400).send({ message: validation.error.details[0].message, status: 400, data: null });

        const user = {
            id: dummyUser.length + 1,
            name: req.body.name
        };
        dummyUser.push(user);
        res.status(200).send({ message: 'Record added successfully', status: 200, data: user });
    });
//#endregion -----------end input validation---------------

//#region -----------start put--------------
    router.put('/user-update/:id', (req, res) => {
        (async () => {
            // Look up the users
            // If not existing, return 404
            const findedUser = await getUserList({"_id": ObjectId(req.params.id)});
            if (isEmpty(findedUser)) return res.status(404).send({ message: 'Record not found!', status: 404, data: null });

            // Validate
            // If invalid, return 400 - Bad request
            // const validation = validationUser(req.body);
            // if (validation.error) return res.status(400).send({ message: validation.error.details[0].message, status: 400, data: null });

            // Update
            try {
                getDB().collection(collectionName).updateOne({_id: ObjectId(req.params.id)}, {$set:req.body}, { upsert: true })
                    .then(data=> {
                        res.json({message: 'Record updated successfully', status: 200, data});
                    })
                    .catch(err => {
                        res.status(400).json({ message: "Unable to update", status: 400 });
                    })
            } catch(err) {
                res.json({ message: err, status: 400 });
            }
        })()    
    });
//#endregion ------------end put---------------

//#region -----------start delete-----------
    router.delete('/user-delete/:id', (req, res) => {
        (async () => {
            // Look up the users
            // If not existing, return 404
            const findedUser = await getUserList({"_id": ObjectId(req.params.id)});
            if (isEmpty(findedUser)) return res.status(404).send({ message: 'Record not found!', status: 404, data: null });

            // Delete
            try {
                getDB().collection(collectionName).deleteOne({_id: ObjectId(req.params.id)}, { upsert: true })
                    .then(data=> {
                        res.json({message: 'Record deleted successfully', status: 200, data});
                    })
                    .catch(err => {
                        res.status(400).json({ message: "Unable to delete", status: 400 });
                    })
            } catch(err) {
                res.json({ message: err, status: 400 });
            }
        })()
    });
//#endregion ------------end delete--------------

function validationUser(user){
    const schema = Joi.object({
        first_name: Joi.string().min(3).required(),
        last_name: Joi.string().min(3).required()
    });

    return schema.validate(user);
}

const getUserList = async (conditions) => {
    let data = [];
    await getDB().collection(collectionName).find(conditions || {}).toArray()
            .then(res => {
                data = res;
            })
            .catch(err => {
                console.log('error', err);

                data = []
            });

    return data;
}

module.exports = router;