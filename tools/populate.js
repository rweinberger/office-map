var database = require('../db');

const users = [
  { userId: 1,
    firstName: 'Stef',
    lastName: 'Wang',
    pins: []
  },
  { userId: 2,
    firstName: 'Varsha',
    lastName: 'Subrahmanyam',
    pins: []
  },
  { userId: 3,
    firstName: 'Alice',
    lastName: 'Thum',
    pins: []
  },
  { userId: 4,
    firstName: 'Rebecca',
    lastName: 'Weinberger',
    pins: []
  }
]

const pins = [
  { userId: 1,
    text: 'free half avo',
    location: 'main cafe',
    left: 75,
    top: 75
  },
  { userId: 2,
    text: 'varshas desk!!!',
    location: 'education land',
    left: 367,
    top: 188
  },
  { userId: 3,
    text: 'another free half avo',
    location: 'phase 3',
    left: 890,
    top: 72
  },
  { userId: 4,
    text: 'hummus stain on floor',
    location: 'rebs desk',
    left: 664,
    top: 300
  },
  { userId: 1,
    text: 'stefs desk',
    location: 'cloud land',
    left: 288,
    top: 243
  },
  { userId: 3,
    text: 'alices desk',
    location: 'near brian',
    left: 35,
    top: 287
  }
]

const populate = () => {
  const db = database.get();
  let pinCollection, userCollection, colls;

  db.listCollections().toArray()
    .then(_colls => colls = _colls.map(info => info.name))
    .then(() => {if (colls.indexOf('pins') > -1) db.dropCollection('pins')})
    .then(() => {if (colls.indexOf('users') > -1) db.dropCollection('users')})
    .then(() => db.createCollection('pins'))
    .then(_coll => pinCollection = _coll)
    .then(() => db.createCollection('users'))
    .then(_coll => userCollection = _coll)
    .then(() => userCollection.insertMany(users))
    .then(() => pinCollection.insertMany(pins))
    .then(async data => {
      for (const op of data.ops) {
        await userCollection.findOneAndUpdate({userId: op.userId}, {$push: {pins: op._id}})
      }
    })
    .catch(e => console.error(e));
}

module.exports = populate;