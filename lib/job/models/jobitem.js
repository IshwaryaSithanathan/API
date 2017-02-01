var os = require('os')
var Utils = require('../../communicator/controllers/utils')
var moment = require('moment')
const md5File = require('md5-file')
var path = require('path')

function JobItem (file) {
  this.file = file
  this.name = file.originalFilename
  this.jobid = 'Job-' + Utils.generateRandom()
  this.size = file.size
  this.checksum = md5File.sync(file.path)
  this.date = moment().toISOString()
  var url = 'http://' + os.hostname() + '.local:51749/'
  this.download = url + this.checksum
};

JobItem.prototype = {
  getExtension: function () {
    return path.extname(this.file.path)
  },
  getTargetPath: function () {
    return os.homedir() + '/data/'
  },
  get: function (key) {
    return this[key]
  },
  validate: function () {
    var ext = path.extname(this.file.path)
    return (ext.localeCompare('.zip') !== 0 && ext.localeCompare('.spj') !== 0)
  },
  stringify: function () {
    return {'filename': this.name, 'jobid': this.jobid, 'size': this.size, 'checksum': this.checksum, 'date': this.date, 'url': this.download}
  }
}

module.exports = JobItem
