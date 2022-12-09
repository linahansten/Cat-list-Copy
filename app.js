
//--------------------------------DATABASE--------------------------------------------------------------

// Get and listen from database
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.12.1/firebase-app.js";
import { getDatabase, ref, onValue, push, remove, update } from "https://www.gstatic.com/firebasejs/9.12.1/firebase-database.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAQgYYx6t6Xf2d_ivfkw6QQ6cqcHKYJRvU",
    authDomain: "notebook-c148b.firebaseapp.com",
    projectId: "notebook-c148b",
    storageBucket: "notebook-c148b.appspot.com",
    messagingSenderId: "48388216404",
    appId: "1:48388216404:web:4dcef34a700fe88046ffc1",
    databaseURL: "https://notebook-c148b-default-rtdb.europe-west1.firebasedatabase.app/"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// initializes Realtime Database and get a reference service
const db = getDatabase(app);
// create reference, where in the database we want to take info from
const noteRef = ref(db, '/note');

// listens for database changes
onValue(noteRef, function (snapshot) {


    const list = document.querySelector("#other")
    const doneList = document.querySelector("#done")

    list.replaceChildren()
    doneList.replaceChildren()

    snapshot.forEach((childSnapshot) => {
        const childKey = childSnapshot.key;
        const childData = childSnapshot.val();


        //Creates the all the ParentElement
        //Sets attributes to the elements
        const formCheck = document.createElement("div")
        formCheck.classList.add("form-check")

        //Creates an checkbox
        const checkInput = document.createElement("input")
        checkInput.classList.add("form-check-input")
        checkInput.setAttribute("type", "checkbox")
        checkInput.setAttribute("id", "flexCheckDefault")
        checkInput.addEventListener("click", function (e) {
            done(childKey, childData.done, e.target)
        })

        //Creates a paragraph
        const paragraph = document.createElement("p")
        paragraph.classList.add("paragraph")
        //Pushes the value of text into paragraph
        paragraph.innerText = childData.text

        //Creates an icon for the delete function
        const x = document.createElement("i")
        x.classList.add("fa-x")
        x.classList.add("fa-solid")
        x.classList.add("hidden")
        // When clicked it will delete the whole element
        x.addEventListener("click", function () {
            del(childKey)
        })



        //Puts the elements in the right parent
        formCheck.appendChild(checkInput)
        formCheck.appendChild(paragraph)
        formCheck.appendChild(x)

        console.log(childData.done)

        // Check if done
        if (childData.done) {
            // Set done in database
            doneList.appendChild(formCheck)
        } else {
            list.appendChild(formCheck)
        }
    });

});


// Sees if plus has been pressed on
const save = document.querySelector(".btn-save")
const note = document.getElementById("message-text")

// When save is clicked
save.addEventListener("click", function () {
    // send to database
    push(ref(db, "note/"), {
        text: note.value,
        done: false
    })
    // clear message box
    note.value = ""

})



// sees if done = true and saves on done aswell, text shrinks
// if click on p it will open modal to edit msg

//-------------------------------------DATABASE----------------------------------------------------------

//Makes the x disapair and reapair
let showDelete = false

//Sees if Trash has been click on 
const trash = document.getElementById("trash")
trash.addEventListener("click", function () {
    const del = document.querySelectorAll(".fa-x")

    if (showDelete == false) {
        //Element will stay as is
        for (let i = 0; i < del.length; i++) {
            del[i].classList.remove("hidden")
        }
        showDelete = true
    } else {
        //Element will be removed
        for (let i = 0; i < del.length; i++) {
            del[i].classList.add("hidden")

        }
        showDelete = false
    }
})

// Calls on the del button and deletes it
function del(noteId) {
    // Remove from database
    remove(ref(db, 'note/' + noteId))
}

// Sees if the box is checked or not
function done(noteId, done, el) {
    if (done) {
        // Set undone in database
        update(ref(db, 'note/' + noteId), { done: false })
    } else {
        // Set done in database
        update(ref(db, 'note/' + noteId), { done: true })
    }
}