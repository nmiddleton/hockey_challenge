'use strict'
const Scrape = require('../../../src/app/Scrape')

const repository = (db) => {
  const collection_name = 'performances'
  const performances_collection = db.collection(collection_name)
  const performances = []
  const query = {}


  const getAllPerformances = () => {
    return new Promise((resolve, reject) => {
      // Get the documents as a cursor (for iteration through)
      const cursor = performances_collection.find(query)


      cursor.forEach((performance) => {
        // saves to private variable performances
        performances.push(performance)
      }, (err, doc) => {
        if (err) {
          reject(new Error('Error finding performances: ' + err))
        } else {
          if (!!doc && doc.count === 0) {
            console.log('None found')
          }
          console.log(performances.length, 'found')
          resolve(performances)
        }
      })
    })
  }
  const getPerformanceFor = (team) => {
    let team_query = {'team': team}

    return new Promise((resolve, reject) => {
      // Get the documents as a cursor (for iteration through)
      performances_collection.findOne(team_query, (err,performance) => {
        if (err) reject(err);
        resolve(performance)
        }
      )
    })
  }

  const getPerformancesFor = (team_partial) => {
    team_partial = team_partial.replace('*', '.*')

    let performances = [],
      team_query = {'team': new RegExp('^' + team_partial, 'i') }

    return new Promise((resolve, reject) => {
      const cursor = performances_collection.find(team_query)

      cursor.forEach((performance) => {
        console.log('found!', team_query, JSON.stringify(performance, null, 4));
        // saves to private variable performances
        performances.push(performance)
      }, (err, doc) => {
        if (err) {
          reject(new Error('Error finding performances: ' + err))
        } else {
          if (!!doc && doc.count === 0) {
            console.log('None found')
          }
          resolve(performances)
        }
      })
    })
  }

  const refreshAllPerformances = () => {
    return new Promise((resolve, reject) => {
      return Scrape().ALLTablesAsCollection()
        .then((performances) => {
          if (performances.length === 0){
            // use cached
            resolve(getAllPerformances())
          }
          else {
            performances.push(
              {
                '_id': 'last_refreshed',
                'timestamp': new Date().toISOString()
              })
            try {
              performances_collection.drop((err, res) => {
                if (err) reject(err)
                console.log('Collection dropped:')
                db.createCollection(collection_name, (err, res) => {
                  if (err) reject(err)
                  console.log('Collection Created!')
                  console.log('Inserting', performances.length)
                  performances_collection.insertMany(performances, (err, res) => {
                    if (err) reject(err)
                    console.log('No. of documents inserted:', res.insertedCount)
                    resolve(performances)
                  })
                })
              });
            } catch (e) {
              if (e.code === 26) {
                console.log('namespace %s not found', performances_collection.name)
              } else {
                throw e;
              }
            }
          }
        })

    })
  }


  // this will close the database connection
  const disconnect = () => {
    db.close()
  }

  return Object.create({
    getAllPerformances,
    getPerformanceFor,
    getPerformancesFor,
    refreshAllPerformances,
    disconnect
  })

}
const connect = (connection) => {
  return new Promise((resolve, reject) => {
    if (!connection) {
      reject(new Error('connection db not supplied'))
    }
    resolve(repository(connection))

  })
}
// this only exports a connected repo
module.exports = Object.assign({}, {connect})




