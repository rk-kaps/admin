
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getDatabase, ref, get, child, update} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-database.js";


const firebaseConfig = { 
    apiKey: "AIzaSyAdYqEKabIlm02vRfVOuBJYJF0PKCpavkQ",
    authDomain: "sportsday-c7a16.firebaseapp.com",
    databaseURL: "https://sportsday-c7a16-default-rtdb.firebaseio.com",
    projectId: "sportsday-c7a16",
    storageBucket: "sportsday-c7a16.appspot.com",
    messagingSenderId: "894609801143",
    appId: "1:894609801143:web:d8cb620c60a278c0c07232"
};


const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
console.log("initialized firebase");


function updateEvents() {
    const classSelect = document.getElementById('class');
    const selectedClass = classSelect.value;
    const eventSelect = document.getElementById('event');

   
    eventSelect.innerHTML = '';

   
    const dbRef = ref(database);
    console.log("selected class");
    get(child(dbRef, 'Classes/' + selectedClass + '/EVENTS')).then((snapshot) => {
        if (snapshot.exists()) {
            const events = snapshot.val();
            Object.keys(events).forEach(event => {
                const option = document.createElement('option');
                option.value = event;
                option.textContent = event;
                eventSelect.appendChild(option);
            });
        } else {
            const option = document.createElement('option');
            option.value = '';
            option.textContent = 'No events available';
            eventSelect.appendChild(option);
        }
    }).catch((error) => {
        console.error('Error fetching events:', error);
    });
}
function updateParticipantsAndHouses() {
    const classSelect = document.getElementById('class');
    const selectedClass = classSelect.value;
    const eventSelect = document.getElementById('event');
    const selectedEvent = eventSelect.value;

    const participantsSelect = document.getElementById('participants');
    const participantsSelect2 = document.getElementById('participants2');
    const participantsSelect3 = document.getElementById('participants3');
    
    participantsSelect.innerHTML = '';
    participantsSelect2.innerHTML = '';
    participantsSelect3.innerHTML = '';
    

    const dbRef = ref(database);

   
    get(child(dbRef, 'Classes/' + selectedClass + '/EVENTS/' + selectedEvent)).then((snapshot) => {
        const eventData = snapshot.val();

        if (eventData) {
            const participants = eventData.PARTICIPANTS || [];
            

            participants.forEach(participant => {
                const option1 = document.createElement('option');
                const option2 = document.createElement('option');
                const option3 = document.createElement('option');

                option1.value = option2.value = option3.value = participant;
                option1.textContent = option2.textContent = option3.textContent = participant;

                participantsSelect.appendChild(option1);
                participantsSelect2.appendChild(option2);
                participantsSelect3.appendChild(option3);
            });
            
        } else {
            const noParticipantsOption = document.createElement('option');
            noParticipantsOption.value = '';
            noParticipantsOption.textContent = 'No participants available';
            participantsSelect.appendChild(noParticipantsOption);
            participantsSelect2.appendChild(noParticipantsOption);
            participantsSelect3.appendChild(noParticipantsOption);
        }

    }).catch((error) => {
        console.error('Error fetching participants:', error);
    });
}


function handleSubmit(event){
    event.preventDefault();
    
    
    const participantsSelect = document.getElementById("participants");
    const houseSelect = document.getElementById("House");
    const participantsSelect2 = document.getElementById("participants2");
    const houseSelect2 = document.getElementById("House2");
    const participantsSelect3 = document.getElementById("participants3");
    const houseSelect3 = document.getElementById("House3");
    
    

    const selectedParticipant = participantsSelect.value;
    const selectedHouse = houseSelect.value;
    const selectedParticipant2 = participantsSelect2.value;
    const selectedHouse2 = houseSelect2.value;
    const selectedParticipant3 = participantsSelect3.value;
    const selectedHouse3 = houseSelect3.value;

    console.log(selectedParticipant);
    console.log(selectedHouse);
    console.log(selectedParticipant2);
    console.log(selectedHouse2);
    console.log(selectedParticipant3);
    console.log(selectedHouse3);
    console.log(participantsSelect);
     
    updatePoints(selectedParticipant, selectedHouse, 5);
    updatePoints(selectedParticipant2, selectedHouse2, 3);
    updatePoints(selectedParticipant3, selectedHouse3, 2);

}

const updatePoints = async (participantId, houseId, pointsToAdd) => {
    const participantRef = ref(database, `ParticipantList/${participantId}`);
    const houseRef = ref(database, `HouseList/${houseId}`);
    const participantSnapshot = await get(participantRef);
    const houseSnapshot = await get(houseRef);

    if (participantSnapshot.exists() && houseSnapshot.exists()) {
        const currentParticipantPoints = participantSnapshot.val();
        const newParticipantPoints = currentParticipantPoints + pointsToAdd;

        const currentHousePoints = houseSnapshot.val();
        const newHousePoints = currentHousePoints + pointsToAdd;

        const updates = {};
        updates[`ParticipantList/${participantId}`] = newParticipantPoints;
        updates[`HouseList/${houseId}`] = newHousePoints;
        await update(ref(database), updates);
        console.log(`Updated ${participantId} to ${newParticipantPoints} points and ${houseId} to ${newHousePoints} points.`);
    } else {
        console.log("No such participant or house!");
    }
};
const form = document.querySelector("form");
form.addEventListener('submit', handleSubmit);


window.updateEvents = updateEvents;
window.updateParticipantsAndHouses = updateParticipantsAndHouses;
window.handleSubmit = handleSubmit;
