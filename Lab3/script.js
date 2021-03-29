"use strict";



const noDeadline = `9999`;

dayjs.extend(window.dayjs_plugin_isToday)


function Task(id,description,urgent=false,isPrivate=false,deadline=noDeadline){
    this.id=id;
    this.description=description;
    this.urgent=urgent;
    this.isPrivate=isPrivate;
    this.deadline=dayjs(deadline); // optional argument
    this.hasDeadline = deadline === noDeadline ? false : true;

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

        return filtered;
    }

    this.isTodayFilter = () =>{
        const filtered = this.list.filter((a)=>(a.deadline.isToday()));
        return filtered;
    }
}

function createNewHtmlTask(nTask){
    const bod = document.getElementById("list-of-tasks");

    const htmlTask = document.createElement("li");
    htmlTask.className="list-group-item";

    //Create first column

    const div = document.createElement("div");
    div.className = "col-sm form-check";

    const inp = document.createElement("input");


    inp.className="form-check-input";
    inp.setAttribute("type","Checkbox");
    inp.setAttribute("id","defaultCheck2");
    inp.setAttribute("value","");

    const label = document.createElement("label");

    let labelImportance = "form-check-label"

    if (nTask.urgent)
        labelImportance += ' text-danger'; 

    label.className=labelImportance;
    label.setAttribute("for","form-check-label");
    label.innerHTML=nTask.description;

    div.appendChild(inp);
    div.appendChild(label);

    //Create the middle column
    const middleDiv = document.createElement("div");
    middleDiv.className = "col-sm";

    const middlea = document.createElement("a");

    const middleSpan = document.createElement("a");
    middleSpan.className = "text-primary";
    middleSpan.setAttribute("data-feather","user");

    middlea.appendChild(middleSpan)
    middleDiv.appendChild(middlea);
    
    
    //Create Last column
    const lastDiv = document.createElement("div");
    lastDiv.className="date w-25";
    if (!nTask.hasDeadline)
        lastDiv.innerHTML = "No deadline!";
    else
        lastDiv.innerHTML=nTask.deadline.format('dddd d MMM YY HH:mm');

    
    //Container div
    const containerDiv = document.createElement("div");
    containerDiv.className = "row"

    containerDiv.appendChild(div);
    containerDiv.appendChild(middleDiv)
    containerDiv.appendChild(lastDiv)
    htmlTask.appendChild(containerDiv)
    bod.appendChild(htmlTask);

    feather.replace()
    return htmlTask
}


function loadList(someList){
    
    for(let task of someList){
        createNewHtmlTask(task);
    }
}

function filterAll(fullList) {

    //Get a reference to the link on the page
    // with an id of "mylink"
    let a = document.getElementById("filter-all");

    a.onclick = function() {

        deleteAll();
        loadList(fullList.list);


      return false;
    }
  }

function filterImportant(fullList){
    let a = document.getElementById("filter-important");
    let importantList = fullList.filterAndPrint();


    a.onclick = function() {

        deleteAll();
        loadList(importantList);


      return false;
    }
}

function filterToday(fullList){
    let a = document.getElementById("filter-today")
    let today = fullList.isTodayFilter()


    a.onclick = function() {

        deleteAll();
        loadList(today);


      return false;
    }
}



function deleteAll(){
    const htmlTasks = document.getElementById("list-of-tasks");

    while(htmlTasks.lastChild){
        htmlTasks.removeChild(htmlTasks.lastChild);
    }
}

function main(){
    const laundry = new Task(1,"Laundry",false,true,noDeadline);
    const monday_lab = new Task(2,"Monday lab",false,false,"2021-02-16");
    const phone_call = new Task(3,"Phone call",true,false,"2021-03-08");
    const invest = new Task(4,"Investing",true,true,dayjs());

    const fullList = new TaskList([laundry,monday_lab,phone_call,invest]);

    loadList(fullList.list);

    window.onload = filterAll(fullList);
    window.onload = filterImportant(fullList);
    window.onload = filterToday(fullList);
}

main();