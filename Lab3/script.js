"use strict";

const noDeadline = `9999`;

dayjs.extend(window.dayjs_plugin_isToday)
dayjs.extend(window.dayjs_plugin_isBetween)


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

    this.genericFilter = (filterFunction) => {
        const filtered = this.list.filter(filterFunction);
        return filtered;
    }
}

/*dictionary for creating titles of the of the matching filters in the sidebar */
const idNameDict = {
    "filter-all":"All",
    "filter-today":"Today",
    "filter-next-seven":"Next 7 Days",
    "filter-private":"Private",
    "filter-important":"Important"
};

/*generates Html code for the filters in the sidebar */
function makeSideFilter(active=false,text="defaultText",filterName="filter-all"){
    const button = document.createElement("button")
    button.setAttribute("type","button")
    button.setAttribute("id",filterName);
    button.innerHTML = text;


    let buttonClass = "list-group-item list-group-item-action";

    if (active)
        buttonClass += " active";

    button.className = buttonClass;


    return button;
    

}

/*Function that deletes the children of the html element with id */
function deleteChildren(id){
    const htmlElement = document.getElementById(id);

    while(htmlElement.lastChild){
        htmlElement.removeChild(htmlElement.lastChild);
    }
}

/*Loads the initial sidebar, it defaults to showing all the tasks */
function loadSideBar(currentlyActive="filter-all"){
    const bod = document.getElementById("filter-links-side")
    const texts = ["All","Important","Today","Next 7 Days","Private"];
    const filterNames = ["filter-all","filter-important","filter-today","filter-next-seven","filter-private"];

    const filters = []

    for (let i = 0; i<filterNames.length; i++){
        let active = currentlyActive == filterNames[i] ? true : false;
        bod.appendChild(makeSideFilter(active,texts[i],filterNames[i]));
    }

}


/*When called this highlights the button in the sidebar whose id corresponds to 
the currentlyActive argument, it deletes any previous highlights */
function refreshSideBar(currentlyActive="filter-all"){
    const filters = document.getElementById("filter-links-side").children;

    for (let child of filters){
        let buttonClass = "list-group-item list-group-item-action";

        if (currentlyActive === child.id)
            buttonClass += " active";
        
        child.className=buttonClass;
    }

}


/*Creates the html markup code that will eventually display the tasks */
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
    middleSpan.className = "text-dark";

    if (nTask.isPrivate)
        middleSpan.setAttribute("data-feather","lock");

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

/*Loads someList into the main taks list*/
function loadList(someList){
    
    for(let task of someList){
        createNewHtmlTask(task);
    }
}

function changeTitle(newTitle){
    const title = document.getElementById("main-page-title");
    title.innerHTML = newTitle;
}

/*Given a function called callback this filters the tasks list
furthermore it needs the idName in order to update the sidebar and
actually highlight the currently selected filter */
function filterGeneric(fullList,idName,callback){
    let a = document.getElementById(idName);
    let genericTask = fullList.genericFilter(callback);

    a.onclick = function() {

        changeTitle(idNameDict[idName]);
        deleteChildren("list-of-tasks");
        loadList(genericTask);
        refreshSideBar(idName);

      return false;
    }

}

/*This functions deletes all currently displayed tasks */
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
    const haircut = new Task(5,"Haircut (next 7)",true,true,dayjs().add(6,'day'));

    const fullList = new TaskList([laundry,monday_lab,phone_call,invest,haircut]);

    loadList(fullList.list);
    loadSideBar();

    window.onload = filterGeneric(fullList,"filter-all",((_)=>true))
    window.onload = filterGeneric(fullList,"filter-important",((a)=>a.urgent))
    window.onload = filterGeneric(fullList,"filter-today",((a)=>a.deadline.isToday()))
    window.onload = filterGeneric(fullList,"filter-next-seven",((a)=>(a.deadline.isBetween(dayjs(),dayjs().add(7,'day')) )))
    window.onload = filterGeneric(fullList,"filter-private",((a)=>a.isPrivate))

}

main();