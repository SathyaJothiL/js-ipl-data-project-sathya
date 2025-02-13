const CSVtoJSon = require("csvtojson")
const path = require("path")
const fileSys= require("fs")
const { match } = require("assert")

const csvFilePath = path.join(__dirname, "../data/matches.csv")
CSVtoJSon().
fromFile(csvFilePath).
then(matches => {
    let res={}
    for(let i of matches){
        let team=i.winner
        let year=i.season
        if(!res[year]){
            res[year]={}
        }
        if(!res[year][team]){
            res[year][team]=0
        }
        res[year][team]+=1
    }
    console.log(res);
   
    const writePath = path.join(__dirname, "../public/2-matches-won-per-year-per-team.json")
    fileSys.writeFileSync(writePath, JSON.stringify(res))
})