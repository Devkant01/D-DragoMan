// user input section
const ip = document.querySelector('#ipWord');
const op = document.querySelector('#opWord');
const header = document.querySelector('header');
const caption = document.querySelector('#result');
const convertor = document.querySelector('.translator');
const ractivities = document.querySelector('#activities-list');
const table = document.querySelector('table');
const listresult = document.querySelector('.listResult');
const pactivities = document.querySelector('#table-list');
const lang = document.querySelectorAll('#langType');
const delBtn = document.querySelectorAll('#deleteIt');
const copy = document.querySelector('.fa-copy');
const copyText = document.querySelector('#copytool');
const voice = document.querySelector('.fa-volume-high');
var ltype = '';
var resiprocalltype = '';
let lCodeFrom, lCodeTo;

// Action: updating position of caption element as sticky and header element as relative
if (caption.getBoundingClientRect().top == 105) {
    console.log('x');
}


// Action: deleting list from recent activities when user hits trash btn
ractivities.addEventListener('click', (e) => {

    if (e.target.classList.contains('fa-trash')) {
        e.target.parentElement.parentElement.remove();
    }
    saveData();
});

// Action: when user hits listresult element
listresult.addEventListener('click', (e) => {
    table.style.display = 'block';
})


// Action: Actual translation operation
function convertorActivate() {
    let Ivalue = ip.value.toLowerCase();
    let Ovalue = op.value.toLowerCase();
    if (Ivalue === "") {
        op.setAttribute('placeholder', 'Translation');
        alert('Enter some text');

    } else {
        ltype = `${lang[0].value}_${lang[1].value}`.toLowerCase();
        resiprocalltype = `${lang[1].value}_${lang[0].value}`.toLowerCase();
        // retriving data from selfDict

        if (selfDict[ltype] == undefined) {
            if (selfDict[resiprocalltype] == undefined) {
                op.value = 'Under process..'
            }
        }

        if (selfDict[ltype][Ivalue] == undefined) {  //undefined is not a string
            let result = false;
            for (let x in selfDict[resiprocalltype]) {
                if (selfDict[resiprocalltype][x].toLowerCase() == Ivalue) {
                    result = true;
                }
            }

            if (!result) {
                op.value = selfDict[ltype]['undefined'];
                Ovalue = op.value;
                document.querySelector('.suggestion').style.opacity = '1';
                document.querySelector('.suggestion').addEventListener('click', (e) => {
                    e.target.setAttribute('href', `https://translate.google.co.in/?sl=${lang[0].value}&tl=${lang[1].value}&text=${Ivalue}&op=translate`);
                    console.log(e.href);

                })
                setTimeout(() => {
                    document.querySelector('.suggestion').style.opacity = '0';
                }, 4000);
            }

            else {
                console.log('working');
                for (let x in selfDict[resiprocalltype]) {
                    if (selfDict[resiprocalltype][x].toLowerCase() == Ivalue) {
                        op.value = x;
                    }
                }
                Ovalue = op.value;
                let element = document.createElement('li');
                element.innerHTML = `<a href = "https://translate.google.co.in/?sl=${lang[0].value}&tl=${lang[1].value}&text=${Ivalue}&op=translate" target = "_top" class="ip" title = "click to know more" > ${Ivalue} </a > 
                            <span><i class="fa-solid fa-arrow-right-long"></i></span>
                            <a href="https://translate.google.co.in/?sl=${lang[1].value}&tl=${lang[2].value}&text=${Ovalue}&op=translate" target="_top" class="op" title="click to know more">${Ovalue}</a>
                            <span id="deleteIt"><i class="fa-solid fa-trash cur-pointer"></i></span>`;
                localStorage.setItem('recentActivities', JSON.stringify(element.innerHTML));
                let len = ractivities.children.length;

                if (len === 5) {
                    ractivities.removeChild(ractivities.children[0]);
                }
                ractivities.appendChild(element);
                addToTable();
            }

        }
        else {
            op.value = selfDict[ltype][Ivalue];
            Ovalue = op.value;
            let element = document.createElement('li');
            element.innerHTML = `<a href = "#" target = "_top" class="ip" title = "click to know more" > ${Ivalue} </a > 
                            <span><i class="fa-solid fa-arrow-right-long"></i></span>
                            <a href="#" target="_top" class="op" title="click to know more">${Ovalue}</a>
                            <span id="deleteIt"><i class="fa-solid fa-trash cur-pointer"></i></span>`;
            localStorage.setItem('recentActivities', JSON.stringify(element.innerHTML));
            let len = ractivities.children.length;

            if (len === 5) {
                ractivities.removeChild(ractivities.children[0]);
            }
            ractivities.appendChild(element);
            addToTable();
        }
    }
    saveData();
}

// // Action: to add searched element into table
function addToTable() {
    let Ivalue = ip.value;
    let Ovalue = op.value;
    let category = "Available soon..";
    let tableRow = document.createElement('tr');
    tableRow.innerHTML = `
        <td></td>
        <td>${Ivalue[0].toUpperCase() + Ivalue.slice(1).toLowerCase()}</td>
        <td>${Ovalue[0].toUpperCase() + Ovalue.slice(1).toLowerCase()}</td>
        <td>${category} <span id="deleteIt"><i class="fa-solid fa-trash cur-pointer"></i></span></td>
    `;

    let tbody = document.querySelector('tbody');
    let inserted = false;

    Array.from(tbody.children).forEach((child) => {
        if (!inserted && child.classList.contains(ltype)) {
            tbody.insertBefore(tableRow, child);
            inserted = true;
        }
    });

    // If no row with the same category was found, append at the end
    if (!inserted) {
        tbody.appendChild(tableRow);
    }
    saveData();
}

// Action: deleting list from table when user hits trash btn
pactivities.addEventListener('click', (e) => {
    if (e.target.classList.contains('fa-trash')) {
        e.target.parentElement.parentElement.parentElement.remove()

    }
    else {
        console.log('false');

    }
})

// // Action: when user click on convertor button
convertor.addEventListener('click', (e) => {
    convertorActivate();

})

// Action: when user hits enter key on input field
ip.addEventListener('keypress', (e) => {
    if (e.key == 'Enter') {
        convertorActivate();
    }
})

// Action: when user entering text into input field change the placeHolder of output field
ip.addEventListener('input', () => {
    op.value = '';
    op.setAttribute('placeholder', 'translating...');
})

// Action: Saving data into local storage
function saveData() {
    localStorage.setItem('recentActivities', ractivities.innerHTML);
    localStorage.setItem('tableData', pactivities.innerHTML);
}
saveData(); //used to set initial value

// Action: Loading data from local storage
// function getData() {
    // ractivities.innerHTML = localStorage.getItem('recentActivities');
    // pactivities.innerHTML = localStorage.getItem('tableData');
// }
// getData();

// for copy and voice button
// Action: copy to clipboard
copy.addEventListener('click', () => {
    op.select();
    op.setSelectionRange(0, 9999);

    if (navigator.clipboard) {
        navigator.clipboard.writeText(op.value);
    }
    copyText.innerHTML = 'Copied: ' + op.value;
});

copy.addEventListener('mouseout', () => {
    copyText.innerHTML = 'Copy to Clipboard';
});

// Action: voice output
voice.addEventListener('click', () => {
    let text = op.value;
    const utterThis = new SpeechSynthesisUtterance(text);
    // utterThis.volume = 0.2;
    utterThis.rate = 1;
    utterThis.pitch = .8;
    utterThis.lang = lang[1].value;
    const synth = window.speechSynthesis;
    synth.speak(utterThis);
});
