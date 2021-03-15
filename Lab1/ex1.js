"use strict";

const dayjs = require('dayjs');
const { mainModule } = require('process');
const sqlite3 = require('sqlite3');
const noDeadline = `9999`;

function Task(id,description,urgent=false,isPrivate=false,deadline=noDeadline){
    this.id=id;
    this.description=description;
    this.urgent=urgent;
    this.isPrivate=isPrivate;
    this.deadline=dayjs(deadline); // optional argument

    this.toString = ()=>{
        let date = this.deadline.format('MMMM DD, YYYY');

        if(this.deadline.isSame(dayjs(noDeadline)))
            date = '<not defined>'

        return `Id: ${this.id}, Description: ${this.description},` +
        ` Urgent:${this.urgent}, Private: ${this.isPrivate}, Deadline: ${date}`
    }
}

function TaskList(array=[]){
    this.list = array;
    this.add = (task)=>{this.list.push(task)};

    this.toString = () => (this.list.map((a)=>a.toString()).join('\n'));
    
    this.sortAndPrint = ()=>{ //sorts tasks by date
      this.list.sort((a,b)=> {
          if(a.deadline.isBefore(b.deadline))
            return -1;
          else if(b.deadline.isBefore(a.deadline))
            return 1;
          else
            return 0;

      });
      //After the list is sorted I print it
      console.log('****** Tasks sorted by deadline (most recent first): ******');
      console.log(this.list.map((a)=>(a.toString())).join('\n'));

    }

    this.filterAndPrint = ()=>{
        const filtered = this.list.filter((a)=>(a.urgent));

        console.log('****** Tasks filtered, only (urgent == true): ******');
        console.log(filtered.map((a)=>(a.toString())).join('\n'));
    }
}


let db = new sqlite3.Database('tasks.db', (err)=> {
    if (err) throw(err);
})

const handleQuery = (resolve,reject)=>{
    db.all(sql,(err,rows)=>{
        if(err)
            reject(err);
        else{
            const tList = new TaskList();
            for(let row of rows){
                let deadline = ((row.deadline === null) ? noDeadline:row.deadline);
                let task = new Task(row.id,row.description,row.urgent,row.private,deadline);
                tList.add(task);
            
            }
            resolve(tList);
        }

    }); //End of query

}

function loadAll(){
    const sql = `SELECT *
                   FROM tasks`;
    return new Promise((resolve,reject)=>{
        db.all(sql,(err,rows)=>{
            if(err)
                reject(err);
            else{
                const tList = new TaskList();
                for(let row of rows){
                    let deadline = ((row.deadline === null) ? noDeadline:row.deadline);
                    let task = new Task(row.id,row.description,row.urgent,row.private,deadline);
                    tList.add(task);
                
                }
                resolve(tList);
            }

        }); //End of query


    });//End of Promise
}

function afterDate(date){
    const dateFormatted = dayjs(date).format("YYYYMMDD");
    const sql = `SELECT *
                 FROM tasks
                 WHERE CAST(strftime("%Y%m%d",tasks.deadline) AS INTEGER) > CAST(${dateFormatted} AS ITEGER) OR tasks.deadline IS NULL`;
    return new Promise((resolve,reject)=>{
        db.all(sql,(err,rows)=>{
            if(err)
                reject(err);
            else {
                const tList = new TaskList();
                for(let row of rows){
                    let deadline = ((row.deadline === null) ? noDeadline:row.deadline);
                    let task = new Task(row.id,row.description,row.urgent,row.private,deadline);
                    tList.add(task);
                }

                resolve(tList);
            }

        }); //End of query

    });// End of Promise
}

function containsWord(word){
    const sql = `SELECT *
                 FROM tasks
                 WHERE tasks.description LIKE '%${word}%'`;

    return new Promise((resolve,reject)=>{
        db.all(sql,(err,rows)=>{
            if(err)
                reject(err);
            else {
                const tList = new TaskList();
                for(let row of rows){
                    let deadline = ((row.deadline === null) ? noDeadline:row.deadline);
                    let task = new Task(row.id,row.description,row.urgent,row.private,deadline);
                    tList.add(task);
                }

                resolve(tList);
            }

        }); //End of query


    });//End of promise
}

async function main(){
    const tList = await loadAll();
    console.log(tList.toString());

    const date = '2021-03-10'
    const after = await afterDate(date);
    console.log(`***Tasks with a deadline after ${date}***`)
    console.log(after.toString());

    const word = "monday";
    const containing = await containsWord(word);
    console.log(`***Tasks containing "${word}"***`)
    console.log(containing.toString());
}

main();

/*
const task1 = new Task("1","laundry",false,true);
const task2 = new Task("2","mondaly lab",false,false,"March 16 2021 10:00 AM")
const task3 = new Task("3","phone call",true,false,"March 8 2021 4:20 PM")
 
//console.log(task1.toString());

const tList = new TaskList()
tList.add(task1);
tList.add(task2);
tList.add(task3);

//console.log(tList)

tList.sortAndPrint();

console.log('\n');

tList.filterAndPrint();*/



"debugger";