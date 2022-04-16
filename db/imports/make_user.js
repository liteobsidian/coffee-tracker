// СКРИПТ О ВСЯКОМ РАЗНОМ на коленках
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const fs = require('fs')

// const { users } = JSON.parse(fs.readFileSync('./users2021-05-04.json'));
// const { users } = JSON.parse(fs.readFileSync('./users2021-05-11.json'));
// const { users } = JSON.parse(fs.readFileSync('./users2021-05-11_1.json'));
// const { users } = JSON.parse(fs.readFileSync('./users2021-05-11_2.json'));
// const { users } = JSON.parse(fs.readFileSync('./users2021-05-11_3.json'));
// const { users } = JSON.parse(fs.readFileSync('./users2021-05-11_email.json'));
// const { users } = JSON.parse(fs.readFileSync('./users2021-05-13.json'));
// const { users } = JSON.parse(fs.readFileSync('./users2021-05-13_1.json'));
// const { users } = JSON.parse(fs.readFileSync('./users2021-05-13_UZO.json'));
// const { users } = JSON.parse(fs.readFileSync('./users2021-05-13_2.json'));
// const { users } = JSON.parse(fs.readFileSync('./users2021-05-14_email.json'));
// const { users } = JSON.parse(fs.readFileSync('./users2021-05-14.json'));
// const { users } = JSON.parse(fs.readFileSync('./users2021-05-17.json'));
// const { users } = JSON.parse(fs.readFileSync('./users2021-05-17_1.json'));
// const { users } = JSON.parse(fs.readFileSync('./users2021-05-11_email.json'));
// const { users } = JSON.parse(fs.readFileSync('./users2021-05-17_2.json'));
// const { users } = JSON.parse(fs.readFileSync('./users2021-05-17_3.json'));
// const { users } = JSON.parse(fs.readFileSync('./users2021-05-17_4.json'));
// const { users } = JSON.parse(fs.readFileSync('./users2021-05-17_email.json'));
// const { users } = JSON.parse(fs.readFileSync('./users2021-05-17_5.json'));
// const { users } = JSON.parse(fs.readFileSync('./users2021-05-17_email.json'));
// const { users } = JSON.parse(fs.readFileSync('./users2021-05-17_6.json'));
// const { users } = JSON.parse(fs.readFileSync('./users2021-05-17_7.json'));
// const { users } = JSON.parse(fs.readFileSync('./users2021-05-17_8.json'));
// const { users } = JSON.parse(fs.readFileSync('./users2021-05-18.json'));
// const { users } = JSON.parse(fs.readFileSync('./users2021-05-18_1.json'));
// const { users } = JSON.parse(fs.readFileSync('./users2021-05-18_2.json'));

// const { users } = JSON.parse(fs.readFileSync('./users2021-05-18_3.json'));
// const { users } = JSON.parse(fs.readFileSync('./users2021-05-18_4.json'));
// const { users } = JSON.parse(fs.readFileSync('./users2021-05-18_5.json'));
// const { users } = JSON.parse(fs.readFileSync('./users2021-05-18_6.json'));
// const { users } = JSON.parse(fs.readFileSync('./users2021-05-18_7.json'));
// const { users } = JSON.parse(fs.readFileSync('./users2021-05-20.json'));

const { users } = JSON.parse(fs.readFileSync('./users2021-05-25.json'));
const dateFileName = new Date()
const fileOutput = 'InsertUsers_' + dateFileName.toISOString().split('T')[0] + '.csv'

const settings = {
  flags: 'aw',
  encoding: null, // not applicable / no changes
  mode: 0o666
}

const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
  port: 587, 
  host:'mail.medsoft.su',
  auth: {
    user: 'spopurey@medsoft.su',
    pass: 'bsd123ufps'
  }
})

const salt = bcrypt.genSaltSync(10);
const insertUser = ({orgId,lastName,firstName,middleName,login,email,password,mobil}) => {
let hash = bcrypt.hashSync(password, salt);
let sqlInsert = `INSERT INTO stat.auth_users(name, full_name, password, type, active, organization_id, email, mobil_phone) VALUES ('${login}','{"last_name": "${lastName}","first_name": "${firstName}","middle_name": "${middleName}"}','${hash}','user',true,${orgId},'${email}','${mobil}');`
fs.appendFileSync(fileOutput, `${login};${password};${sqlInsert}`+'\n', settings)
console.log(login,password,sqlInsert)
}

const sendEmail = ({email,firstName,middleName,login,password}) => {
  let mailOptions = {
    from: 'spopurey@medsoft.su',
    to: email,
    subject: 'Регистрация в системе МЕДСОФТ СТАТИСТИКА !',
    text: `${firstName} ${middleName} - здравствуйте !
    Ваша учетная запись зарегистрирована в системе МЕДСОФТ СТАТИСТИКА ("КВАЗАР.СТАТИСТИКА")
    Приложение доступно по адресу https://statistic-demo.medsoft.su/
    Учетные данные для входа в систему
    login: ${login}
    password: ${password}

    ---
    С уважением,
    Попурей Сергей Николаевич
    инженер-программист ООО Медсофт 
    +7 (906) 688-49-20
    spopurey@medsoft.su
    pprisn@yandex.ru
   `
  }
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  })  
}
for( let user of users ){
  console.log(user)
  insertUser(user)
  sendEmail(user)
}

return
//const { SECRET_KEY } = require('../../back/src/config')
// import { SECRET_KEY } from '../../back/src/config'
const SECRET_KEY = process.env.SECRET_KEY || 'lipetsk:gas:super:secret:1288'

async function mkToken (newArgs) {
  try {
    const argId = parseInt(newArgs.id, 10)
    if (isNaN(argId)) {
      throw new Error('ID validation error' + JSON.stringify(newArgs))
    }
    // {id: userid, system:'recipes', service: <тут ид внешего сервиса>, organization: <тут код организации>, email: <тут почта администратора></тут>}
    const payload = {
      id: newArgs.id,
      name: newArgs.name,
      type: newArgs.type,
      organization: newArgs.organization
    }
    const token = await jwt.sign(payload, `${SECRET_KEY}`) // {algorithm: 'HS512'}
    const mToken = token.split('.')
    const mT0 = Buffer.from(mToken[0], 'base64').toString()
    const mT1 = Buffer.from(mToken[1], 'base64').toString()
    console.log(`Create new token ${mT0}.${mT1}`)
    console.log(token)
    return token
  } catch (err) {
    throw Error(err)
  }
}

//  const params = { id: 2, name: 'Попурей ЦЕНТРСПИД', type: 'admin', organization: 2 }
//  mkToken(params).catch(err => console.error(err.message))
// Create new token {"alg":"HS256","typ":"JWT"}.{"id":2,"name":"Попурей ЦЕНТРСПИД","type":"admin","organization":2,"iat":1617790309}
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwibmFtZSI6ItCf0L7Qv9GD0YDQtdC5INCm0JXQndCi0KDQodCf0JjQlCIsInR5cGUiOiJhZG1pbiIsIm9yZ2FuaXphdGlvbiI6MiwiaWF0IjoxNjE3NzkwMzA5fQ.P4pWABfEEbWC297GGkotRH0t46Pmi9p7ocYeW_VFPec

// Для Локальной БД для отладки
const params = { id: 22, name: 'Попурей ЦЕНТРСПИД', type: 'admin', organization: 396 }
mkToken(params).catch(err => console.error(err.message))
// Create new token {"alg":"HS256","typ":"JWT"}.{"id":22,"name":"Попурей ЦЕНТРСПИД","type":"admin","organization":396,"iat":1617874379}
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjIsIm5hbWUiOiLQn9C-0L_Rg9GA0LXQuSDQptCV0J3QotCg0KHQn9CY0JQiLCJ0eXBlIjoiYWRtaW4iLCJvcmdhbml6YXRpb24iOjM5NiwiaWF0IjoxNjE3ODc0Mzc5fQ._uGMp_JPIMX7vDeSf0tbdGs2RQXI97i17B2iBtQoXi4


// // // // // тест ok //
// isRoot
// const params = { id: 1, name: 'Admin', type: 'admin', organization: null }
// mkToken(params).catch(err => console.error(err.message))

// const params = { id: 35, name: 'ЮроваОВ', type: 'admin', organization: 1 }
// mkToken(params).catch(err => console.error(err.message))
// Create new token {"alg":"HS256","typ":"JWT"}.{"id":35,"name":"ЮроваОВ","type":"admin","organization":1,"iat":1608191263}
// isAdmin
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzUsIm5hbWUiOiLQrtGA0L7QstCw0J7QkiIsInR5cGUiOiJhZG1pbiIsIm9yZ2FuaXphdGlvbiI6MSwiaWF0IjoxNjA4MTkxMjYzfQ.gqZ6-ZZwNbCgUoMgxPfmU9wyKPphcetsYTY2TWOBRqc

// const params = { id: 49, name: 'БучковАА', type: 'admin', organization: 7 }
// mkToken(params).catch(err => console.error(err.message))
// Create new token {"alg":"HS256","typ":"JWT"}.{"id":49,"name":"БучковАА","type":"admin","organization":7,"iat":1608203807}
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NDksIm5hbWUiOiLQkdGD0YfQutC-0LLQkNCQIiwidHlwZSI6ImFkbWluIiwib3JnYW5pemF0aW9uIjo3LCJpYXQiOjE2MDgyMDM4MDd9.vmYcILeikTSku34Lz3dXwVlM0YtqQl1r3njQoznwVFA

// const params = { id: 356, name: 'ПопурейСН', type: 'user', organization: 8 }
// mkToken(params).catch(err => console.error(err.message))
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzU2LCJuYW1lIjoi0J_QvtC_0YPRgNC10LnQodCdIiwidHlwZSI6InVzZXIiLCJvcmdhbml6YXRpb24iOjgsImlhdCI6MTYxNDI1OTc2MH0.EybeXElQuMgOiH05_33bSNMF3R99S5IC0OUv4YE8Vj8

// const params = { id: 41, name: 'КоротковаАА', type: 'admin', organization: 8 }
// mkToken(params).catch(err => console.error(err.message))
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NDEsIm5hbWUiOiLQmtC-0YDQvtGC0LrQvtCy0LDQkNCQIiwidHlwZSI6ImFkbWluIiwib3JnYW5pemF0aW9uIjo4LCJpYXQiOjE2MTQzMTYwMzZ9.TewAVXgVt2YGOF-1oRNNJ7lg7IuSUumHE4rW78Qio5U

// return

// // Проверить payload JWT
// const tokenIsRoot = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzUsIm5hbWUiOiLQrtGA0L7QstCw0J7QkiIsInR5cGUiOiJhZG1pbiIsIm9yZ2FuaXphdGlvbiI6MSwiaWF0IjoxNjA4MTkxMjYzfQ.gqZ6-ZZwNbCgUoMgxPfmU9wyKPphcetsYTY2TWOBRqc'
// const tokenIsRoot = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjM1NiIsIm5hbWUiOiLQn9C-0L_Rg9GA0LXQudCh0J0iLCJ0eXBlIjoidXNlciIsIm9yZ2FuaXphdGlvbiI6IjgiLCJpYXQiOjE2MTU2NTIzNzgsImV4cCI6MTYxNjAxMjM3OH0.dtm6Hw4UqNUjQGQ8IBLwPoAMM1-sRR_a7tRIBfNVjuM'
// const mToken = tokenIsRoot.split('.')
// const mT0 = Buffer.from(mToken[0], 'base64').toString()
// const mT1 = Buffer.from(mToken[1], 'base64').toString()
// console.log(`Create new token ${mT0}.${mT1}`)
// const t = JSON.parse(mT1)
// console.log(new Date(t.exp))
// console.log(new Date(t.iat))
