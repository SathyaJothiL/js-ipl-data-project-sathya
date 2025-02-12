const CSVtoJSON = require("csvtojson")
const path = require("path")
const fileSys = require("fs")

const CSVpath = path.join(__dirname, "../data/deliveries.csv")

CSVtoJSON().
fromFile(CSVpath).
then(deliveries => {
    let bowlerList=deliveries.filter( (ele) => ele.is_super_over === '1').
    reduce( (acc,ele) => {
                        let bname=ele.bowler
                        let t_runs=Number(ele.total_runs)-Number(ele.bye_runs)-
                                    Number(ele.legbye_runs)
                        let bool = Number(ele.wide_runs)>0 || Number(ele.noball_runs)>0
                        if(!acc[bname]){
                                    acc[bname]={}
                                    acc[bname]['t_runs']=0
                                    acc[bname]['b_count']=0
                                        }
                        acc[bname]['t_runs']+=t_runs
                        if(!bool){
                                acc[bname]['b_count']+=1
                                }
                        return acc
                        },{})
    let eco_List = Object.fromEntries(Object.entries(bowlerList).map(([keys,val]) =>{
                                            let eco_val = (val.t_runs *6) / val.b_count
                                            let eco_val_rounded = Number(eco_val.toFixed(5))
                                            return [keys,eco_val_rounded]
                                            })
                                        )
                                        
                                        
    let best_bowler = Object.fromEntries(Object.entries(eco_List).
                                        sort((a,b) => a[1]-b[1]).slice(0,1))
    console.log(best_bowler);
    
    const writePath = path.join(__dirname, "../public/9-best-economy-bowler-super-over.json")
    fileSys.writeFileSync(writePath, JSON.stringify(best_bowler)) 
                                    
     
})