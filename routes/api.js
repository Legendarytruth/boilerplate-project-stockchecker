'use strict';
require('dotenv').config();
const fetch = require('node-fetch');
const mongoose = require("mongoose");
const ObjectId = require('mongodb').ObjectId;
const Schema = mongoose.Schema;

const db = mongoose.connect(process.env.DB, {useNewUrlParser: true, useUnifiedTopology: true})

const StockSchema = new Schema({
  stock: String,
  price: Number,
  likes: Number
})

let Stock = mongoose.model("Stock", StockSchema);


module.exports = function (app) {
  
  app.route('/api/stock-prices')
    .get(async function (req, res){
      console.log(req)
      var c1 = {stock: "", price: 0, likes:0}
      var c2 = {stock: "", price: 0, likes:0}
      let stoc = req.query.stock
      //console.log("Stock: "+req.query.stock)
      //console.log("Likes: "+ typeof(req.query.like))
      //console.log(req.query)

      //Deals with the compare part
      if(Array.isArray(stoc)){
        //console.log(stoc)

        let stock1 = stoc[0]
        let stock2 = stoc[1]
        //console.log(stock1 + " " + stock2)
        //Gets the info from API
        let info1 = await fetch("https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/"+stock1+"/quote")
        let info2 = await fetch("https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/"+stock2+"/quote")
        let s1 = await info1.json()
        let s2 = await info2.json()
        if(s1 === null || s2 === null){
          //console.log("s1s2 Error")
          return res.json({error: "That doesn't exists"})
        }
        let c1 = await Stock.findOne({stock:stock1}, (err, findstock) =>{
          if(err){
            //console.log("here")
            return res.json({error: "FindOne Error"})
          }
          if(findstock === null){
            if(req.query.like === 'true'){
              let new_s = new Stock({stock: stock1, price:s1.latestPrice, likes: 1})
              new_s.save((err, data) => {
                if (err){
                  return res.json({error:"Error Save"})
                }
               return {stock: stock1, price:s1.latestPrice, likes: 1}})
            }else{
              let new_s = new Stock({stock: stock1, price:s1.latestPrice, likes: 0})
              new_s.save((err, data) =>{
                if (err){ 
                  return res.json({error:"Error Save"})
                }
                return {stock: stock1, price:s1.latestPrice, likes: 0}
              })

            }
          }else{
            return {stock: findstock.stock, price: findstock.price, likes: findstock.likes};
          }})


          //console.log("out c1: ", c1)
          let c2 = await Stock.findOne({stock:stock2}, (err, findstock) =>{
          if(err){
            console.log("here")
            return res.json({error: "FindOne Error"})
          }
          if(findstock === null){
            if(req.query.like === 'true'){
              let new_s = new Stock({stock: stock2, price:s2.latestPrice, likes: 1})
              new_s.save((err, data) => {
                if (err){
                  return res.json({error:"Error Save"})
                }
               return {stock: stock2, price:s2.latestPrice, likes: 1}})
            }else{
              let new_s = new Stock({stock: stock2, price:s2.latestPrice, likes: 0})
              new_s.save((err, data) =>{
                if (err){ 
                  return res.json({error:"Error Save"})
                }
                return {stock: stock2, price:s2.latestPrice, likes: 0}
              })

            }
          }else{
            //console.log(findstock)
            return {stock: findstock.stock, price: findstock.price, likes: findstock.likes}
            //console.log(c2)
        }})
        //console.log("WTF: " + c1 +"/"+ c2)
        if(req.query.like === 'true'){
              Stock.updateOne({stock:stock1}, {price:s1.latestPrice, likes: parseInt(c1.likes) + 1}, (err, data)=>{
                if(err){
                  console.log("Update 1 Error")
                  return res.json({error: "Update Error"})}
              })
              Stock.updateOne({stock:stock2}, {price:s2.latestPrice, likes: parseInt(c2.likes) +1}, (err, data)=>{
            if(err){
              console.log("Update 3 Error")
              return res.json({error: "Update Error"})}
              })
            }else{
              Stock.updateOne({stock:stock1}, {price:s1.latestPrice}, (err, data)=>{
                if(err){
                  console.log("Update 2 Error")
                  return res.json({error: "Update Error"})}
              })
              Stock.updateOne({stock:stock2}, {price:s2.latestPrice}, (err, data)=>{
            if(err){
              console.log("Update 4 Error")
              return res.json({error: "Update Error"})}
              })
            }
        return res.json({"stockData": [{stock: c1.stock, price: c1.price, rel_likes: c1.likes-c2.likes},{stock: c2.stock, price: c2.price, rel_likes: c2.likes-c1.likes}]})

      }else{
        let info = await fetch("https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/"+stoc+"/quote")
        let s = await info.json()
        if(s === null){
          console.log("s Error")
          return res.json({error: "That doesn't exists"})
        }
        //console.log(s)
        Stock.findOne({stock:stoc}, (err, findstock) =>{
          if(err){
            console.log("here")
            return res.json({error: "FindOne Error"})
          }
          if(findstock === null){
            if(req.query.like === 'true'){
              let new_s = new Stock({stock: stoc, price:s.latestPrice, likes:1})
              new_s.save((err, data) => {
                if (err){
                  return res.json({error:"Error Save"})
                }
                return res.json({"stockData": {stock: stoc, price:s.latestPrice, likes: parseInt(likes) + 1}})})
            }else{
              let new_s = new Stock({stock: stoc, price:s.latestPrice, likes: 0})
              new_s.save((err, data) =>{
                if (err){ 
                  return res.json({error:"Error Save"})
                }
                return res.json({"stockData": {stock: stoc, price:s.latestPrice, likes: 0}})})
            }
          }
          if(req.query.like === 'true'){
          Stock.updateOne({stock:stoc}, {price:s.latestPrice, likes: parseInt(findstock.likes) + 1}, (err, data)=>{
            if(err){
              return res.json({error: "Update Error"})
            }
          })
          }else{
            Stock.updateOne({stock:stoc}, {price:s.latestPrice}, (err, data)=>{
            if(err){
              return res.json({error: "Update Error"})
            }
          })
          }
          return res.json({"stockData": findstock})
        })
      }
      
    });
    
};
