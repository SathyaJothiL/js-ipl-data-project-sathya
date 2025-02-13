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

      let season_lis={}
      for(let i of matches){
        let year = i.season
        if(!season_lis[year]){
          season_lis[year]=[]
        }
        season_lis[year].push(i.id)
      }
      //console.log(season_lis);

      let deliveries_lis = {}

      for(let i in season_lis){
        let arr = season_lis[i]
        let temp= []
        for(let j of deliveries){
          if(arr.includes(j.match_id)){
                  temp.push(j)
          }
        }
        deliveries_lis[i] = temp
      }
    //  console.log(deliveries_lis);

      let batsman_lis={}
      for(let i in deliveries_lis){
        let arr = deliveries_lis[i]
        let temp={}
        for(let j of arr){
          let batsman = j.batsman
          let runs = Number(j.batsman_runs)
          let bool = Number(j.wide_runs) > 0 || Number(j.noball_runs) > 0
          if(!temp[batsman]){
              temp[batsman] = {}
              temp[batsman]['runs']=0
              temp[batsman]['b_faced']=0
          }
          temp[batsman]['runs']+=runs
          if(!bool){
            temp[batsman]['b_faced']+=1
          }
          
        }
        batsman_lis[i]=temp
      }
   //   console.log(batsman_lis);
      
      let strike_lis={}
      for(let i in batsman_lis){
        let obj = batsman_lis[i]
        strike_lis[i]={}
        for(let j in obj){
          let strike_val = (obj[j].runs * 100) / obj[j].b_faced
          let strike_value =Number(strike_val.toFixed(2))
          strike_lis[i][j]=strike_value
        }
      }

      console.log(strike_lis);
      
      
        const writePath = path.join(__dirname, "../public/7-strike-rate-per-season.json")
        fileSys.writeFileSync(writePath, JSON.stringify(strike_lis))
    })
  })