const express = require('express')
const app = express()
const path = require('path')

app.set('view engine','ejs')
app.set('views',path.join(__dirname,'/views'))

app.get('/',(req,res)=>{
    res.render('home')
})

app.listen(8080,()=>{
    console.log('Port 8080 online !!!')
})
