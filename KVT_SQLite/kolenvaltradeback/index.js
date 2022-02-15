const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const app = express()
const fetch = require("node-fetch");
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
const mysql = require('mysql2');
const sqlite3 = require('sqlite3').verbose(); //execution mode is set to verbose to produce long stack traces
const { Sequelize, Op, Model, DataTypes } = require("sequelize");
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'kolenval.db',
  pool: {
    acquire: 100000
  }
});


const Users = sequelize.define('Users', {
	_id: {
		type: Sequelize.INTEGER,
	    autoIncrement: true,
	    primaryKey: true,
	    allowNull: false
	},
	login: {
    	type: DataTypes.STRING,
    	allowNull: false
    },
    password: {
    	type: DataTypes.STRING,
    	allowNull: false
    },
    name: {
    	type: DataTypes.STRING,
    	allowNull: false
    },
    phones: {
    	type: DataTypes.STRING,
    	allowNull: false
    }
}, {
  // Other model options go here
});

const CarAds = sequelize.define('CarAds', {
	_id: {
		type: Sequelize.INTEGER,
	    autoIncrement: true,
	    primaryKey: true,
	    allowNull: false
	},
	productionDate: {
		type: DataTypes.STRING,
    	allowNull: false
	},
	price: {
		type: DataTypes.STRING,
    	allowNull: false
	},
	description: {
		type: DataTypes.TEXT,
    	allowNull: false
	}
},{});

const Pictures = sequelize.define('Pictures', {
	_id: {
		type: Sequelize.INTEGER,
	    autoIncrement: true,
	    primaryKey: true,
	    allowNull: false
	},
	name: {
    	type: DataTypes.TEXT('long'),
    	allowNull: false
    }
},{});

const Cities = sequelize.define('Cities', {
	_id: {
		type: Sequelize.INTEGER,
	    autoIncrement: true,
	    primaryKey: true,
	    allowNull: false
	},
	name: {
    	type: DataTypes.STRING,
    	allowNull: false
    }
},{});

const Regions = sequelize.define('Regions', {
	_id: {
		type: Sequelize.INTEGER,
	    autoIncrement: true,
	    primaryKey: true,
	    allowNull: false
	},
	name: {
    	type: DataTypes.STRING,
    	allowNull: false
    }
},{});

const Models = sequelize.define('Models', {
	_id: {
		type: Sequelize.INTEGER,
	    autoIncrement: true,
	    primaryKey: true,
	    allowNull: false
	},
	name: {
    	type: DataTypes.STRING,
    	allowNull: false
    }
},{});

const Manufactors = sequelize.define('Manufactors', {
	_id: {
		type: Sequelize.INTEGER,
	    autoIncrement: true,
	    primaryKey: true,
	    allowNull: false
	},
	name: {
    	type: DataTypes.STRING,
    	allowNull: false
    }
},{});

const Released = sequelize.define('Released', {
	_id: {
		type: Sequelize.INTEGER,
	    autoIncrement: true,
	    primaryKey: true,
	    allowNull: false
	},
	name: {
    	type: DataTypes.STRING,
    	allowNull: false
    }
},{});

const AfterCrash = sequelize.define('AfterCrash', {
	_id: {
		type: Sequelize.INTEGER,
	    autoIncrement: true,
	    primaryKey: true,
	    allowNull: false
	},
	name: {
    	type: DataTypes.STRING,
    	allowNull: false
    }
},{});

const Running = sequelize.define('Running', {
	_id: {
		type: Sequelize.INTEGER,
	    autoIncrement: true,
	    primaryKey: true,
	    allowNull: false
	},
	name: {
    	type: DataTypes.STRING,
    	allowNull: false
    }
},{});

const BodyTypes = sequelize.define('BodyTypes', {
	_id: {
		type: Sequelize.INTEGER,
	    autoIncrement: true,
	    primaryKey: true,
	    allowNull: false
	},
	name: {
    	type: DataTypes.STRING,
    	allowNull: false
    }
},{});

const GearboxTypes = sequelize.define('GearboxTypes', {
	_id: {
		type: Sequelize.INTEGER,
	    autoIncrement: true,
	    primaryKey: true,
	    allowNull: false
	},
	name: {
    	type: DataTypes.STRING,
    	allowNull: false
    }
},{});

const DrivetrainTypes = sequelize.define('DrivetrainTypes', {
	_id: {
		type: Sequelize.INTEGER,
	    autoIncrement: true,
	    primaryKey: true,
	    allowNull: false
	},
	name: {
    	type: DataTypes.STRING,
    	allowNull: false
    }
},{});

const FuelTypes = sequelize.define('FuelTypes', {
	_id: {
		type: Sequelize.INTEGER,
	    autoIncrement: true,
	    primaryKey: true,
	    allowNull: false
	},
	name: {
    	type: DataTypes.STRING,
    	allowNull: false
    }
},{});

const Colors = sequelize.define('Colors', {
	_id: {
		type: Sequelize.INTEGER,
	    autoIncrement: true,
	    primaryKey: true,
	    allowNull: false
	},
	name: {
    	type: DataTypes.STRING,
    	allowNull: false
    }
},{});

Regions.hasMany(Cities, {
	foreignKey: {
		name: 'region'
	}
})
Cities.belongsTo(Regions, {
	foreignKey: {
		name: 'region'
	}
})

Manufactors.hasMany(Models, {
	foreignKey: {
		name: 'manufactor'
	}
})
Models.belongsTo(Manufactors, {
	foreignKey: {
		name: 'manufactor'
	}
})

Users.hasMany(CarAds, {
	foreignKey: {
		name: 'user'
	}
})
CarAds.belongsTo(Users, {
	foreignKey: {
		name: 'user'
	}
})
Pictures.belongsTo(CarAds, {
	foreignKey: {
		name: 'ad'
	}
})
CarAds.hasMany(Pictures, {
	foreignKey: {
		name: 'ad'
	}
})
Cities.hasMany(CarAds, {
	foreignKey: {
		name: 'city'
	}
})
CarAds.belongsTo(Cities, {
	foreignKey: {
		name: 'city'
	}
})
Regions.hasMany(CarAds, {
	foreignKey: {
		name: 'region'
	}
})
CarAds.belongsTo(Regions, {
	foreignKey: {
		name: 'region'
	}
})
Models.hasMany(CarAds, {
	foreignKey: {
		name: 'model'
	}
})
CarAds.belongsTo(Models, {
	foreignKey: {
		name: 'model'
	}
})
Manufactors.hasMany(CarAds, {
	foreignKey: {
		name: 'manufactor'
	}
})
CarAds.belongsTo(Manufactors, {
	foreignKey: {
		name: 'manufactor'
	}
})
Released.hasMany(CarAds, {
	foreignKey: {
		name: 'released'
	}
})
CarAds.belongsTo(Released, {
	foreignKey: {
		name: 'released'
	}
})
AfterCrash.hasMany(CarAds, {
	foreignKey: {
		name: 'aftercrash'
	}
})
CarAds.belongsTo(AfterCrash, {
	foreignKey: {
		name: 'aftercrash'
	}
})
Running.hasMany(CarAds, {
	foreignKey: {
		name: 'running'
	}
})
CarAds.belongsTo(Running, {
	foreignKey: {
		name: 'running'
	}
})
BodyTypes.hasMany(CarAds, {
	foreignKey: {
		name: 'bodyType'
	}
})
CarAds.belongsTo(BodyTypes, {
	foreignKey: {
		name: 'bodyType'
	}
})
GearboxTypes.hasMany(CarAds, {
	foreignKey: {
		name: 'gearboxType'
	}
})
CarAds.belongsTo(GearboxTypes, {
	foreignKey: {
		name: 'gearboxType'
	}
})
DrivetrainTypes.hasMany(CarAds, {
	foreignKey: {
		name: 'drivetrainType'
	}
})
CarAds.belongsTo(DrivetrainTypes, {
	foreignKey: {
		name: 'drivetrainType'
	}
})
FuelTypes.hasMany(CarAds, {
	foreignKey: {
		name: 'fuelType'
	}
})
CarAds.belongsTo(FuelTypes, {
	foreignKey: {
		name: 'fuelType'
	}
})
Colors.hasMany(CarAds, {
	foreignKey: {
		name: 'color'
	}
})
CarAds.belongsTo(Colors, {
	foreignKey: {
		name: 'color'
	}
})

//PRAGMA schema.synchronous;With synchronous OFF (0), SQLite continues without syncing as soon as it has handed data off to the operating system. If the application running SQLite crashes, the data will be safe, but the database might become corrupted if the operating system crashes or the computer loses power before that data has been written to the disk surface. On the other hand, commits can be orders of magnitude faster with synchronous OFF.

const secret = 'rjomba'

function jwtWare() {
    return expressJwt({ secret }).unless({
        path: [
            '/',
            '/register',
            '/login',
            '/getAd',
            '/getAds',
            '/getAdsCount',
            '/getParams',
            '/favicon.ico',
            '/babel/parser/lib/index.js',
            '/getAdsbySearch'
        ]
    });
}

app.use(bodyParser.json({limit: '10mb', extended: true}))
app.use(cors())


app.post('/register', async (req,res) => {
	if(await Users.findOne({ where: {login: req.body.login} })){
		res.status(409).json('User already exist')
	}
	else{
		let user
		await Users.create(req.body)
			.then(res => {
				user = res
			})
		await Users.sync()
		res.status(201).json('success')
	}
})

app.post('/login', async (req,res) => {
	let user
	if(req.headers.authorization.substr("Bearer ".length).length > 4){
		let token = req.headers.authorization.substr("Bearer ".length)
    	let decoded = jwt.verify(token, secret)
    	user = await Users.findOne({ where: {_id: decoded.user._id}})
	}
	else {
		if (req.body.password) {
			user = await Users.findOne({ where: req.body})
		}		
	}
	if(user) {
		let userInfo = {}
		userInfo._id = user._id
		userInfo.login = user.login
		userInfo.name = user.name
		userInfo.phone = user.phone
		const token = jwt.sign({user: userInfo}, secret)
		res.status(201).json(token)
	}
	else{
		res.status(404).json('login or password is not correct')
	}
})

app.post('/getAd', async(req, res) => {
	let ad = null
	ad = await CarAds.findOne({ where: req.body})
	ad.user = await ad.getUser({attributes: ['_id','name','phones']})
	ad.released = await ad.getReleased({attributes: ['_id','name']})
	ad.aftercrash = await ad.getAfterCrash({attributes: ['_id','name']})
	ad.running = await ad.getRunning({attributes: ['_id','name']})
	ad.manufactor = await ad.getManufactor({attributes: ['_id','name']})
	ad.model = await ad.getModel({attributes: ['_id','name']})
	ad.region = await ad.getRegion({attributes: ['_id','name']})
	ad.city = await ad.getCity({attributes: ['_id','name']})
	ad.bodyType = await ad.getBodyType({attributes: ['_id','name']})
	ad.fuelType = await ad.getFuelType({attributes: ['_id','name']})
	ad.gearboxType = await ad.getGearboxType({attributes: ['_id','name']})
	ad.drivetrainType = await ad.getDrivetrainType({attributes: ['_id','name']})
	ad.color = await ad.getColor({attributes: ['_id','name']})
	ad.dataValues.photos = await ad.getPictures({attributes: ['_id','name']})
	if(ad) {
		res.status(201).json(ad)
	}
	else{
		res.status(404)
	}
})

app.post('/getAdsCount', async(req, res) => {
	let a = []
	if(req.headers.authorization){
		let token = req.headers.authorization.substr("Bearer ".length)
    	let decoded = jwt.verify(token, secret)
    	a = await CarAds.count({where: {user: decoded.user._id}})
	}
	else{
		a = await CarAds.count({where: req.body})
	}
	if(a){
		let pages = Math.ceil(a/10)
		res.status(201).json({pages: pages})
	}
	else{
		res.status(404)
	}
})

app.post('/getAds', async(req, res) => {
	let params = req.body
	let index = 1
	if(params.page){
		index = params.page * 10 - 10
		delete params.page
	}
	let a = []
	a = await CarAds.findAll({where: params, offset: index, limit: 10})
	for(let ad in a){
		a[ad].user = await a[ad].getUser({attributes: ['_id','name','phones']})
		a[ad].released = await a[ad].getReleased({attributes: ['_id','name']})
		a[ad].aftercrash = await a[ad].getAfterCrash({attributes: ['_id','name']})
		a[ad].running = await a[ad].getRunning({attributes: ['_id','name']})
		a[ad].manufactor = await a[ad].getManufactor({attributes: ['_id','name']})
		a[ad].model = await a[ad].getModel({attributes: ['_id','name']})
		a[ad].region = await a[ad].getRegion({attributes: ['_id','name']})
		a[ad].city = await a[ad].getCity({attributes: ['_id','name']})
		a[ad].bodyType = await a[ad].getBodyType({attributes: ['_id','name']})
		a[ad].fuelType = await a[ad].getFuelType({attributes: ['_id','name']})
		a[ad].gearboxType = await a[ad].getGearboxType({attributes: ['_id','name']})
		a[ad].drivetrainType = await a[ad].getDrivetrainType({attributes: ['_id','name']})
		a[ad].color = await a[ad].getColor({attributes: ['_id','name']})
		a[ad].dataValues.photos = await a[ad].getPictures({attributes: ['_id','name']})
	}
	if(a.length > 0) {
		res.status(201).json({ads: a})
	}
	else{
		res.status(404)
	}
})

app.get('/getParams', async(req, res) => {
	let params = {}
	let rs = await Released.findAll({attributes: ['_id','name']})
	params['released'] = rs
	let af = await AfterCrash.findAll({attributes: ['_id','name']})
	params['aftercrash'] = af
	let rn = await Running.findAll({attributes: ['_id','name']})
	params['running'] = rn
	let mf = await Manufactors.findAll({attributes: ['_id','name']})
	params['manufactor'] = mf
	let md = await Models.findAll({attributes: ['_id','name','manufactor']})
	params['model'] = md
	let rg = await Regions.findAll({attributes: ['_id','name']})
	params['region'] = rg
	let ct = await Cities.findAll({attributes: ['_id','name','region']})
	params['city'] = ct
	let bt = await BodyTypes.findAll({attributes: ['_id','name']})
	params['bodyType'] = bt
	let ft = await FuelTypes.findAll({attributes: ['_id','name']})
	params['fuelType'] = ft
	let gt = await GearboxTypes.findAll({attributes: ['_id','name']})
	params['gearboxType'] = gt
	let dt = await DrivetrainTypes.findAll({attributes: ['_id','name']})
	params['drivetrainType'] = dt
	let cr = await Colors.findAll({attributes: ['_id','name']})
	params['color'] = cr
	if(params) {
		res.status(201).json(params)
	}
	else{
		res.status(404).json('not found')
	}
})

app.use(jwtWare())

app.get('/getUser', async(req, res) => {
	let token = req.headers.authorization.substr("Bearer ".length)
	let decoded = jwt.verify(token, secret)
	user = await Users.findOne({ where: {_id: decoded.user._id}, attributes: ['_id','name','login','phones']})
    if(user){
    	res.status(201).json(user)
    }
    else{
    	res.status(404).json('not found')
    }
})

app.post('/changeUser', async (req,res) => {
	req.body.phones = req.body.phones[0]
	let token = req.headers.authorization.substr("Bearer ".length)
    let decoded = jwt.verify(token, secret)
    let user = await Users.findOne({ where: {_id: decoded.user._id}})
	if(user){
		for (prop in req.body){
			if (user[prop] && req.body[prop] != '') {
				user[prop] = req.body[prop]
			}
		}
		await user.save()
		await Users.sync()
		let userInfo = {}
		userInfo._id = user._id
		userInfo.login = user.login
		userInfo.name = user.name
		userInfo.phone = user.phone
		const token = jwt.sign({user: userInfo}, secret)
		res.status(201).json(token)
	}
	else{
		res.status(404).json('no such user')
	}
})

app.post('/getAdsbyUser', async(req, res) => {
	let token = req.headers.authorization.substr("Bearer ".length)
    let decoded = jwt.verify(token, secret)
	let user = await Users.findOne({ where: {_id: decoded.user._id}})
	let params = req.body
	let index = 1
	if(params.page){
		index = params.page * 10 - 10
		delete params.page
	}
	let a = []
	a = await CarAds.findAll({where: {user: user._id}, offset: index, limit: 10})
	for(let ad in a){
		a[ad].user = await a[ad].getUser({attributes: ['_id','name','phones']})
		a[ad].released = await a[ad].getReleased({attributes: ['_id','name']})
		a[ad].aftercrash = await a[ad].getAfterCrash({attributes: ['_id','name']})
		a[ad].running = await a[ad].getRunning({attributes: ['_id','name']})
		a[ad].manufactor = await a[ad].getManufactor({attributes: ['_id','name']})
		a[ad].model = await a[ad].getModel({attributes: ['_id','name']})
		a[ad].region = await a[ad].getRegion({attributes: ['_id','name']})
		a[ad].city = await a[ad].getCity({attributes: ['_id','name']})
		a[ad].bodyType = await a[ad].getBodyType({attributes: ['_id','name']})
		a[ad].fuelType = await a[ad].getFuelType({attributes: ['_id','name']})
		a[ad].gearboxType = await a[ad].getGearboxType({attributes: ['_id','name']})
		a[ad].drivetrainType = await a[ad].getDrivetrainType({attributes: ['_id','name']})
		a[ad].color = await a[ad].getColor({attributes: ['_id','name']})
		a[ad].dataValues.photos = await a[ad].getPictures({attributes: ['_id','name']})
	}
	if(a.length > 0) {
		res.status(201).json({ads: a})
	}
	else{
		res.status(404)
	}
})

app.post('/createAd', async(req, res) => {
	if(req.headers.authorization.substr("Bearer ".length).length > 4){
		let token = req.headers.authorization.substr("Bearer ".length)
    	let decoded = jwt.verify(token, secret)
    	let user = await Users.findOne({ where: {_id: decoded.user._id}})
		let {photos, ...adInfo} = req.body
		adInfo.user = user._id
		let ad = await CarAds.create(adInfo)
		photos.forEach(async photo => {
			await Pictures.create({name: photo, ad: ad._id})
		})
		await CarAds.sync()
		await Pictures.sync()
		let userInfo = {}
		userInfo._id = user._id
		userInfo.login = user.login
		userInfo.name = user.name
		userInfo.phone = user.phone
		token = jwt.sign({user: userInfo}, secret)
		res.status(201).json(token)
	}
	else{
		res.status(409).json('unauthorized')
	}
})

app.delete('/deleteAd', async(req, res) => {
	if(req.headers.authorization.substr("Bearer ".length).length > 4){
		let token = req.headers.authorization.substr("Bearer ".length)
    	let decoded = jwt.verify(token, secret)
    	let user = await Users.findOne({ where: {_id: decoded.user._id}})
		let flag = false
    	let ads = await user.getCarAds()
    	ads.forEach(ad => {
    		if(ad._id == req.body.adId._id){
    			flag = true
    		}
    	})
    	if(flag){
			let ad = await CarAds.findOne({where: {_id: req.body.adId._id}})
			let pics = await Pictures.findAll({where: {ad: req.body.adId._id}})
			pics.forEach(pic => {
				pic.destroy()
			})
			ad.destroy()
			await CarAds.sync()
			await Users.sync()
			await Pictures.sync()
			let userInfo = {}
			userInfo._id = user._id
			userInfo.login = user.login
			userInfo.name = user.name
			userInfo.phone = user.phone
			token = jwt.sign({user: userInfo}, secret)
			res.status(201).json(token)
    	}
		else{
			res.status(403).json('cannot delete what does not belong to you')
		}
	}
	else{
		res.status(409).json('unauthorized')
	}
})

app.get('/', async (req, res) => res.send("KolenValTrade"))

app.listen(4000, function () {
})