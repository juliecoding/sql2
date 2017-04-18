var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var massive = require('massive');
//Need to enter username and password for your database
var connString = "postgres://localhost/assessbox";

var app = express();

app.use(bodyParser.json());
app.use(cors());

//The test doesn't like the Sync version of connecting,
//  Here is a skeleton of the Async, in the callback is also
//  a good place to call your database seeds.



/*****ENDPOINTS*****/
var db = massive.connect({ connectionString: connString },
    function(err, localdb) {
        db = localdb;
        app.set('db', db);

        db.user_create_seed(function() {
            console.log("User Table Init");
        });
        db.vehicle_create_seed(function() {
            console.log("Vehicle Table Init")
        });
    })

app.get('/api/users', function(req, res, next) {
    db.get_all_users([], function(err, results) {
        if (err) {
            return res.status(500).send(err);
        }
        return res.status(200).send(results);
    })
})

app.get('/api/vehicles', function(req, res, next) {
    db.get_all_vehicles([], function(err, results) {
        if (err) {
            return res.status(500).send(err);
        }
        return res.status(200).send(results);
    })
})

app.post('/api/users', function(req, res, next) {
    db.post_user([req.body.firstname, req.body.lastname, req.body.email], function(err, results) {
        if (err) {
            return res.status(500).send(err);
        }
        return res.status(200).send(results);
    })
})

app.post('/api/vehicles', function(req, res, next) {
    db.post_vehicle([req.body.make, req.body.model, req.body.year, req.body.ownerId], function(err, results) {
        if (err) {
            return res.status(500).send(err);
        }
        return res.status(200).send(results);
    })
})

app.get('/api/user/:userId/vehiclecount', function(req, res, next) {
    db.vehicles_per_user([req.params.userId], function(err, results) {
        if (err) {
            return res.status(500).send(err);
        }
        return res.status(200).send(results);
    })
})

app.get('/api/user/:userId/vehicle', function(req, res, next) {
    db.vehicles_per_user([req.params.userId], function(err, results) {
        if (err) {
            return res.status(500).send(err);
        }
        return res.status(200).send(results);
    })
});

app.get('/api/vehicle', function(req, res, next) {
    if (req.query.email) {
        db.vehicle_by_email([req.query.email], function(err, results) {
            if (err) {
                return res.status(500).send(err);
            }
            return res.status(200).send(results);
        })
    } else if (req.query.userFirstStart) {
        db.vehicle_by_firstStart([req.query.userFirstStart], function(err, results) {
            if (err) {
                return res.status(500).send(err);
            }
            return res.status(200).send(results);
        })
    }
})

app.get('/api/newervehiclesbyyear', function(req, res, next) {
    db.newer_vehicles([], function(err, results) {
        if (err) {
            return res.status(500).send(err);
        }
        return res.status(200).send(results);
    })
})

app.put('/api/vehicle/:vehicleId/user/:userId', function(req, res, next) {
    db.update_owner([req.params.vehicleId, req.params.userId], function(err, results) {
        if (err) {
            return res.status(500).send(err);
        }
        return res.status(200).send(results);
    })
})

app.delete('/api/user/:userId/vehicle/:vehicleId', function(req, res, next) {
    db.remove_ownership([req.params.vehicleId], function(err, results) {
        if (err) {
            return res.status(500).send(err);
        }
        return res.status(200).send(results);
    })
})

app.delete('/api/vehicle/:vehicleId', function(req, res, next) {
    db.delete_vehicle([req.params.vehicleId], function(err, results) {
        if (err) {
            return res.status(500).send(err);
        }
        return res.status(200).send(results);
    })
})

app.listen('3000', function() {
    console.log("Successfully listening on : 3000")
})

module.exports = app;