
var active = {}

function ActiveItem (message) {
  active = message
}

ActiveItem.prototype = {
  getJsonObject: function () {
    return new Promise(function (resolve, reject) {
      var returnMessage = {}
      if (active.message === 'null' || active.message === null || active.message === '' || typeof active.message === 'undefined') {
        return resolve({})
      }
      var status = {
        'action': active.message.actionstate.action,
        'state': active.message.actionstate.state,
        'progress': active.message.progress
      }
      var print = {
        'volume': active.message.volume,
        'quick_release': active.message.quickRelease,
        'start_time': active.message.printstarttime,
        'build_time': active.message.totalbuildtime,
        'expected_completion': active.message.completiontime,
        'time_elapsed': active.message.timeelapsed,
        'layer_count': active.message.totallayer,
        'printed_layers': active.message.layersPrintedProperty
      }

      returnMessage.name = active.message.filename
      returnMessage.job_id = active.message.jobid
      returnMessage.checksum = active.message.checksum
      returnMessage.size = active.message.size
      returnMessage.date = active.message.printstarttime
      returnMessage.download = active.message.download
      returnMessage.resin = active.message.resin
      returnMessage.resolution = active.message.resolution

      returnMessage.status = status
      returnMessage.print = print
      resolve(returnMessage)
    })
  }
}
module.exports = ActiveItem


