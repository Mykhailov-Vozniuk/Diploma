import React from 'react';
import logo from './logo.svg';
import './App.css';
import './search.css';
import './ads.css';

import {createStore, combineReducers, applyMiddleware} from 'redux';
import {Provider, connect} from 'react-redux';

import {Router, Route, Link, Switch} from 'react-router-dom';
import Select from 'react-select'
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import Resizer from 'react-image-file-resizer';
import AliceCarousel from 'react-alice-carousel';
import 'react-alice-carousel/lib/alice-carousel.css';
import Pager from 'react-pager';

const history = require("history")
const createHistory = history.createBrowserHistory
const createdHistory = createHistory()
const jwtDecode = require('jwt-decode');

const forbidden = [
  'ass',
  'bitch',
  'chert'
]

const historyReducer = (state, action) => {
  const {type} = action
  if(!state || type === 'CLEAR'){
    return {
      status: '',
      ads: []
    }
  }
  if(type === 'ADS'){
    return {
      ...state,
      status: 'SENT',
      ads: action.ads
    }
  }
  if(type === 'ADS_PENDING'){
    return {
      ...state,
      status: 'SENDING'
    }
  }
  if(type === 'SEARCH'){
    return{
      ...state,
      obj: action.obj
    }
  }
  return state
}

const searchReducer = (state, action) => {
  const {type} = action
  if(!state){
    return {
      status: '',
      params: []
    }
  }
  if(type === 'PARAMS'){
    return {
      ...state,
      status: 'SENT',
      params: action.params
    }
  }
  if(type === 'PARAMS_PENDING'){
    return {
      ...state,
      status: 'SENDING'
    }
  }
  return state
}



const logRegReducer = (state, action) => {
  const {type} = action
  if(!state){
    return{
      status: 'NONE'
    }
  }
  if(type === 'SENT'){
    return{
      ...state,
      status: 'SENT'
    }
  }
  if(type === 'SENDING'){
    return {
      ...state,
      status: 'SENDING'
    }
  }
  if(type === 'FAILED'){
    return {
      ...state,
      status: 'FAILED'
    }
  }
  return state
}

const rootReducer = combineReducers({history: historyReducer, search: searchReducer, logReg: logRegReducer})

const store = createStore(rootReducer)
const delay = ms => new Promise(ok => setTimeout(ok,ms))

store.subscribe(() => console.log('store.getState ', store.getState()))

const logout = function() {
  localStorage.removeItem('tokenavelli')
  createdHistory.push('/')
  window.location.reload()
}

const actionADS = (obj) => {
  fetch("/getAds",{
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(obj)
  })
  .then(res => res.json())
  .then(ads => {
    store.dispatch({type: 'ADS', ads: ads.ads})
  })
  return {
    type: 'ADS_PENDING'
  }
}

const actionUserADS = (obj) => {
  fetch('/getAdsbyUser', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('tokenavelli')
    },
    body: JSON.stringify(obj)
  })
  .then(res => res.json())
  .then(ads => {
    store.dispatch({type: 'ADS', ads: ads.ads, pages:ads.pages})
  })
  return {
    type: 'ADS_PENDING'
  }
}

const actionDeleteAd = (obj) => {
  fetch('/deleteAd', {
    method: 'DELETE',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('tokenavelli')
    },
    body: JSON.stringify(obj)
  }).then(res => res.json())
    .then(json => {
    localStorage.setItem("tokenavelli", json)
    store.dispatch(actionUserADS())
  })
  return {
    type: 'DELETING'
  }
}

const actionParams = () => {
  fetch('/getParams', {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  })
    .then(res => res.json())
    .then(params => {
      store.dispatch({type: 'PARAMS', params})
    })
  return {
    type: 'PARAMS_PENDING'
  }
}

const actionCreateAd = (obj) => {
  fetch('/createAd', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('tokenavelli')
  },
    body: JSON.stringify(obj)
  })
  .then(res => 
      res.status === 201? res.json() : store.dispatch({type: 'FAILED'})
    )
  .then(json => {
    localStorage.setItem("tokenavelli", json)
    store.dispatch({type: 'SENT'})
    store.dispatch(actionADS())
    createdHistory.push('/')
  })
  return {type: 'SENDING'}
}

const actionRegister = (mail, password, name, phone) => {
  fetch('/register', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({login: mail, password: password, name: name, phones: [phone]})
  })
    .then(res => {
      if(res.status === 201){
        return res.json()
      }
      else{
        return 'error'
      }
    }
    )
    .then(json => {
      if(json == 'error'){
        store.dispatch({type: 'FAILED'})
      }
      else{        
        createdHistory.push('/login')
        store.dispatch({type: 'SENT'})//returns userInfo
      }
    })
  return {type: 'SENDING'}
}

const actionChangeUser = (mail, password, name, phone) => {
  fetch('/changeUser', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('tokenavelli')
    },
    body: JSON.stringify({login: mail, password: password, name: name, phones: [phone]})
  })
    .then(res => 
      res.status === 201? res.json() : store.dispatch({type: 'FAILED'})
    )
    .then(json => {
      localStorage.setItem("tokenavelli", json)
      store.dispatch({type: 'SENT'})
      window.location.reload()
    })
  return {type: 'SENDING'}
}

const actionLogin = (login, password) => {
  fetch('/login', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('tokenavelli')
    },
    body: JSON.stringify({login: login, password: password})
  })
    .then(res => {
      if(res.status === 201){
        return res.json()
      }
      else{
        return 'error'
      }
    }
    )
    .then(json => {
      if(json == 'error'){
        store.dispatch({type: 'FAILED'})
      }
      else{
        localStorage.setItem("tokenavelli", json)
        store.dispatch({type: 'SENT'})
        createdHistory.push('/')
        window.location.reload()
      }
    })
  return {type: 'SENDING'}
}

class LoginForm extends React.Component {
  static get defaultProps(){
    return {
      onSend() {
        throw new ReferenceError('You forgot to set onSend prop')
      }
    }
  }

  constructor(props){
    super(props)
    this.state = {
      login: '', 
      password: '',
      formErrors: {login: '', password: ''},
      loginValid: false,
      passwordValid: false,
      formValid: false
    }
  }

  handleUserInput = (e) => {
    const name = e.target.name
    const value = e.target.value
    this.setState({[name]: value}, () => this.validateField(name, value))
  }

  validateField(fieldName, value) {
    let fieldValidationErrors = this.state.formErrors
    let loginValid = this.state.loginValid
    let passwordValid = this.state.passwordValid

    switch(fieldName) {
      case 'login':
        loginValid = value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i)
        fieldValidationErrors.login = loginValid ? '' : ' is invalid'
        break;
      case 'password':
        passwordValid = value.length >= 6
        fieldValidationErrors.password = passwordValid ? '': ' is too short'
        break;
      default:
        break;
    }
    this.setState(
      {
        formErrors: fieldValidationErrors,
        loginValid: loginValid,
        passwordValid: passwordValid
      }, 
      this.validateForm
    )
  }

  validateForm() {
    this.setState({formValid: this.state.loginValid && this.state.passwordValid});
  }

  errorClass(error) {
    return(error.length === 0 ? '' : 'has-error');
  }

  render () {
    return(
      <div class = 'logReg'>
        <div class='log'>
          <label>
            <p>Login</p>
            <input name='login' value = {this.state.login}
              onChange = {this.handleUserInput}
            />
          </label>
          <label>
            <p>Password</p>
            <input name='password' value = {this.state.password} type = "password"
              onChange = {this.handleUserInput}
            />
          </label>
          <button class="btn btn-warning" onClick = {() => {
            this.props.onSend(this.state.login, this.state.password)
            this.setState({login: '', password: ''})
          }} disabled={this.props.status === 'SENDING' || !this.state.formValid}>SEND</button>
        </div>
        {Object.keys(this.state.formErrors).map((fieldName, i) => {
          if(this.state.formErrors[fieldName].length > 0){
            return (
              <p class='error' key={i}>{fieldName} {this.state.formErrors[fieldName]}</p>
            )        
          } else {
            return '';
          }
        })}
      </div>
    )
  }
}

class RegisterForm extends React.Component {
  static get defaultProps(){
    return {
      onSend() {
        throw new ReferenceError('You forgot to set onSend prop')
      }
    }
  }

  constructor(props){
    super(props)
    this.state = {
      login: '', 
      password: '',
      name: '',
      phone: '',
      formErrors: {login: '', password: '', name: '', phone: ''},
      loginValid: false,
      passwordValid: false,
      nameValid: false,
      phoneValid: false,
      formValid: false,
      flag: false,
      user: {}
    }
  }

  handleUserInput = (e) => {
    const name = e.target.name
    const value = e.target.value
    this.setState({[name]: value}, () => this.validateField(name, value))
  }

  validateField(fieldName, value) {
    let fieldValidationErrors = this.state.formErrors
    let loginValid = this.state.loginValid
    let passwordValid = this.state.passwordValid
    let nameValid = this.state.nameValid
    let phoneValid = this.state.phoneValid

    switch(fieldName) {
      case 'login':
        loginValid = value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i)
        fieldValidationErrors.login = loginValid ? '' : ' is invalid'
        break;
      case 'password':
        passwordValid = value.length >= 6
        fieldValidationErrors.password = passwordValid ? '': ' is too short'
        break;
      case 'name':
        nameValid = forbidden.indexOf(value.toLowerCase()) === -1
        fieldValidationErrors.name = nameValid ? '': ' is forbidden'
        break;
      case 'phone':
        phoneValid = value.match(/^\+?3?8?(0[5-9][0-9]\d{7})$/i)
        fieldValidationErrors.phone = phoneValid ? '': ' is invalid'
        break;
      default:
        break;
    }
    this.setState(
      {
        formErrors: fieldValidationErrors,
        loginValid: loginValid,
        passwordValid: passwordValid,
        nameValid: nameValid,
        phoneValid: phoneValid
      }, 
      this.validateForm
    )
  }

  validateForm() {
    this.setState({formValid: this.state.loginValid && this.state.passwordValid && this.state.nameValid && this.state.phoneValid});
  }

  errorClass(error) {
    return(error.length === 0 ? '' : 'has-error');
  }

  render () {
    if(this.props.type == 'changeUser' && this.state.flag==false){
      return(
        <button class="btn btn-warning changeUser" onClick = {() => {   
          fetch('/getUser', {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + localStorage.getItem('tokenavelli')
            }
          })
            .then(res => 
              res.json()
            )
            .then(json => {
              this.setState({flag: true, login: json.login, password: '', name: json.name, phone: json.phones[0], loginValid: true,
              nameValid: true, phoneValid: true})
            })
            }
        } >Change profile</button>
      )
    }
    return(
      <div class='logReg'>
        <div class='reg'>
          <label>
            <p>Login</p>
            <input name='login' value = {this.state.login}
              onChange = {this.handleUserInput}
            />
          </label>
          <label>
          <p>Password</p>
            <input name='password' value = {this.state.password} type = "password"
              onChange = {this.handleUserInput}
            />
          </label>
          <label>
          <p>Name</p>
            <input name='name' value = {this.state.name}
              onChange = {this.handleUserInput}
            />
          </label>
          <label>
          <p>Phone</p>
            <input name='phone' value = {this.state.phone}
              onChange = {this.handleUserInput}
            />
          </label>
          <button class="btn btn-warning" onClick = {() => {
            this.props.onSend(this.state.login, this.state.password, this.state.name, this.state.phone)          
            this.setState({login: '', password: '', name: '', phone: ''})
          }} disabled={this.props.status === 'SENDING' || !this.state.formValid}>SEND</button>
        </div>
        {Object.keys(this.state.formErrors).map((fieldName, i) => {
          if(this.state.formErrors[fieldName].length > 0){
            return (
              <p class='error' key={i}>{fieldName} {this.state.formErrors[fieldName]}</p>
            )        
          } else {
            return '';
          }
        })}
      </div>
    )
  }
}

class SearchForm extends React.Component{
  constructor(props){
    super(props)
    this.default = {}
    this.state = {
      params: [],
      className: 'SearchForm'
    }
  }

  componentDidMount(){
    fetch('/getParams', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
    .then(res => res.json())
    .then(params => {
      if(params){
        for(let param in params){
          params[param].forEach(elem => {
            if(elem._id){
              elem.value = elem._id
              delete elem._id
            }
            if(elem.name){
              elem.label = elem.name            
              delete elem.name
            }
          })
        }
      }
      let obj = {}
      for(let param in params){
        obj[param] = {}
      }
      obj.params = params
      if(this.props.type === 'create'){
        obj.photos = []
        obj.description = ''
        obj.price = ''
        obj.productionDate = ''
      }
      this.default = obj
      this.setState(obj)
    })
  }

  filteredOptions = (opt, param) => {
    return opt.filter(optn => optn[param] === this.state[param].value)
  }

  handleUserInput = (e) => {
    this.setState({[e.target.name]: e.target.value})
  }

  notReadyToSend() {
    let notReady = false
    for(let param in this.state){
      if(param != 'params'){
        if(Object.keys(this.state[param]).length === 0 && this.state[param].constructor === Object || this.state[param] === ''){
          notReady = true
        }
      }
    }
    return notReady
  }

  render(){
    let inputs = []
    if(this.props.type === 'create'){
      inputs.push(
        <div class="input">
          <label>
            <p>цена $</p>
            <input name='price' value = {this.state.price}
              onChange = {this.handleUserInput}
            />
          </label>
        </div>
      )
      inputs.push(
        <div class="input">
          <label>
            <p>год выпуска</p>
            <input name='productionDate' value = {this.state.productionDate}
              onChange = {this.handleUserInput}
            />
          </label>
        </div>
      )
      inputs.push(
        <div class="input">
          <label>
            <input type="file" id="file" name="myImage" multiple accept="image/jpeg" 
              onInput={(event)=> {
                let photos = []
                let fileInput = false
                if(event.target.files[0]) {
                  fileInput = true
                }
                if(fileInput) {
                  for(let photo of event.target.files){
                    Resizer.imageFileResizer(
                      photo,
                      1000,
                      1000,
                      'JPEG',
                      100,
                      0,
                      uri => {
                          photos.push(uri)
                      },
                      'base64'
                    )
                  }
                }
                this.setState({photos: photos})
            }}/>
          </label>
        </div>
      )
      inputs.push(
        <div class="description">
          <label>
            <p>description</p>
            <textarea name='description' cols = '100' rows = '10' maxlength = '1000' value = {this.state.description}
              onChange = {this.handleUserInput}
            />
          </label>
        </div>
      )
    }
    let {params, className, ...obj} = this.state//объект со всеми массивами
    let selects = []
    for(let param in params){
      let options = []
      let key = Object.keys(params[param][0]).filter(k => ['__v', 'value', 'label'].indexOf(k) === -1)//проверка свойства
      if(key[0]){
        options = this.filteredOptions(params[param], key[0])
      }
      else{
        options = params[param]
      }
      selects.push(
        <div key = {param} class='opt'>
          <label>
            {param.toString()}
            <Select
              value = {this.state[param]}
              id={param.toString()}
              name={param.toString()}
              options={options}
              className="basic-multi-select"
              classNamePrefix="select"
              onChange = {o => {
                let field = this.state[param]
                this.setState({[param]: o})
              }}
            />
          </label>        
        </div>
      )
    }
    for(let field in obj){
      if(typeof obj[field] === 'string' && obj[field] != ''){
        continue
      }
      if(obj[field].value != undefined){
        obj[field] = obj[field].value
      }
      else{
        delete obj[field]
      }
    }
    if(this.props.type === 'create'){
      obj.photos = this.state.photos
    }
    return(
      <div class={className}>
        <div class="selects-container">
          {selects}
        </div>
        {inputs}
        <div class='btn-container'>
          <button class='btn btn-secondary' onClick={() => {
            if(this.props.type === 'create'){
              actionCreateAd(obj)
            }
            if(this.props.type === 'search'){
              let path = `/search/${JSON.stringify(obj)}`
              createdHistory.push(path)
              this.setState(this.default)
            }
          }} disabled = {this.props.type === 'create' && this.notReadyToSend()}>{this.props.type}</button>
        </div>
      </div>
    )
  }
}

class RedirectButton extends React.Component{
  constructor(props){
    super(props)
    this.state = {...props}
  }

  render(){
    return(
      <Link class={this.state.class} to={this.state.path}>{this.state.name}</Link>
    )
  }
}

class Ads extends React.Component {
  constructor(props){
    super(props)
    this.handlePageChanged = this.handlePageChanged.bind(this);
    this.state = {...props}
    this.state = {
      ads: [],
      total: 1,
      current: 0
    }
  }

  handlePageChanged(newPage) {
    if(this.props.type == 'ads'){
      let obj = JSON.parse(this.props.match.params.json)
      obj.page = newPage+1
      actionADS(obj)
      this.setState({current : newPage });
    }
    if(this.props.type == 'userAds'){
      actionUserADS({page: newPage+1})
      this.setState({current : newPage });
    }
  }

  componentDidMount() {
    store.dispatch({type: 'CLEAR'})
    if(this.props.type == 'ads'){
      let obj = JSON.parse(this.props.match.params.json)
      fetch("/getAdsCount",{
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(obj)
      })
      .then(res => res.json())
      .then(json => {
        this.setState({total: json.pages})
        obj.page = this.state.current+1
        actionADS(obj)
      })
    }
    if(this.props.type == 'userAds'){
      fetch("/getAdsCount",{
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('tokenavelli')
        }
      })
      .then(res => res.json())
      .then(json => {
        this.setState({total: json.pages})
        actionUserADS({page: this.state.current+1})
      })      
    }
  }

  render(){
    let ads = []
    if(this.props.type == 'userAds'){
      for(let ad of this.props.ads){
        ads.push(
          <div class='ad' id={ad._id}>
            <img class = "preview" src={ad.photos[0]} alt='Машина'></img>
            <div>
              <h4>{ad.model.manufactor.name} {ad.model.name}</h4> <h5>{ad.price}$</h5>
              <h4>{ad.city.region.name} область, город {ad.city.name}</h4>
              <p>
                year of production {ad.productionDate}
              </p>
              <Link class='btn btn-light' to={`/ad/${ad._id}`}>Go to</Link>
              <button class='btn btn-secondary delete' onClick={() => {
                this.props.onSend({adId: {_id: ad._id}})
              }}>delete</button>
            </div>            
          </div>
        )
      }
    }
    if(this.props.type == 'ads'){
      for(let ad of this.props.ads){
        ads.push(
          <div class='ad' id={ad._id}>
            <img class = "preview" src={ad.photos[0]} alt='Машина'></img>
            <div>
              <h4>{ad.model.manufactor.name} {ad.model.name}</h4> <h5>{ad.price}$</h5>
              <h4>{ad.city.region.name} область, город {ad.city.name}</h4>
              <p>
                year of production {ad.productionDate}
              </p>
              <Link class='btn btn-light' to={`/ad/${ad._id}`}>Go to</Link>
            </div>            
          </div>
        )
      }
    }
    return(
      <div>
        {ads}
        <div class='pag'>
          <div />
          <Pager class = 'pagination'
            total={this.state.total}
            current={this.state.current}
            visiblePages={10}
            titles={{ first: '<|', last: '>|' }}
            className="pagination-sm pull-right"
            onPageChanged={this.handlePageChanged}
          />
          <div />
        </div>
      </div>
    )
  }
}

class Advertisement extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      ad: null
    }
  }

  componentDidMount(){
    if(this.props.match.params){
      fetch('/getAd', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(this.props.match.params)
      })
      .then(res => res.json())
      .then(json => {
        if(json){
          this.setState({ad: json})
        }
      })
    }
  }

  render(){
    if(!this.state.ad){
      return(
        <div>
        </div>
      )
    }
    return(
      <div class='advertisement'>
        <AliceCarousel 
          items={this.state.ad.photos.map(photo => {
            return(
              <img class="carousel" src = {photo}/>
            )
          })}

        />
        <h4>{this.state.ad.model.manufactor.name} {this.state.ad.model.name}</h4> <h5>{this.state.ad.price}$</h5>
        <h4>{this.state.ad.city.region.name} область, город {this.state.ad.city.name}</h4>
        <h4>seller name {this.state.ad.user.name} phone {this.state.ad.user.phones[0]}</h4>
        <p>
          {this.state.ad.description} {this.state.ad.productionDate}
        </p>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
    ads: state.history.ads
})

let adConnected = connect(st => ({ads: st.history.ads, type: 'ads'}), null)(Advertisement)
let AdsHistoryConnected = connect(st => ({ads: st.history.ads, type: 'ads'}), null)(Ads)
let LoginConnected = connect(st => ({status: st.logReg.status}), {onSend: actionLogin})(LoginForm)
let RegisterConnected = connect(st => ({status: st.logReg.status, type: 'register'}), {onSend: actionRegister})(RegisterForm)
let ChangeUserConnected = connect(st => ({status: st.logReg.status, type: 'changeUser'}), {onSend: actionChangeUser})(RegisterForm)
let SearchConnected = connect(st => ({params: st.search.params, type: 'search'}), {onSend: actionADS})(SearchForm)
let CreateAdConnected = connect(st => ({params: st.search.params, type: 'create'}), {onSend: actionCreateAd})(SearchForm)
let UserAdsConnected = connect(st => ({ads: st.history.ads, pages: st.history.pages, type: 'userAds'}), {onSend : actionDeleteAd})(Ads)

function App() {
  let components
  if(localStorage.getItem('tokenavelli')){
    components = function(){
      return(
        <div class='nav-buttns'>
          <RedirectButton class='btn btn-warning' name='createAd' path='/createAd'/>
          <RedirectButton class='btn btn-light' name='profile' path='/profile'/>
          <Link class='btn btn-secondary' onClick = {logout}>Log out</Link>
        </div>
      )
    }
  }
  else{
    components = function(){
      return(
        <div class='nav-buttns'>
          <RedirectButton class='btn btn-secondary' name='login' path='/login'/>
          <RedirectButton class='btn btn-info' name='register' path='/register'/>
        </div>
      )
    }
  }
  return (
    <Provider store={store}>
      <Router history = {createdHistory}>
        <header class="header">
          <p class='logo' onClick = {() => {
            createdHistory.push('/')
            window.location.reload()
          }}>KolenValTrade</p>
          <div class='components-container'>
            {components()}
          </div>
        </header>
        <div class="wrapper">
          <Switch>
            <Route path="/" render = {props => 
              <div>
                <SearchConnected />
              </div>
            } exact />
            <Route path="/profile" render = {props => 
              <div>
                <ChangeUserConnected />
                <UserAdsConnected />
              </div>
            } exact />
            <Route path="/search/:json?" component = {AdsHistoryConnected} exact />
            <Route path="/ad/:_id" component = {adConnected} exact />
            <Route path="/login" component = {LoginConnected} exact />
            <Route path="/register" component = {RegisterConnected} exact />
            <Route path="/createAd" component = {CreateAdConnected} exact />
          </Switch>
        </div>
        <footer class='footer'>

        </footer>
      </Router>
    </Provider>
  );
}

export default App;
