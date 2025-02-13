const CSVtoJSON = require("csvtojson")
const path = require("path")
const fileSys = require("fs")

const CSVpath1 = path.join(__dirname, "../data/matches.csv")

//Find a player who has won the highest number of Player of the Match awards for each season
CSVtoJSON().
fromFile(CSVpath1).
then(matches => { 
    let player_lis={}
    
    for(let i of matches){
      //  console.log(i);
        
        let player = i.player_of_match
        let year = i.season
        if(!player_lis[year]){
            player_lis[year]={}
        }
        if(!player_lis[year][player]){
            player_lis[year][player]=0
        }
        player_lis[year][player]+=1
    }

    //console.log(player_lis);

    let player_of_match_lis = {}
    for(let i in player_lis){
        let sorted = Object.entries(player_lis[i]).sort((a,b) => b[1]-a[1])
        let player_of_match = Object.fromEntries([sorted[0]])
        player_of_match_lis[i] = player_of_match
    }
    
    console.log(player_of_match_lis);
    

const writePath = path.join(__dirname, "../public/6-player-of-match-per-season.json")
fileSys.writeFileSync(writePath, JSON.stringify(player_of_match_lis))
    
})