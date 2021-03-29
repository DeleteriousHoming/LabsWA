"use strict";

//const dayjs = require('dayjs');
//const { mainModule } = require('process');
//const sqlite3 = require('sqlite3');
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

function createNewHtmlTask(nTask){
    let htmlTask = document.createElement("li");
    htmlTask.className="list-group-item"

    let div = document.createElement("div")
    div.className = "row"

    htmlTask.appendChild(document.createElement("div"))

    return htmlTask
}

function main(){
    const laundry = new Task(1,"laundry",false,true,noDeadline);
    const monday_lab = new Task(2,"monday lab",false,false,"2021-02-16")
    const phone_call = new Task(3,"phone_call",true,false,"2021-03-08")

    console.log(laundry.toString());
    console.log(monday_lab.toString());
    console.log(phone_call.toString());

    //console.log(window)
    let bod = document.getElementById("list-of-tasks");
    console.log(bod);
}

main();