const CSVtoJSon = require("csvtojson")
const fileSys = require("fs")
const path = require("path")

const csvFilePath = path.join(__dirname , "../data/matches.csv")
CSVtoJSon().
fromFile(csvFilePath).
then( matches => {
   // console.log(matches);
    let res;
    res = matches.reduce((acc,ele) =>{
        let year=ele.season;
        if(!acc[year]){
            acc[year]=0
        }
        acc[year]+=1
        return acc
    },{})
    console.log(res);
    const writePath = path.join(__dirname, `../public/1-matches-per-year.json`)
    fileSys.writeFileSync(writePath, JSON.stringify(res))
})
