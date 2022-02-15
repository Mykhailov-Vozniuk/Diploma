const mongoose = require('mongoose')
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const app = express()
const fetch = require("node-fetch");
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');

mongoose.connect('mongodb://localhost/kolenval', {useNewUrlParser: true})

var db = mongoose.connection;

var userSchema = new mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	login: String,
	password: String,
	ads: [{type: mongoose.Schema.Types.ObjectId, ref: 'CarAd'}],
	phones: [String],
	name: String,
})

var citySchema = new mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	name: String,
	region: {type: mongoose.Schema.Types.ObjectId, ref: 'Region'}
})

var regionSchema =  new mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	name: String,
	cities: [{type: mongoose.Schema.Types.ObjectId, ref: 'City'}]
})

var modelSchema = new mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	name: String,
	manufactor: {type: mongoose.Schema.Types.ObjectId, ref: 'Manufactor'}
})

var manufactorSchema = new mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	name: String,
	models: [{type: mongoose.Schema.Types.ObjectId, ref: 'Model'}]
})

var releasedSchema = new mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	name: String
})

var afterCrashSchema = new mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	name: String
})

var runningSchema = new mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	name: String
})

var bodyTypeSchema = new mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	name: String
})

var gearboxTypeSchema = new mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	name: String
})

var drivetrainTypeSchema = new mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	name: String
})

var colorSchema = new mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	name: String
})

var fuelTypeSchema = new mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	name: String
})

var carAdSchema = new mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	released: {type: mongoose.Schema.Types.ObjectId, ref: 'Released'},
	aftercrash: {type: mongoose.Schema.Types.ObjectId, ref: 'AfterCrash'},
	running: {type: mongoose.Schema.Types.ObjectId, ref: 'Running'},
	user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
	manufactor: {type: mongoose.Schema.Types.ObjectId, ref: 'Manufactor'},
	model: {type: mongoose.Schema.Types.ObjectId, ref: 'Model'},
	bodyType: {type: mongoose.Schema.Types.ObjectId, ref: 'BodyType'},
	gearboxType: {type: mongoose.Schema.Types.ObjectId, ref: 'GearboxType'},
	drivetrainType: {type: mongoose.Schema.Types.ObjectId, ref: 'DrivetrainType'},
	color: {type: mongoose.Schema.Types.ObjectId, ref: 'Color'},
	fuelType: {type: mongoose.Schema.Types.ObjectId, ref: 'FuelType'},
	productionDate: String,
	price: String,
	description: String,
	photos: [String],
	region: {type: mongoose.Schema.Types.ObjectId, ref: 'Region'},
	city: {type: mongoose.Schema.Types.ObjectId, ref: 'City'}
})

var Region = mongoose.model('Region', regionSchema)
var City = mongoose.model('City', citySchema)
var User = mongoose.model('User', userSchema)
var Model = mongoose.model('Model', modelSchema)
var Manufactor = mongoose.model('Manufactor', manufactorSchema)
var Released = mongoose.model('Released', releasedSchema)
var AfterCrash = mongoose.model('AfterCrash', afterCrashSchema)
var Running = mongoose.model('Running', runningSchema)
var BodyType = mongoose.model('BodyType', bodyTypeSchema)
var GearboxType = mongoose.model('GearboxType', gearboxTypeSchema)
var DrivetrainType = mongoose.model('DrivetrainType', drivetrainTypeSchema)
var Color = mongoose.model('Color', colorSchema)
var FuelType = mongoose.model('FuelType', fuelTypeSchema)
var CarAd = mongoose.model('CarAd', carAdSchema)

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
	if(await User.findOne({login: req.body.login})){
		res.status(409).json('User already exist')
	}
	else{
		let newUser = new User(req.body)
		newUser._id = new mongoose.Types.ObjectId()
		await newUser.save()
		let {password, ...userInfo} = newUser.toObject()
		res.status(201).json(userInfo)
	}
})

app.post('/login', async (req,res) => {
	let user
	if(req.headers.authorization.substr("Bearer ".length).length > 4){
		let token = req.headers.authorization.substr("Bearer ".length)
    	let decoded = jwt.verify(token, secret)
    	user = await User.findOne({_id: decoded.user._id})
	}
	else {
		if (req.body.password) {
			user = await User.findOne(req.body)
		}		
	}
	if(user) {
		let {password, ads, ...userInfo} = user.toObject()
		const token = jwt.sign({user: userInfo}, secret)
		res.status(201).json(token)
	}
	else{
		res.status(404).json('login or password is not correct')
	}
})

app.post('/getAd', async(req, res) => {
	let ad = null
	ad = await CarAd.findOne(req.body).populate({
		path: 'model',
		populate: {
			path: 'manufactor',
			select: 'name'
		},
		select: '-_id -ads -__v'
	}).populate({
		path: 'city',
		populate: {
			path: 'region',
			select: 'name'
		},
		select: '-_id -ads -__v'
	})
	.populate('user released aftercrash running bodyType fuelType gearboxType drivetrainType color','-_id -ads -__v')
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
    	a = await CarAd.countDocuments({user: decoded.user._id}, null)
	}
	else{
		a = await CarAd.countDocuments(req.body, null)
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
	a = await CarAd.find(params, null, { skip: index }).limit(10).populate({
		path: 'model',
		populate: {
			path: 'manufactor',
			select: 'name'
		},
		select: '-_id -ads -__v'
	}).populate({
		path: 'city',
		populate: {
			path: 'region',
			select: 'name'
		},
		select: '-_id -ads -__v'
	})
	.populate('user released aftercrash running bodyType fuelType gearboxType drivetrainType color','-_id -ads -__v')
	if(a.length > 0) {
		res.status(201).json({ads: a})
	}
	else{
		res.status(404)
	}
})

app.get('/getParams', async(req, res) => {
	let params = {}
	let rs = await Released.find({})
	params['released'] = rs
	let af = await AfterCrash.find({})
	params['aftercrash'] = af
	let rn = await Running.find({})
	params['running'] = rn
	let mf = await Manufactor.find({}, '-models')
	params['manufactor'] = mf
	let md = await Model.find({})
	params['model'] = md
	let rg = await Region.find({}, '-cities')
	params['region'] = rg
	let ct = await City.find({})
	params['city'] = ct
	let bt = await BodyType.find({})
	params['bodyType'] = bt
	let ft = await FuelType.find({})
	params['fuelType'] = ft
	let gt = await GearboxType.find({})
	params['gearboxType'] = gt
	let dt = await DrivetrainType.find({})
	params['drivetrainType'] = dt
	let cr = await Color.find({})
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
    let user = await User.findOne({_id: decoded.user._id}).select('login name phones')
    if(user){
    	res.status(201).json(user)
    }
    else{
    	res.status(404).json('not found')
    }
})

app.post('/changeUser', async (req,res) => {
	let token = req.headers.authorization.substr("Bearer ".length)
    let decoded = jwt.verify(token, secret)
    let user = await User.findOne({_id: decoded.user._id})
	if(user){
		for (prop in req.body){
			if (user[prop] && req.body[prop] != '') {
				user[prop] = req.body[prop]
			}
		}
		await user.save()
		let {password, ads, ...userInfo} = user.toObject()
		const token = jwt.sign({user: userInfo}, secret)
		res.status(201).json(token)
	}
	else{
		res.status(404).json('no such user')
	}
})

app.post('/getAdsbyUser', async(req, res) => {//?
	let token = req.headers.authorization.substr("Bearer ".length)
    let decoded = jwt.verify(token, secret)
	let user = await User.findOne({_id: decoded.user._id})
	let index = 1
	if(req.body.page){
		index = req.body.page * 10 - 10
	}
	a = await CarAd.find({user: user._id},null, { skip: index }).limit(10).populate({
		path: 'model',
		populate: {
			path: 'manufactor',
			select: 'name'
		},
		select: '-_id -ads -__v'
	}).populate({
		path: 'city',
		populate: {
			path: 'region',
			select: 'name'
		},
		select: '-_id -ads -__v'
	})
	.populate('user released aftercrash running bodyType fuelType gearboxType drivetrainType color','-_id -ads -__v')
	if(a.length > 0) {
		Promise.all(a).then(ads => ads? res.json({ads:ads}): res.status(404))
	}
	else{
		res.status(404)
	}
})

app.post('/createAd', async(req, res) => {
	if(req.headers.authorization.substr("Bearer ".length).length > 4){
		let token = req.headers.authorization.substr("Bearer ".length)
    	let decoded = jwt.verify(token, secret)
    	user = await User.findOne({_id: decoded.user._id})
		let ad = new CarAd(req.body)
		ad._id = new mongoose.Types.ObjectId()
		ad.user = decoded.user._id
		await ad.save()
		user.ads.push(ad._id)
		await user.save()
		let {password, ads, ...userInfo} = user.toObject()
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
		let flag = false
    	user = await User.findOne({_id: decoded.user._id})
    	user.ads.forEach(ad => {
    		if(ad == req.body.adId._id){
    			flag = true
    		}
    	})
    	if(flag){
			let ad = await CarAd.findOne(req.body.adId)
			user.ads.splice(user.ads.indexOf(ad._id), 1)
			await user.save()
			await CarAd.deleteOne(ad)
			let {password, ads, ...userInfo} = user.toObject()
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

db.on('error', console.error.bind(console, 'connection error:'))

db.once('open', function() {
});

app.get('/', async (req, res) => res.send("KolenValTrade"))

app.listen(4000, function () {
})