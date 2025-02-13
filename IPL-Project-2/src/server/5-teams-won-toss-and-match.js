const CSVtoJSON = require("csvtojson")
const path = require("path")
const fileSys = require("fs")

const CSVpath = path.join(__dirname, "../data/matches.csv")

CSVtoJSON().
fromFile(CSVpath).
then(matches => {

    //Find the number of times each team won the toss and also won the match
    let res={}
    for(let i of matches){
        if(i.toss_winner!==i.winner){
            continue
        }
        let team = i.winner
        if(!res[team]){
            res[team]=0
        }   
        res[team]+=1      
    }
            
    console.log(res);
     const writePath = path.join(__dirname, "../public/5-teams-won-toss-and-match.json")
    fileSys.writeFileSync(writePath, JSON.stringify(res))
    
})