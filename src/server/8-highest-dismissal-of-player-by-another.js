const CSVtoJSON = require("csvtojson")
const path = require("path")
const fileSys = require("fs")

const CSVpath = path.join(__dirname, "../data/deliveries.csv")

CSVtoJSON().
fromFile(CSVpath).
then(deliveries => {
    
    let playerList = deliveries.reduce((acc,ele) => {
        let bool = i.dismissal_kind === "caught" || i.dismissal_kind === "caught and bowled" ||
                    i.dismissal_kind === "lbw" || i.dismissal_kind === "stumped" || 
                    i.dismissal_kind === "run out" || i.dismissal_kind ==="hit wicket"
        if(!bool){
            return acc
        }
        let playerout = ele.player_dismissed
        let bowler = ele.bowler
        if(!acc[playerout]){
            acc[playerout]={}
        }
        if(!acc[playerout][bowler]){
            acc[playerout][bowler]=0
        }
        acc[playerout][bowler]+=1
        return acc
    },{})
  //  console.log(playerList);
    let res = Object.entries(playerList).
                map(([key,val]) => {
                    return [key,Object.entries(val).
                            sort((a,b) => b[1]-a[1])[0]]
                })
                
    let res_playerList = Object.fromEntries(res)

    console.log(res_playerList);

    const writePath = path.join(__dirname, "../public/8-highest-dismissal-of-player-by-another.json")
    fileSys.writeFileSync(writePath, JSON.stringify(res_playerList))
    
})

