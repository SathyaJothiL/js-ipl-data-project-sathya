const CSVtoJSON = require("csvtojson")
const path = require("path")
const fileSys = require("fs")

const CSVpath = path.join(__dirname, "../data/deliveries.csv")

CSVtoJSON().
fromFile(CSVpath).
then(deliveries => {
    let over_lis = []

    for(let i of deliveries){
        if(i.is_super_over === '1'){
            over_lis.push(i)
        }
    }

    let bowler_lis ={}
    for(let i of over_lis){
        let bool = Number(i.wide_runs) > 0 || Number(i.noball_runs) > 0       
        let runs = Number(i.total_runs)-Number(i.bye_runs)-
                    Number(i.legbye_runs)-Number(i.penalty_runs)
        let bowler = i.bowler
        if(!bowler_lis[bowler]){
            bowler_lis[bowler]={}
            bowler_lis[bowler]['runs']=0
            bowler_lis[bowler]['b_count']=0
        }
        if(!bool){
            bowler_lis[bowler]['b_count']+=1
        }
        bowler_lis[bowler]['runs']+=runs
    }

    let bowler_lis2={}
      for(let i in bowler_lis){   
        let eco_val = (bowler_lis[i]['runs'] * 6) / bowler_lis[i]['b_count']
        let eco_value=Number(eco_val.toFixed(3))
        bowler_lis2[i]=eco_value
      }

      let sorted = Object.entries(bowler_lis2).sort((a,b) => a[1]-b[1])
      let best_bowler = Object.fromEntries([sorted[0]])
    
      console.log(best_bowler);
    
    
    const writePath = path.join(__dirname, "../public/9-best-economy-bowler-super-over.json")
    fileSys.writeFileSync(writePath, JSON.stringify(best_bowler)) 
                                    
     
})