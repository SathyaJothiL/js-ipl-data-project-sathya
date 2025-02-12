const CSVtoJSON = require("csvtojson")
const path = require("path")
const fileSys = require("fs")

const CSVpath = path.join(__dirname, "../data/matches.csv")

CSVtoJSON().
fromFile(CSVpath).
then(matches => {

    let res=matches.filter(ele => ele.winner===ele.toss_winner).
                    map(ele => ele.winner).
                    reduce((acc,ele) =>{
                        let team=ele
                        if(!acc[team]){
                            acc[team]=0
                        }
                        acc[team]+=1
                        return acc
                    },{})
            
    console.log(res);
     const writePath = path.join(__dirname, "../public/5-teams-won-toss-and-match.json")
    fileSys.writeFileSync(writePath, JSON.stringify(res))
    
})