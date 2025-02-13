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
        let idlis=[]
        for(let i of matches){
            if(i.season === '2015'){
                 idlis.push(i.id)
            }
        }
        
        
        let deliveries_lis=[]
        for(let i of deliveries){
            if(idlis.includes(i.match_id)){
                deliveries_lis.push(i)
            }
        }
      //  console.log(deliveries_lis);

      let bowler_lis={}
      for(let i of deliveries_lis){
        let bowler=i.bowler
        let runs_given =Number(i.total_runs)-Number(i.bye_runs)-
                        Number(i.legbye_runs)-Number(i.penalty_runs)
        let bool = Number(i.wide_runs) > 0 || Number(i.noball_runs) > 0
        if(!bowler_lis[bowler]){
            bowler_lis[bowler]={}
            bowler_lis[bowler]['runs_given']=0
            bowler_lis[bowler]['b_count']=0
        }
        bowler_lis[bowler]['runs_given']+=runs_given
        if(!bool){
            bowler_lis[bowler]['b_count']+=1
        }

      }



      let bowler_lis2={}
      for(let i in bowler_lis){   
        let eco_val = (bowler_lis[i]['runs_given'] * 6) / bowler_lis[i]['b_count']
        let eco_value=Number(eco_val.toFixed(3))
        bowler_lis2[i]=eco_value
      }

      
    let top_ten=Object.fromEntries(Object.entries(bowler_lis2).sort((a,b) => a[1]-b[1]).slice(0,10))
      console.log(top_ten);
        
        
    const writePath = path.join(__dirname, "../public/4-top-ten-economic-bowlers-2015.json")
    fileSys.writeFileSync(writePath, JSON.stringify(top_ten))        
    })
})