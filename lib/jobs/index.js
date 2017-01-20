
var multer = require('multer')
var upload = multer()
var fs = require('fs')
const md5File = require('md5-file')
var path = require('path')
var moment = require('moment')
var Utils = require('../communicator/controller/utils')

var router = require('express').Router({ mergeParams: true })
var communicatorRoute = require('../communicator')
var Message = require('../communicator/models/message')
var os = require('os')


module.exports = function() {
    router.post('/upload', upload.single(), function(req, res, next) {
        if (!req.files) {
            res.sendStatus(400);
        }
        var file = req.files.file;
        var tmp_path = file.path;
        var hash = md5File.sync(tmp_path);
        var target_path = '/home/syeem/data/' + hash;
        var ext = path.extname(file.path);

        /* localeCompare Expected Returns:
         0:  exact match
        -1:  string_a < string_b
         1:  string_a > string_b
         */
        if (ext.localeCompare('.zip') != 0 || ext.localeCompare('.spj') != 0) {
            console.log("Unrecognized file format");
            //res.sendStatus(415);
        }

        var src = fs.createReadStream(tmp_path);
        var dest = fs.createWriteStream(target_path);

        var time = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');

        src.pipe(dest);
        src.on('end', function() {
            //call printqueue to add job item to queue
            var url = "http://" + os.hostname() + ".local:51749/"
            var jobID = "Job-" + Utils.generateRandom();
            var clientID = communicatorRoute.getClientId()
            var message = new Message(clientID)
            message.createSimpleMessage(Utils.messageTypeEnum.NewPrint.key, Utils.statusTypeEnum.NotStarted.value)
            message.setMessage({ "jobid": jobID, "filename": file.originalFilename, "checksum": hash, "statusProperty": "Uploaded", "url": url })

            communicatorRoute.sendMessage(message)
            res.send({
                'name': file.originalFilename,
                "job_id": jobID,
                "checksum": hash,
                "size": file.size,
                "date": time,
                "download": url + hash
            });

        });

        src.on('error', function(err) { console.log('error'); res.sendStatus(500); });
    });
    
    router.callbacks = require('./controller/jobs')
    router.get('/', router.callbacks.fetchJobs)
    router.get('/:id', router.callbacks.fetchJob)
    return router
};

