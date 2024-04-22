

var apigClient = apigClientFactory.newClient();




function textSearch() {
    var searchText = document.getElementById('search_query');
    if (!searchText.value) {
        alert('Please enter a valid text or voice input!');
    } else {
        searchText = searchText.value.trim().toLowerCase();
        console.log('Searching Photos....');
        searchPhotos(searchText);
    }
    
}

function searchPhotos(searchText) {

    console.log(searchText);
    document.getElementById('search_query').value = searchText;
    document.getElementById('photos_search_results').innerHTML = "<h4 style=\"text-align:center\">";

    var params = {
        'q' : searchText,
    };
    
    apigClient.searchGet(params, {}, {})
        .then(function(result) {
            console.log("Result : ", result);

            image_paths = result["data"];
            console.log("image_paths : ", image_paths);

            var photosDiv = document.getElementById("photos_search_results");
            photosDiv.innerHTML = "";

            var n;
            for (n = 0; n < image_paths.length; n++) {
                images_list = image_paths[n].split('/');
                imageName = images_list[images_list.length - 1];

                photosDiv.innerHTML += '<figure><img src="' + image_paths[n] + '" style="width:25%"><figcaption>' + imageName + '</figcaption></figure>';
            }

        }).catch(function(result) {
            var photosDiv = document.getElementById("photos_search_results");
            photosDiv.innerHTML = "Image not found!";
            console.log(result);
        });
}







function getBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      // reader.onload = () => resolve(reader.result)
      reader.onload = () => {
        let encoded = reader.result.replace(/^data:(.*;base64,)?/, '');
        if (encoded.length % 4 > 0) {
          encoded += '='.repeat(4 - (encoded.length % 4));
        }
        resolve(encoded);
      };
      reader.onerror = (error) => reject(error);
    });
  }
  
  function uploadPhoto() {
    var file = document.getElementById('uploaded_file').files[0];
    console.log(file.name)
    fetch('https://day2bvx0f5.execute-api.us-east-1.amazonaws.com/test/dqhb2/' + file.name, {
        method: 'PUT',
        headers: {
            'Content-Type': file.type,
            'x-amz-meta-customLabels': custom_labels.value,
        },
        body: file
    })
    .then(response => {
        if (response.ok) {
            alert("Upload successful!!");
        } else {
            alert("Upload failed!");
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert("Upload failed!");
    });
}