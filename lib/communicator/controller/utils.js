var Enum = require('enum')
var Randomstring = require('randomstring')

module.exports = {
  messageTypeEnum: new Enum(['Register', 'Version', 'KeepAlive', 'UpdateAll', 'ActivePrint', 'NewPrint', 'RemovePrint']),
  statusTypeEnum: new Enum({'Started': 1, 'NotStarted': 0}),
  generateRandom: function () {
    var ranValue = Randomstring.generate({
      length: 6,
      charset: 'alphanumeric',
      capitalization: 'lowercase'
    })
    return ranValue
  }
}
