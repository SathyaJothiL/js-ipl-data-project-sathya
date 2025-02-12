const CSVtoJSON = require("csvtojson")
const path = require("path")
const fileSys = require("fs")
const { match } = require("assert")
const { log } = require("console")

const CSVpath1 = path.join(__dirname, "../data/matches.csv")
const CSVpath2 = path.join(__dirname, "../data/deliveries.csv")

//Find a player who has won the highest number of Player of the Match awards for each season
CSVtoJSON().
fromFile(CSVpath1).
then(matches => { 
    let playerList = matches.reduce((acc,ele) => {
        let year=ele.season
        let player=ele.player_of_match
        if(!acc[year]){
            acc[year]={}
        }
        if(!acc[year][player]){
            acc[year][player]=0
        }
        acc[year][player]+=1
        return acc
    },{})

//console.log(playerList);

let player_of_match = Object.fromEntries(Object.entries(playerList).
                                    map(([keys,val])=>{
                                        let sorted_val=Object.entries(val).
                                                        sort((a,b) => b[1]-a[1])
                                        return [keys,sorted_val[0]]
                                    } ))
                        
console.log(player_of_match);

const writePath = path.join(__dirname, "../public/6-player-of-match-per-season.json")
fileSys.writeFileSync(writePath, JSON.stringify(player_of_match))
    
})