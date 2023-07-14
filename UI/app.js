// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyDiHQjA--_LFTq1qm4QnG79UydBWF-NjSE",
    authDomain: "dsci551-demo-2.firebaseapp.com",
    databaseURL: "https://dsci551-demo-2-default-rtdb.firebaseio.com",
    projectId: "dsci551-demo-2",
    storageBucket: "dsci551-demo-2.appspot.com",
    messagingSenderId: "483175227189",
    appId: "1:483175227189:web:a0d3a9a792e6ad8476767c"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Firebase Cloud Firestore
var db = firebase.firestore();
let new_document = [];

let profileView = document.getElementById('profile-view');
let uploadView = document.getElementById('upload-view');
let email = document.getElementById('email');
let pword = document.getElementById('pword');

let file = {};

function chooseFile(e) {
    file = e.target.files[0];
};

function upLoadButtonPressed() {
    firebase.auth().signInWithEmailAndPassword(email.value, pword.value).then(auth => {
        var storageRef = firebase.storage().ref();
        var imageRef = storageRef.child(file["name"]);
        // Upload image
        imageRef.put(file)
            .then(() => {
                console.log('successfully uploaded');

                // Get image metadata
                imageRef.getMetadata()
                    .then((metadata) => {
                        console.log('successfully get metadata');
                        console.log(metadata);
                        // Get the metadata ContentType and Created Time in this step 

                        new_document = [...new_document, metadata["size"]];
                        new_document = [...new_document, metadata["contentType"]];
                        new_document = [...new_document, metadata["timeCreated"]];
                        new_document = [...new_document, metadata["updated"]];
                        // update this metadata with custom metadata

                        // var metadata = {
                        //     customMetadata : {
                        //         // NEED TO BE CHANGED LATER
                        //         'classification' : 'Healthy'
                        //     }
                        // };

                        // // update metadata
                        // imageRef.updateMetadata(metadata)
                        //     .then((metadata) => {
                        //         console.log('successfully update metadata');
                        //         console.log('metadata', metadata);
                        //     }).catch((error) => {
                        //         console.log(error.message);
                        //     });
                    })
                    .catch((error) => {
                        console.log(error.message);
                    });
                
                // Get image URL
                imageRef.getDownloadURL()
                    .then((url) => {
                        console.log('successfully get image URL');
                        console.log(url);

                        new_document = [...new_document, url];
                        
                        // inserted into an <img> element
                        var img = document.getElementById('img');
                        img.setAttribute('src', url);
                        img.setAttribute('width', '300px');
                        img.setAttribute('height', '300px');
                    })
                    .then(() => {
                        db.collection("images").add({
                            url: new_document[5],
                            cla_result: new_document[0],
                            size: new_document[2],
                            contentType: new_document[1],
                            timeCreated: new_document[3],
                            updated: new_document[4]
                        })
                    })
                    .catch((error) => {
                        console.log(error.message);
                    })
                
                // Get prediction result
                const fileId = parseInt(file["name"].substr(5));
                url = "https://ran-image-storage.s3.us-west-1.amazonaws.com/output.json";
                fetch(url)
                    .then(response => response.json())
                    .then(data => {
                        // classification result
                        const result_num = data[fileId]["Predicted"];
                        var cla_result = '';

                        if (result_num == 0) {
                            cla_result = 'Healthy'
                        } else if (result_num == 1) {
                            cla_result = 'Has pre-existing conditions'
                        } else {
                            cla_result = 'Has Effusion/Mass in the lungs'
                        }

                        console.log('successfully get classification result');
                        console.log(cla_result);
                        
                        new_document = [...new_document, cla_result];
                    })
                    .catch(error => {
                        console.log(error.message);
                    });
            })
            .catch(error => {
                console.log(error.message);
            })
        })
        .catch(error => {
            console.log(error.message);
        })

        // Successfully get all value for this new document,
        // Then upload it !!!
        // console.log("updated new document", new_document);
        // console.log("url of this document", new_document.message["url"]);
        // db.collection("cities").add({
        //     url: Object.values(new_document)[5],
        //     cla_result: Object.values(new_document)[0],
        //     size: Object.values(new_document)[2],
        //     contentType: Object.values(new_document)[1],
        //     timeCreated: Object.values(new_document)[3],
        //     updated: Object.values(new_document)[4]
        // })
        // .then((docRef) => {
        //     console.log("Document written with ID: ", docRef.id);
        // })
        // .catch((error) => {
        //     console.error("Error adding document: ", error);
        // });
}

function predict() {
    // firebase.auth().signInWithEmailAndPassword("test@gmail.com", "tr123456").then(auth => {
    //     console.log(file);
    // });

    const fileId = parseInt(file["name"].substr(5));
    url = "https://ran-image-storage.s3.us-west-1.amazonaws.com/output.json";
    fetch(url)
        .then(response => response.json())
        .then(data => {
            // classification result
            const result_num = data[fileId]["Predicted"];
            console.log('result_num is', result_num);
            var cla_result = '';

            if (result_num == 0) {
                cla_result = 'Healthy'
            } else if (result_num == 1) {
                cla_result = 'Has pre-existing conditions'
            } else {
                cla_result = 'Has Effusion/Mass in the lungs'
            }

            document.getElementById('cla_result').innerText = 'Classification result: ' + cla_result;
        })
        .catch(error => {
            console.log(error.message);
        });

};

function see() {
    // create the head of the table
    var thead = document.getElementById('thead1');
    var trow1 = document.createElement('tr');
    var th1 = document.createElement('th');
    var th2 = document.createElement('th');
    var th3 = document.createElement('th');
    var th4 = document.createElement('th');
    var th5 = document.createElement('th');
    var th6 = document.createElement('th');
    th1.innerText = "ImageURL";
    th2.innerText = "Classification Result";
    th3.innerText = "ContentType";
    th4.innerText = "Size";
    th5.innerText = "Created Time";
    th6.innerText = "Updated Time";
    trow1.appendChild(th1);
    trow1.appendChild(th2);
    trow1.appendChild(th3);
    trow1.appendChild(th4);
    trow1.appendChild(th5);
    trow1.appendChild(th6);
    thead.appendChild(trow1); 

    db.collection("images").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            // create the body of the table
            var tbody = document.getElementById('tbody1');
            var trow2 = document.createElement('tr');
            var td1 = document.createElement('td');
            var td2 = document.createElement('td');
            var td3 = document.createElement('td');
            var td4 = document.createElement('td');
            var td5 = document.createElement('td');
            var td6 = document.createElement('td');
            td1.innerHTML = doc.data()["url"];
            td2.innerHTML = doc.data()["cla_result"];
            td3.innerHTML = doc.data()["size"];
            td4.innerHTML = doc.data()["contentType"];
            td5.innerHTML = doc.data()["timeCreated"];
            td6.innerHTML = doc.data()["updated"];
            trow2.appendChild(td1);
            trow2.appendChild(td2);
            trow2.appendChild(td3);
            trow2.appendChild(td4);
            trow2.appendChild(td5);
            trow2.appendChild(td6);
            tbody.appendChild(trow2);
        });
    });
}