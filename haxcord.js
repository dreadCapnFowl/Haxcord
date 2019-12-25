/*
var { Haxcord, Science } = require('./haxcord.js')

var hax = new Haxcord(client)
var sci = new Science(filePaths)

*/
var fs = require('fs')
const fse = require('fs-extra');

class Haxcord
{
  constructor(discordclient)
  {
    this.client = discordclient
    parent = this
  }

  setClient(client)
  {
    this.client = client;
  }

}
class Science {
  constructor(filePaths) {
    /*
    var filePaths = {
      lastActive: './data/last_active.json',
      messages: './data/messages.json',
      userID: './data/ids.json'
    }
    */
    this.filePaths = filePaths
    this.data = {}

    // Load last active stats
    this.loadLastActive().then(activities => {
      this.data.lastActive = activities
    }).catch(e => {
      this.data.lastActive = {}

      fse.outputFile(this.filePaths.lastActive, '{}')
         .then(() => {
         })
         .catch(err => {
         });
    })

    // Load messages
    this.loadMessages().then(messages => {
      this.data.messages = messages
    }).catch(e => {
      this.data.messages = {}

      fse.outputFile(this.filePaths.messages, '{}')
         .then(() => {
         })
         .catch(err => {
         });
    })

    // Load user IDs
    this.loadUserID().then(ids => {
      this.data.userID = messages
    }).catch(e => {
      this.data.userID = []

      fse.outputFile(this.filePaths.userID, '{}')
         .then(() => {
         })
         .catch(err => {
         });
    })

    // Load presences
    this.loadPresences().then(presences => {
      this.data.presences = presences
    }).catch(e => {
      this.data.presences = {}

      fse.outputFile(this.filePaths.presences, '{}')
         .then(() => {
         })
         .catch(err => {
         });
    })
  }
  saveUserID() {
    var a = this;
    return new Promise(function(resolve, reject) {
      fs.writeFile(a.filePaths.userID, JSON.stringify(a.data.userID), err => {
        if (err) reject(err)
        else resolve()
      })
    })
  }

  loadUserID() {
    var a = this;
    return new Promise(function(resolve, reject) {

      fs.stat(a.filePaths.userID, function(err, stat) {
          if(err == null) { // Exists
              fs.readFile(a.filePaths.userID, (err, cont) => {
                if (err) {
                  reject(err)
                } else {
                  resolve(JSON.parse(cont.toString()))
                }
              })
          } else if(err.code == 'ENOENT') { // Doesn't exist
              reject(err)
          }
      });

    })
  }

  saveMessages() {
    var a = this;
    return new Promise(function(resolve, reject) {
      fs.writeFile(a.filePaths.messages, JSON.stringify(a.data.messages), err => {
        if (err) reject(err)
        else resolve()
      })
    })
  }
  loadMessages() {
    var a = this;
    return new Promise(function(resolve, reject) {

      fs.stat(a.filePaths.messages, function(err, stat) {
          if(err == null) { // Exists
              fs.readFile(a.filePaths.messages, (err, cont) => {
                if (err) {
                  reject(err)
                } else {
                  resolve(JSON.parse(cont.toString()))
                }
              })
          } else if(err.code == 'ENOENT') { // Doesn't exist
              reject(err)
          }
      });

    })
  }

  saveLastActive() {
    var a = this;
    return new Promise(function(resolve, reject) {
      fs.writeFile(a.filePaths.lastActive, JSON.stringify(a.data.lastActive), err => {
        if (err) reject(err)
        else resolve()
      })
    })
  }
  loadLastActive() {
    var a = this;
    return new Promise(function(resolve, reject) {

      fs.stat(a.filePaths.lastActive, function(err, stat) {
          if(err == null) { // Exists
              fs.readFile(a.filePaths.lastActive, (err, cont) => {
                if (err) {
                  reject(err)
                } else {
                  resolve(JSON.parse(cont.toString()))
                }
              })
          } else if(err.code == 'ENOENT') { // Doesn't exist
              reject(err)
          }
      });

    })
  }
  savePresences() {
    var a = this;
    return new Promise(function(resolve, reject) {
      fs.writeFile(a.filePaths.presences, JSON.stringify(a.data.presences), err => {
        if (err) reject(err)
        else resolve()
      })
    })
  }
  loadPresences() {
    var a = this;
    return new Promise(function(resolve, reject) {

      fs.stat(a.filePaths.presences, function(err, stat) {
          if(err == null) { // Exists
              fs.readFile(a.filePaths.presences, (err, cont) => {
                if (err) {
                  reject(err)
                } else {
                  resolve(JSON.parse(cont.toString()))
                }
              })
          } else if(err.code == 'ENOENT') { // Doesn't exist
              reject(err)
          }
      })

    })
  }

  saveEverything() {
    var a = this
    return new Promise(function(resolve, reject) {
      a.saveMessages().then(() => {
          a.saveUserID().then(() => {
            a.saveLastActive().then(() => {
              a.savePresences().then(() => {
                resolve()
              }).catch(e => {
                reject(e)
              })
            }).catch(e => {
              reject(e)
            })
        }).catch(e => {
          reject(e)
        })
      }).catch(e => {
        reject(e)
      })
    })
  }

  messageEvent(message) {
      var a = this;
      return new Promise(function(resolve, reject) {
        if (!a.data.messages[message.author.id])
          a.data.messages[message.author.id] = {}

        a.data.messages[message.author.id][message.id] = new Message(message);

        a.updateUserIDList(message.author.id)

        a.updateLastActivity(message.author.id)

        a.saveEverything().then(() => {
          resolve()
        }).catch(e => {
          reject(e)
        })
    })
  }

  presenceEvent(oldMember, newMember) {
      var a = this;
      return new Promise(function(resolve, reject) {
        if (!a.data.presences[newMember.user.id])
          a.data.presences[newMember.user.id] = []

          a.data.presences[newMember.user.id].push(
          new Presence(newMember.presence)
        )

        a.updateUserIDList(newMember.user.id)
        a.updateLastActivity(newMember.user.id)
        a.saveEverything().then(() => {
          resolve()
        }).catch(e => {
          reject(e)
        })
    })
  }

  updateUserIDList(id) {
    if (!this.data.userID.includes(id))
      this.data.userID.push(id)
  }

  updateLastActivity(id) {
    this.data.lastActive[id] = Date.now()
  }
  fetchAuthorMessages(id)
  {
    return this.data.messages[id]
  }
  fetchUserPresences(id)
  {
    return this.data.presences[id]
  }
  fetchMessage(id)
  {
    var a = this;
    return new Promise(function(resolve, reject) {
      for (var k in a.data.messages)
      {
        var author = a.data.messages[k];
        for (var k in author)
        {
          if (author[k].id == id) {
            resolve(author[k])
            return;
          }
        }

      }
      reject('Cannot find key.')
    })
  }
}

class Message
{
  constructor(message) {
    this.id = message.id,
    this.authorID = message.author.id
    this.content = message.content
    this.guildID = message.guild.id
    this.chanID = message.channel.id
    this.timestamp = message.createdTimestamp
  }
  getFull() {
    var a = this;
    return new Promise(function(resolve, reject) {
      a.client.channels.get(a.chanID).fetchMessage(a.id).then(m => {
        resolve(m)
      }).catch(e => {
        reject(e)
      })
    })
  }
  getAttachments() {
    var a = this;
    return new Promise(function(resolve, reject) {
      a.client.channels.get(a.chanID).fetchMessage(a.id).then(m => {
        var att = [];
        m.attachments.forEach(attachment => {
          att.push(new Attachment(attachment))
        })
        resolve(att)
      }).catch(e => {
        reject(e)
      })
    })
  }
  getMentions() {
    var a = this;
    return new Promise(function(resolve, reject) {
      a.client.channels.get(a.chanID).fetchMessage(a.id).then(m => {
        resolve(m.mentions)
      }).catch(e => {
        reject(e)
      })
    })
  }
  getAuthor() {
    var a = this;
    return new Promise(function(resolve, reject) {
      a.client.fetchUser(a.authorID).then(u => {
        resolve(u)
      }).catch(e => {
        reject(e)
      })
    })
  }
  getGuild() {
    return this.client.guilds.get(a.guildID);
  }
}

class Attachment {
  constructor(attachment) {
    this.id = attachment.id
    this.url = attachment.url
    this.filename = attachment.filename
  }
}

class Presence {
  constructor(presence) {
    this.clientStatus = presence.clientStatus,
    this.game = presence.game,
    this.status = presence.status,
    this.timestamp = Date.now()
  }
}

class User {
  constructor(user) {
    this.id = user.id
    this.username = user.username
    this.discriminator = user.discriminator
  }

  getLastActive()
  {
      var a = this;
      return new Promise(function(resolve, reject) {
        fs.readFile(lastActiveFile, (err, cont) => {
          if (err) {
            reject(err)
          } else {
            resolve(JSON.parse(cont)[a.id])
          }
        })
    })
  }
}

module.exports.User = User
module.exports.Attachment = Attachment
module.exports.Message = Message
module.exports.Haxcord = Haxcord
module.exports.Science = Science
