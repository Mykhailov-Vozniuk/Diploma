const redis = require('redis')
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const app = express()
const fetch = require("node-fetch");
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
const { promisify } = require("util");

client = redis.createClient()

client.on("error", function (err) {
console.log("Error: " + err);
});

const AsyncLrange = promisify(client.lrange).bind(client)
const AsyncHgetAll = promisify(client.hgetall).bind(client)
const AsyncHget = promisify(client.hget).bind(client)
const AsyncHmget = promisify(client.hmget).bind(client)
const AsyncHmset = promisify(client.hmset).bind(client)
const AsyncRpush = promisify(client.rpush).bind(client)
const AsyncHrandField = promisify(client.hrandfield).bind(client)
const AsyncLrem = promisify(client.lrem).bind(client)
const AsyncDel = promisify(client.del).bind(client)

let jmp = async function(){
	let regions
	await client.lrange('regions', 0, -1, async function(err,replies){
		regions = replies
		for (let e of regions){
			console.log(e)
			await client.hgetall(e, async function(err, replies) {
				console.log(replies)
			})
		}
	})
	await client.lrange('cities', 0, -1, async function(err,replies){
		cities = replies
		for (let e of cities){
			console.log(e)
			await client.hgetall(e, async function(err, replies) {
				console.log(replies)
			})
		}
	})
}
//jmp()

let lmp = async function(){
	let manufactors
	await client.lrange('manufactors', 0, -1, async function(err,replies){
		manufactors = replies
		for (let e of manufactors){
			console.log(e)
			await client.hgetall(e, async function(err, replies) {
				console.log(replies)
			})
		}
	})
	await client.lrange('models', 0, -1, async function(err,replies){
		models = replies
		for (let e of models){
			console.log(e)
			await client.hgetall(e, async function(err, replies) {
				console.log(replies)
			})
		}
	})
}
//lmp()

/*let regions
let cities

fetch('https://developers.ria.com/auto/states?api_key=3cbJxz8IpEvwHNJV9RkSP4k0195ijn0Hl5mALs2t', {
  method: 'GET',
  headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
})
.then(res => res.json())
.then(async data => {
	regions = data
	let i = 0
	let j = 0
	for(let elem of regions){
		let {value, ...name} = elem
		console.log(name.name + ' '+i)
		await client.hmset(`region:${i}`,"name", name.name, "value", `region:${i}`)
		await client.rpush(['regions', `region:${i}`])
		await fetch(`https://developers.ria.com/auto/states/${value}/cities?api_key=3cbJxz8IpEvwHNJV9RkSP4k0195ijn0Hl5mALs2t`, {
			method: 'GET',
			headers: {
			        'Content-Type': 'application/json',
			        'Accept': 'application/json'
			}
		})
		.then(r => r.json())
		.then(async d => {
			if (d.length>0){
				cities = d
				for(let el of cities){
					let {value, ...name} = el
					console.log(j)
					await client.hmset(`city:${j}`,"name", name.name, "region",`region:${i}`)
					await client.rpush(['cities', `city:${j}`])
					j++
				}
			}
			else{
				console.log(d)
			}
		})
		i++
	}
})

let manufactors
let models

fetch('https://developers.ria.com/auto/categories/1/marks?api_key=3cbJxz8IpEvwHNJV9RkSP4k0195ijn0Hl5mALs2t', {
  method: 'GET',
  headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
})
.then(res => res.json())
.then(async data => {
	manufactors = data
	let i = 0
	let j = 0
	for(let elem of manufactors){
		let {value, ...name} = elem
		console.log(name.name + ' '+i)//мб массив попадается
		await client.hmset(`manufactor:${i}`,"name", name.name, "value", `manufactor:${i}`)
		await client.rpush(['manufactors', `manufactor:${i}`])
		await fetch(`https://developers.ria.com/auto/categories/1/marks/${value}/models?api_key=3cbJxz8IpEvwHNJV9RkSP4k0195ijn0Hl5mALs2t`, {
			method: 'GET',
			headers: {
			        'Content-Type': 'application/json',
			        'Accept': 'application/json'
			}
		})
		.then(r => r.json())
		.then(async d => {
			if (d.length>0){
				models = d
				for(let el of models){
					let {value, ...name} = el
					console.log(j)
					await client.hmset(`model:${j}`,"name", name.name, "manufactor",`manufactor:${i}`)
					await client.rpush(['models', `model:${j}`])
					j++
				}
			}
			else{
				console.log(d)
			}
		})
		i++
	}
})

let fuelTypes = [
    { name: "Бензин"},
    { name: "Дизель"},
    { name: "Газ"},
    { name: "Газ/бензин"},
    { name: "Гибрид"},
    { name: "Электро"},
    { name: "Другое"},
    { name: "Газ метан"},
    { name: "Газ пропан-бутан"}
]

let gearboxTypes = [
    { name: "Ручная / Механика"},
    { name: "Автомат"},
    { name: "Типтроник"},
    { name: "Адаптивная"},
    { name: "Вариатор"}
]

let drivetrainTypes = [
    { name: "Передний"},
    { name: "Задний"},
    { name: "Полный"},
    { name: "4x4"}
]

let colors = [
    { name: "синий"},
    { name: "красный"},
    { name: "зелёный"},
    { name: "белый"},
    { name: "серый"},
    { name: "коричневый"},
    { name: "жёлтый"},
    { name: "серебристый"}
]

let bodyTypes

fetch('https://developers.ria.com/auto/categories/1/bodystyles?api_key=3cbJxz8IpEvwHNJV9RkSP4k0195ijn0Hl5mALs2t', {
  method: 'GET',
  headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
})
.then(res => res.json())
.then(async data => {
	bodyTypes = data
	let i = 0
	for(let bodyType of bodyTypes){
		await client.hmset(`bodyType:${i}`, "name", bodyType.name)
		await client.rpush(['bodyTypes', `bodyType:${i}`])
		i++
	}
	i=0
	for(let fuelType of fuelTypes){
		await client.hmset(`fuelType:${i}`, 'name', fuelType.name)
		await client.rpush(['fuelTypes', `fuelType:${i}`])
		i++
	}
	i=0
	for(let gearboxType of gearboxTypes){
		await client.hmset(`gearboxType:${i}`, 'name', gearboxType.name)
		await client.rpush(['gearboxTypes', `gearboxType:${i}`])
		i++
	}
	i=0
	for(let drivetrainType of drivetrainTypes){
		await client.hmset(`drivetrainType:${i}`, 'name', drivetrainType.name)
		await client.rpush(['drivetrainTypes', `drivetrainType:${i}`])
		i++
	}
	i=0
	for(let color of colors){
		await client.hmset(`color:${i}`, 'name', color.name)
		await client.rpush(['colors', `color:${i}`])
		i++
	}
})*/

let params = {}
async function foo() {
	/*let tmp = []//удаление пустых производителей без моделей
	tmp.push(AsyncLrange('manufactors', 0, -1), AsyncLrange('models', 0, -1))
	Promise.all(tmp)
	.then(async response =>{
		let arr = []
		for (let e of response[1]){
			arr.push(AsyncHgetAll(e))
		}
		await Promise.all(arr)
		.then(async rep => {
			let mas = []
			response[0].forEach(e => {
				let j = rep.filter(r => r.manufactor === e)
				if(j.length < 1){
					mas.push(AsyncLrem('manufactors', 1, e))
					mas.push(AsyncDel(e))
				}
			})
			Promise.all(mas)
			.then(r => {
				console.log(r)
			})
		})
	})*/
	let params = {}
	params['region'] = []
	params['city'] = []
	params['manufactor'] = []
	params['model'] = []
	params['fuelType'] = []
	params['bodyType'] = []
	params['gearboxType'] = []
	params['drivetrainType'] = []
	params['color'] = []
	let tmp = []
	tmp.push(AsyncLrange('regions', 0, -1), AsyncLrange('cities', 0, -1), AsyncLrange('manufactors', 0, -1), AsyncLrange('models', 0, -1), AsyncLrange('fuelTypes', 0, -1), AsyncLrange('bodyTypes', 0, -1), AsyncLrange('gearboxTypes', 0, -1), AsyncLrange('drivetrainTypes', 0, -1), AsyncLrange('colors', 0, -1))
	Promise.all(tmp)
	.then(async response => {
		let i = 0
		for(let elem in params){
			let arr = []
			let arr2 = []
			for (let e of response[i]){
				arr.push(AsyncHgetAll(e))
				arr2.push(e)
			}
			await Promise.all(arr)
			.then(rep => {
				let j = 0
				rep.forEach(elem => {
					elem._id = arr2[j]
					j++
				})
				params[elem] = rep
			})
			if(elem != 'city' && elem != 'model'){
				params[elem] = response[i]
			}
			i++
		}
		params['released'] = ['0', '1']
		params['aftercrash'] = ['0', '1']
		params['running'] = ['0', '1']
		let max = 0
		let amount = 9940
		AsyncLrange('ads', 0, -1)
		.then(async resp => {
			for(let j = 0; j < resp.length; j++){
				max = parseInt(resp[j].split(':')[1], 10) > max ? parseInt(resp[j].split(':')[1], 10) : max
			}
			max++
			let newMax = max
			let mas = []
			for(let i=0; i<amount; i++){
				let obj = {}
				for(let param in params){
					obj[param] = params[param][Math.floor(Math.random() * params[param].length)]
				}
				let tmp = params['model'].filter(e => e.manufactor === obj.manufactor)
				obj['model'] = tmp[Math.floor(Math.random() * tmp.length)]._id
				tmp = params['city'].filter(e => e.region === obj.region)
				obj['city'] = tmp[Math.floor(Math.random() * tmp.length)]._id
				obj.productionDate = (Math.floor(Math.random() * (2020 - 1950)) + 1950).toString()
				obj.price = (Math.floor(Math.random() * (100000 - 1000)) + 1000).toString()
				obj.description = 'sample text'
				obj.user = 'user:1'
				obj.photos = ''
				AsyncHmset(`ad:${newMax}`, obj)
				newMax++
			}
			Promise.all(mas)
			.then(async res => {
				for(let i = max; i<amount+max ;i++){
					await AsyncRpush('ads',`ad:${i}`)
				}
				console.log('done')
			})
		})		
	})
}
//foo()

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
	AsyncLrange('users', 0, -1)
	.then(async resp => {
		let max = 0
		let arr = []
		for(let i = 0; i < resp.length; i++){
			arr.push(AsyncHget(resp[i], 'login'))
			max = resp[i].split(':')[1] > max ? resp[i].split(':')[1] : max
		}
		await Promise.all(arr)
		.then(r => {
			if (r.filter(e => e == req.body.login).length > 0){
				res.status(409).json('User already exist')
			}
			else{
				max++
				AsyncHmset(`user:${max}`,req.body)
				.then(async t => {
					console.log(t)
					await AsyncRpush('users',`user:${max}`)
					res.status(201).json('success')
				})
			}
		})
	})
})

app.post('/login', async (req,res) => {
	let user
	if(req.headers.authorization.substr("Bearer ".length).length > 4){
		let token = req.headers.authorization.substr("Bearer ".length)
    	let decoded = jwt.verify(token, secret)
    	user = await AsyncHgetAll(decoded.user._id)
	}
	else {
		if (req.body.password) {
			let {login, ...userInfo} = req.body
			await AsyncLrange('users', 0, -1)
			.then(async resp => {
				let arr = []
				let arr2 = []
				for(let i = 0; i < resp.length; i++){
					arr.push(AsyncHgetAll(resp[i]))
					arr2.push(resp[i])
				}
				await Promise.all(arr)
				.then(r => {
					let j = 0
					r.forEach(elem => {
						elem._id = arr2[j]
						j++
					})
					user = r.filter(e => e.login+e.password == req.body.login+req.body.password)[0]
				})
			})
		}
	}
	if(user) {
		console.log(user)
		let {password, ...userInfo} = user
		const token = jwt.sign({user: userInfo}, secret)
		console.log('token')
		console.log(token)
		res.status(201).json(token)
	}
	else{
		res.status(404).json('login or password is not correct')
	}
})

app.post('/getAd', async(req, res) => {
	let ad = null
	AsyncHgetAll(req.body._id)
	.then(async resp => {
		let arr = resp.photos.split('|razdelitel|')//без последнего
		arr.pop()
		ad = resp
		ad.photos = arr
		ad.user = await AsyncHmget(ad.user, 'name', 'phone')
		ad.bodyType = await AsyncHmget(ad.bodyType, 'name')
		ad.manufactor = await AsyncHmget(ad.manufactor, 'name')
		ad.model = await AsyncHmget(ad.model, 'name')
		ad.region = await AsyncHmget(ad.region, 'name')
		ad.city = await AsyncHmget(ad.city, 'name')
		console.log(ad)
		if(ad) {
			res.status(201).json(ad)
		}
		else{
			res.status(404)
		}
	})
})

app.post('/getAdsCount', async(req, res) => {
	let ads
	if(req.headers.authorization){
		let token = req.headers.authorization.substr("Bearer ".length)
	    let decoded = jwt.verify(token, secret)
	    let user = await AsyncHgetAll(decoded.user._id)
		user._id = decoded.user._id
		await AsyncLrange('ads', 0, -1)
			.then(async resp => {
				console.log('resp')
				console.log(resp)
				let arr = []
				for(let i = 0; i < resp.length; i++){
					arr.push(AsyncHmget(resp[i], 'user'))
				}
				await Promise.all(arr)
				.then(r => {
					ads = r.filter(e => e[0] == user._id)
					if(ads){
						console.log('ads')
						console.log(ads)
						let pages = Math.ceil(ads.length/10)
						console.log('pages')
						console.log(pages)
						res.status(201).json({pages: pages})
					}
					else{
						res.status(404)
					}
				})
			})
	}
	else{
		console.log('req.body')
		console.log(req.body)
		await AsyncLrange('ads', 0, -1)
			.then(async resp => {
				let arr = []
				if(Object.keys(req.body).length === 0){
					console.log('pusto')
					for(let i = 0; i < resp.length; i++){
						arr.push(AsyncHrandField(resp[i], 1))
					}
				}
				else{
					for(let i = 0; i < resp.length; i++){
						arr.push(AsyncHmget(resp[i], Object.keys(req.body)))
					}
				}
				await Promise.all(arr)
				.then(r => {
					let mas
					if(Object.keys(req.body).length != 0){
						mas = r.filter(e => e.join() == Object.values(req.body).join())
					}
					else{
						console.log('pusto2')
						mas = r//от паралелльных юзов может 2 раза лет заюзать и вылететь ошибка
					}
					if(mas){
						console.log('ads')
						console.log(mas.length)
						let pages = Math.ceil(mas.length/10)
						console.log('pages')
						console.log(pages)
						res.status(201).json({pages: pages})//возвращать ещё и айди подходящих объяв
					}
					else{
						res.status(404)
					}
				})
			})
	}
})

app.post('/getAds', async(req, res) => {
	let {pages, ...params} = req.body
	let index = 1
	if(params.page){
		index = params.page * 10 - 10
		delete params.page
	}
	//a = await CarAd.find(params, null, { skip: index })
	let ads = []
	console.log('getAds index', index)
	AsyncLrange('ads', 0, -1)//index, index+10)
		.then(async resp => {
			let arr = []
			let arr2 = []
			for(let i = 0; i < resp.length; i++){
				arr.push(AsyncHgetAll(resp[i]))
				console.log('i ', i)//без этого почему-то зависает
				arr2.push(resp[i])
			}
			Promise.all(arr)
			.then(async r => {
				console.log(r.length)
				let flag = false
				let i = 0
				r.forEach(elem => {
					if(Object.keys(params).length != 0){
						for(let j in params){
							if(params[j] == elem[j]){
								flag = true
							}
							else{
								flag = false
							}
						}
					}
					else{
						flag = true
					}
					elem._id = arr2[i]
					i++
					if(flag){
						ads.push(elem)
					}
				})
				if(ads.length > 0) {
					let mas = ads.slice(index, index+10)
					let i = 0
					mas.forEach(async e => {
						let tmp = {}
						let arr = e.photos.split('|razdelitel|')//без последнего
						arr.pop()
						e.photos = arr
						tmp.manufactor = await AsyncHmget(e.manufactor, 'name')
						tmp.model = await AsyncHmget(e.model, 'name')
						tmp.region = await AsyncHmget(e.region, 'name')
						tmp.city = await AsyncHmget(e.city, 'name')
						e.manufactor = tmp.manufactor[0]
						e.model = await tmp.model[0]
						e.region = await tmp.region[0]
						e.city = await tmp.city[0]
						if(i === mas.length - 1){
							res.status(201).json({ads: mas})
						}
						i++
					})				
				}
				else{
					res.status(404)
				}
			})
		})
})

app.get('/getParams', async(req, res) => {
	let params = {}
	params['region'] = []
	params['city'] = []
	params['manufactor'] = []
	params['model'] = []
	params['fuelType'] = []
	params['bodyType'] = []
	params['gearboxType'] = []
	params['drivetrainType'] = []
	params['color'] = []
	let tmp = []
	tmp.push(AsyncLrange('regions', 0, -1), AsyncLrange('cities', 0, -1), AsyncLrange('manufactors', 0, -1), AsyncLrange('models', 0, -1), AsyncLrange('fuelTypes', 0, -1), AsyncLrange('bodyTypes', 0, -1), AsyncLrange('gearboxTypes', 0, -1), AsyncLrange('drivetrainTypes', 0, -1), AsyncLrange('colors', 0, -1))
	Promise.all(tmp)
	.then(async response => {
		let i = 0
		for(let elem in params){
			let arr = []
			let arr2 = []
			for (let e of response[i]){
				arr.push(AsyncHgetAll(e))
				arr2.push(e)
			}
			await Promise.all(arr)
			.then(rep => {
				let j = 0
				rep.forEach(elem => {
					elem._id = arr2[j]
					j++
				})
				params[elem] = rep
			})
			i++
		}
		params['released'] = [{_id: '0', label: 'yes'},{_id: '1', label: 'no'}]
		params['aftercrash'] = [{_id: '0', label: 'yes'},{_id: '1', label: 'no'}]
		params['running'] = [{_id: '0', label: 'yes'},{_id: '1', label: 'no'}]
		if(params) {
			res.status(201).json(params)
		}
		else{
			res.status(404).json('not found')
		}
	})
})

app.use(jwtWare())

app.get('/getUser', async(req, res) => {
	let token = req.headers.authorization.substr("Bearer ".length)
    let decoded = jwt.verify(token, secret)
    let tmp = await AsyncHmget(decoded.user._id,'login', 'name', 'phone')
    let user = {
    	login:tmp[0],
    	name:tmp[1],
    	phone:tmp[2]
    }
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
    let user = await AsyncHgetAll(decoded.user._id)
	user._id = decoded.user._id
	if(user){
		for (prop in req.body){
			if (user[prop] && req.body[prop] != '') {
				user[prop] = req.body[prop]
			}
		}
		console.log(user)
		AsyncHmset(decoded.user._id, user)
			.then(resp => {
				console.log(resp)
				let {password, ...userInfo} = user
				const token = jwt.sign({user: userInfo}, secret)
				console.log('token')
				console.log(token)
				res.status(201).json(token)
			})		
	}
	else{
		res.status(404).json('no such user')
	}
})

app.post('/getAdsbyUser', async(req, res) => {//?
	let token = req.headers.authorization.substr("Bearer ".length)
	let decoded = jwt.verify(token, secret)
	let user = await AsyncHgetAll(decoded.user._id)
	user._id = decoded.user._id
	let {pages, ...params} = req.body
	params.user = user._id
	let index = 1
	if(params.page){
		index = params.page * 10 - 10
		delete params.page
	}
	//a = await CarAd.find(params, null, { skip: index })
	let ads = []
	console.log('index', index)
	await AsyncLrange('ads', 0, -1)//index, index+10)
		.then(async resp => {
			//console.log('resp',resp)
			let arr = []
			let arr2 = []
			for(let i = 0; i < resp.length; i++){
				arr.push(AsyncHgetAll(resp[i]))
				console.log('i ', i)//без этого почему-то зависает
				arr2.push(resp[i])
			}
			await Promise.all(arr)
			.then(r => {
				let flag = false
				let i = 0
				r.forEach(async elem => {
					for(let j in params){
						if(params[j] == elem[j]){
							flag = true
						}
						else{
							flag = false
						}
					}
					elem._id = arr2[i]
					i++
					if(flag){
						ads.push(elem)
					}
				})
				if(ads.length > 0) {
					let mas = ads.slice(index, index+10)
					let i = 0
					mas.forEach(async e => {
						let tmp = {}
						let arr = e.photos.split('|razdelitel|')//без последнего
						arr.pop()
						e.photos = arr
						tmp.manufactor = await AsyncHmget(e.manufactor, 'name')
						tmp.model = await AsyncHmget(e.model, 'name')
						tmp.region = await AsyncHmget(e.region, 'name')
						tmp.city = await AsyncHmget(e.city, 'name')
						e.manufactor = tmp.manufactor[0]
						e.model = await tmp.model[0]
						e.region = await tmp.region[0]
						e.city = await tmp.city[0]
						if(i === mas.length - 1){
							console.log(mas)
							res.status(201).json({ads: mas})
						}
						i++
					})
				}
				else{
					res.status(404)
				}
			})
		})
})

app.post('/createAd', async(req, res) => {
	if(req.headers.authorization.substr("Bearer ".length).length > 4){
		let token = req.headers.authorization.substr("Bearer ".length)
    	let decoded = jwt.verify(token, secret)
    	let user = await AsyncHgetAll(decoded.user._id)
    	user._id = decoded.user._id
    	let {photos, ...adInfo} = req.body
    	adInfo.photos = ''
    	photos.forEach(photo => {
    		adInfo.photos += photo
    		adInfo.photos += '|razdelitel|'
    	})
    	console.log(adInfo.photos.split('|razdelitel|').length)
		adInfo.user = user._id
		console.log(adInfo)
    	AsyncLrange('ads', 0, -1)
		.then(async resp => {
			let max = 0
			let arr = []
			for(let i = 0; i < resp.length; i++){
				max = resp[i].split(':')[1] > max ? resp[i].split(':')[1] : max
			}
			max++
			AsyncHmset(`ad:${max}`,adInfo)
			.then(async t => {
				await AsyncRpush('ads',`ad:${max}`)
				let {password, ...userInfo} = user
				token = jwt.sign({user: userInfo}, secret)
				res.status(201).json(token)
			})
		})
	}
	else{
		res.status(409).json('unauthorized')
	}
})

app.delete('/deleteAd', async(req, res) => {
	if(req.headers.authorization.substr("Bearer ".length).length > 4){
		let token = req.headers.authorization.substr("Bearer ".length)
    	let decoded = jwt.verify(token, secret)
    	let user = await AsyncHgetAll(decoded.user._id)
    	user._id = decoded.user._id
		let flag = false
		if(req.body.ad.user === decoded.user._id){
			flag = true
		}
    	if(flag){
    		await AsyncLrem('ads', 1, req.body.ad._id)
    		await AsyncDel(req.body.ad._id)
			let {password, ...userInfo} = user
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