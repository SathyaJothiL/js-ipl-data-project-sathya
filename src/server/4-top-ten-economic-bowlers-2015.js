const CSVtoJSON = require("csvtojson")
const path = require("path")
const fileSys = require("fs")

const CSVpath1 = path.join(__dirname, "../data/matches.csv")
const CSVpath2 = path.join(__dirname, "../data/deliveries.csv")

CSVtoJSON().
fromFile(CSVpath1).
then(matches => {
    CSVtoJSON().
    fromFile(CSVpath2).
    then(deliveries => {

        //Top 10 economical bowlers in the year 2015

        let match_ids = matches.filter((ele) => ele.season === '2015').map(ele => ele.id)
        
        let eco_bowlers=deliveries.filter(ele => match_ids.includes(ele.match_id)).
                reduce((acc,ele) => {
                    let bowler = ele.bowler
                    let runs = Number(ele.total_runs)-Number(ele.legbye_runs)-
                                Number(ele.bye_runs)-Number(ele.penalty_runs)
                    let bool = Number(ele.wide_runs)>0 || Number(ele.noball_runs)>0
                    if(!acc[bowler]){
                        acc[bowler]={}
                        acc[bowler]['runs']=0
                        acc[bowler]['b_count']=0
                    }
                    acc[bowler]['runs']+=runs
                    if(!bool){
                        acc[bowler]['b_count']+=1
                    }
                   return acc
                },{})

        let eco_bowlers2 = Object.fromEntries(Object.entries(eco_bowlers).
                                            map( ([key,val]) =>{
                                                  let eco_val = (val.runs * 6 ) / val.b_count
                                                  let eco_val_rounded = Number(eco_val.toFixed(3))
                                                  return [key,eco_val_rounded]
                                                }))

        let top_bowlers = Object.fromEntries(Object.entries(eco_bowlers2).
                                            sort((a,b) => a[1]-b[1]).slice(0,10))
       
        console.log(top_bowlers);
        
        const writePath = path.join(__dirname, "../public/4-top-ten-economic-bowlers-2015.json")
        fileSys.writeFileSync(writePath, JSON.stringify(top_bowlers))        
    })
})