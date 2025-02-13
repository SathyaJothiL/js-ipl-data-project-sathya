const CSVtoJSON = require("csvtojson")
const path = require("path")
const fileSys = require("fs")

const CSVpath = path.join(__dirname, "../data/deliveries.csv")

CSVtoJSON().
fromFile(CSVpath).
then(deliveries => {
    let s=new Set()
    
    let player_lis={}  
    for(let i of deliveries){

        
        let bool = i.dismissal_kind === "caught" || i.dismissal_kind === "caught and bowled" ||
                    i.dismissal_kind === "lbw" || i.dismissal_kind === "stumped" || 
                    i.dismissal_kind === "run out" || i.dismissal_kind ==="hit wicket"
        
        if(!bool){
            continue
        }
        let player_out = i.player_dismissed
        let bowler = i.bowler
        if(!player_lis[player_out]){
            player_lis[player_out]={}
        }
        if(!player_lis[player_out][bowler]){
            player_lis[player_out][bowler]=0
        }
        player_lis[player_out][bowler]+=1
    }


    let highest_dismiss_lis={}
    for(let i in player_lis){
        let sorted = Object.entries(player_lis[i]).sort((a,b) => b[1]-a[1])
        let highest_dismiss = Object.fromEntries([sorted[0]])
        highest_dismiss_lis[i] = highest_dismiss
    }
    console.log(highest_dismiss_lis);
    
    

    const writePath = path.join(__dirname, "../public/8-highest-dismissal-of-player-by-another.json")
    fileSys.writeFileSync(writePath, JSON.stringify(highest_dismiss_lis))
    
})

