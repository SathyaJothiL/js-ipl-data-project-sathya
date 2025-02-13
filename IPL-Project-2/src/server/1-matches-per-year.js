const CSVtoJSon = require("csvtojson")
const fileSys = require("fs")
const path = require("path")

const csvFilePath = path.join(__dirname , "../data/matches.csv")

CSVtoJSon().
fromFile(csvFilePath).
then( matches => {
   // console.log(matches);
    let res={};
    for(let i of matches){       
        let year=i.season;
        if(!res[year]){
            res[year]=0
        }
        res[year]+=1
    }
    console.log(res);
    const writePath = path.join(__dirname, `../public/1-matches-per-year.json`)
    fileSys.writeFileSync(writePath, JSON.stringify(res))
})
