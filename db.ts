const { Sequelize, Model } = require('sequelize')
const config = require('./config')

const sequelize = new Sequelize(
  process.env.DB_NAME || 'wfmu',
  process.env.DB_USER || 'postgres',
  process.env.DB_PASSWORD,
  {
    dialect: 'postgres'
  },
)

class Program extends Model { }
Program.init(
  {
    id: {
      type: Sequelize.STRING,
      primaryKey: true,
    },
    title: Sequelize.STRING,
  },
  {
    sequelize,
    modelName: 'program',
  },
)

class Show extends Model { }
Show.init(
  {
    id: {
      type: Sequelize.STRING,
      primaryKey: true,
    },
    date: Sequelize.DATE,
    title: Sequelize.STRING,
    showPath: Sequelize.STRING,
    streamPath: Sequelize.STRING,
    playerPath: Sequelize.STRING,
  },
  {
    sequelize,
    modelName: 'show',
  },
)

class Song extends Model { }
Song.init(
  {
    id: {
      type: Sequelize.STRING,
      primaryKey: true,
    },
    artist: Sequelize.STRING,
    title: Sequelize.STRING,
    album: Sequelize.STRING,
    label: Sequelize.STRING,
    format: Sequelize.STRING,
    year: Sequelize.INTEGER,
    image: Sequelize.STRING,
    comments: Sequelize.TEXT,
  },
  {
    sequelize,
    modelName: 'song',
  },
)

sequelize.sync()
Program.hasMany(Show)
Show.hasMany(Song)

export default {
  Program,
  Show,
  Song,
}