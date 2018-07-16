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
    location: 'main cafe'
  },
  { userId: 2,
    text: 'varshas desk!!!',
    location: 'education land',
  },
  { userId: 3,
    text: 'another free half avo',
    location: 'phase 3'
  },
  { userId: 4,
    text: 'hummus stain on floor',
    location: 'rebs desk',
  },
  { userId: 1,
    text: 'stefs desk',
    location: 'cloud land'
  },
  { userId: 3,
    text: 'alices desk',
    location: 'near brian',
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
    .catch(e => console.log(e));
}

module.exports = populate;