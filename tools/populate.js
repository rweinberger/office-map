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
    userName: 'Stef Wang',
    text: 'free half avo',
    location: 'main cafe',
    left: 75,
    top: 75,
    date: new Date(2018, 7, 4, 15, 26)
  },
  { userId: 2,
    userName: 'Varsha Subrahmanyam',
    text: 'varshas desk!!!',
    location: 'education land',
    left: 367,
    top: 388,
    date: new Date(2018, 6, 14, 9, 14)
  },
  { userId: 3,
    userName: 'Alice Thum',
    text: 'another free half avo',
    location: 'phase 3',
    left: 890,
    top: 72,
    date: new Date(2018, 5, 22, 13, 21)
  },
  { userId: 4,
    userName: 'Rebecca Weinberger',
    text: 'hummus stain on floor',
    location: 'rebs desk',
    left: 664,
    top: 250,
    date: new Date(2018, 4, 19, 11, 45)
  },
  { userId: 1,
    userName: 'Stef Wang',
    text: 'stefs desk',
    location: 'cloud land',
    left: 588,
    top: 343,
    date: new Date(2018, 3, 3, 21, 51)
  },
  { userId: 3,
    userName: 'Alice Thum',
    text: 'alices desk',
    location: 'near brian',
    left: 850,
    top: 220,
    date: new Date(2018, 5, 25, 14, 13)
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