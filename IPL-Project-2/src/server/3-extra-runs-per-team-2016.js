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

        let idlis=[]
        for(let i of matches){
            if(i.season === '2016'){
                idlis.push(i.id)
            }
        }

       let deliveries_lis=[]
       for(let i of deliveries){
        if(idlis.includes(i.match_id)){
            deliveries_lis.push(i)
        }
       }

       let extra_lis={}
       for(let i of deliveries_lis){
        let team=i.bowling_team
        let ex_runs=Number(i.extra_runs)
        if(!extra_lis[team]){
            extra_lis[team]=0
        }
        extra_lis[team]+=ex_runs
       }

       console.log(extra_lis);

        
        const writePath = path.join(__dirname, "../public/3-extra-runs-per-team-2016.json") 
        fileSys.writeFileSync(writePath, JSON.stringify(extra_lis))       
    })
})
