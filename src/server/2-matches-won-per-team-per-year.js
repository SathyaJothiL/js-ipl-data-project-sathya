const CSVtoJSon = require("csvtojson")
const path = require("path")
const fileSys= require("fs")
const { match } = require("assert")

const csvFilePath = path.join(__dirname, "../data/matches.csv")
CSVtoJSon().
fromFile(csvFilePath).
then(matches => {
    let res;
    res=matches.reduce((acc,ele) => {
        let year=ele.season
        let team=ele.winner
        if(!acc[year]){
            acc[year]={}
        }
        if(!acc[year][team]){
            acc[year][team]=0
        }
        acc[year][team]+=1
        return acc
    },{})
    console.log(res);
   
    const writePath = path.join(__dirname, "../public/2-matches-won-per-year-per-team.json")
    fileSys.writeFileSync(writePath, JSON.stringify(res))
})