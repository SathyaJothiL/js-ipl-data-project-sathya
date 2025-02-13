const CSVtoJSON = require("csvtojson")
const path = require("path")
const fileSys = require("fs")


const CSVpath1 = path.join(__dirname, "../data/matches.csv")
const CSVpath2 = path.join(__dirname, "../data/deliveries.csv")

//Find the strike rate of a batsman for each season

CSVtoJSON().
fromFile(CSVpath1).
then(matches => {
    CSVtoJSON().
    fromFile(CSVpath2).
    then(deliveries => {
    let yearList=matches.reduce( (acc,ele) => {
                             let y=ele.season
                            if(acc[y]){
                                 acc[y].push(ele.id)
                            }else{
                                    acc[y]=[]
                                     acc[y].push(ele.id)
                                }
                            return acc
                            },{})

       //console.log(yearList);

        let deliveries_per_year=Object.fromEntries((Object.entries(yearList).map(([keys,val])=>{          
                                            let mp=deliveries.filter(ele=>val.includes(ele.match_id))                                          
                                            return [keys,mp]})))
        
        let batsman_data = Object.entries(deliveries_per_year).map(([key,val]) => {
          let reducer=val.reduce( (acc,ele)=> {
                        let batsman=ele.batsman
                        let runs=Number(ele.batsman_runs)
                        let bool = Number(ele.wide_runs)>0 
                        if(!acc[batsman]){
                                  acc[batsman]={}
                                  acc[batsman]['runs']=0
                                  acc[batsman]['faced']=0
                          }
                        acc[batsman]['runs']+=runs
                        if(!bool){
                           acc[batsman]['faced']+=1
                          }
                        return acc
                        },{})
            return [key,reducer]
        })

        let batsman_data1 = Object.fromEntries(batsman_data)
     //   console.log(batsman_data1);
        

        let strike_data = Object.fromEntries(Object.entries(batsman_data1).
                                              map(([key,val]) => {

                                                let mapper=Object.fromEntries(Object.entries(val).map(([key,val])=>{
                                                                        let strike_val = (val.runs*100)/val.faced
                                                                        let strike_val_rounded=Number(strike_val.toFixed(2))
                                                                        return[key,strike_val]
                                                                      }));
                                               // console.log(mapper);                                                
                                                return [key,mapper]
                                              }))
        console.log(strike_data);
        const writePath = path.join(__dirname, "../public/7-strike-rate-per-season.json")
          fileSys.writeFileSync(writePath, JSON.stringify(strike_data))
    })
  })
