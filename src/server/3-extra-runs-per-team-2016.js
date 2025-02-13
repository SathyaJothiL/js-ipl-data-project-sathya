const CSVtoJSON = require("csvtojson")
const path = require("path")
const fileSys = require("fs")


const CSVpath1 = path.join(__dirname,"../data/matches.csv")
const CSVpath2 = path.join(__dirname, "../data/deliveries.csv")

CSVtoJSON().
fromFile(CSVpath1).
then(matches =>{
    CSVtoJSON().
    fromFile(CSVpath2).
    then(deliveries => {
        //Extra runs conceded per team in the year 2016
        let match_ids = matches.filter( (ele) => ele.season === '2016').map( (ele) => ele.id)
        
        let res=deliveries.filter((ele) => match_ids.includes(ele.match_id)).
                reduce((acc,ele) => {
                    let team = ele.bowling_team
                    let runs = Number(ele.extra_runs)
                    if(!acc[team]){
                        acc[team]= 0
                    }
                    acc[team]+=runs
                    return acc
                },{})

        console.log(res);
        
        const writePath = path.join(__dirname, "../public/3-extra-runs-per-team-2016.json") 
        fileSys.writeFileSync(writePath, JSON.stringify(res))       
    })
})
