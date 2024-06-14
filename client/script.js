const recipeForm = document.querySelector(".recipe-form")
const recipeList = document.querySelector(".recipe-list")
const updateForm = document.getElementById('updateForm');


const fetchAllRecipes = () => {
    // Using Get Method to fetch all recipes
    fetch("http://localhost:8000/recipes").then((response) => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
        .then((data) => {
            // Display recipe list
            const html = data.map(
                (item) => `<li class="recipe-item" data-id="${item.id}">
                <div class="item-title">${item.title} 
                <div class="item-type">(${item.type} & cook duration: ${item.duration ? `<span id="item-duration">${item.duration}</span>` : `<span id="item-duration">**</span>`}min)</div> 
                <br>
                ${item.description ? `<div id="item-description" class="item-content">${item.description}</div>` : `<div id="item-description" class="item-content"> </div>`}
                </div> 
                <div>
                ${item.photoUrl ? `<img id="item-pic" class="item-pic" src="${item.photoUrl}" alt="recipe picture"/>` : `<img id="item-pic" class="item-pic" src="" alt="No photo address"/>`}
                </div>
                <div>
                <button class="update-item" value="${item.id}" data-id="${item.id}"> Update </button>
                <button class="remove-item" value="${item.id}" data-id="${item.id}"> Delete </button>
                </div>
                </li> <br>`
            ).join("");
            recipeList.innerHTML = html;
        })
        .catch((error) => {
            console.error('There was a problem with the fetch operation:', error);
        });
}


const insertNewRecipeInList = (newRecipe) => {
    // After create new recipe, insert into recipe list and display
    const htmlElement = `<li class="recipe-item" data-id="${newRecipe.id}">
    <div class="item-title" >${newRecipe.title} 
    <div class="item-type">(${newRecipe.type} & cook duration: ${newRecipe.duration ? `<span id="item-duration">${newRecipe.duration}</span>` : `<span id="item-duration">**</span>`} min)</div> 
    <br>
    ${newRecipe.description ? `<div id="item-description" class="item-content">${newRecipe.description}</div>` : `<div id="item-description" class="item-content"> </div>`}
    </div> 
    <div>
    ${newRecipe.photoUrl ? `<img id="item-pic" class="item-pic" src="${newRecipe.photoUrl}" alt="recipe picture"/>` : `<img id="item-pic" class="item-pic" src="" alt="No photo address"/>`}
    </div>
    <div>
    <button class="update-item" value="${newRecipe.id}" data-id="${newRecipe.id}"> Update </button>
    <button class="remove-item" value="${newRecipe.id}" data-id="${newRecipe.id}"> Delete </button>
    </div>
    </li> <br>`
    recipeList.insertAdjacentHTML("afterbegin", htmlElement)

}


recipeForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const newRecipe = {
        title: e.currentTarget.title.value,
        type: e.currentTarget.type.value,
        duration: e.currentTarget.duration.value,
        photoUrl: e.currentTarget.photoUrl.value,
        description: e.currentTarget.description.value
    }
    
    fetch("http://localhost:8000/recipes", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(newRecipe),
    }).then((response) => response.json()).then(
        (data) => {
            console.log("Success:", data)
            e.target.reset();
            newRecipe.id = data.id;
            // insert new recipe in the list 
            insertNewRecipeInList(newRecipe);
        }
    ).catch((error) => {
        console.error('There was a problem with the fetch operation:', error);
    });

})


const deleteSingleRecipe = (id) => {
     //Using Delete Method to remove the recipe
    fetch(`http://localhost:8000/recipes/${id}`, {
        method: 'DELETE',
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then((data) => {
            console.log('Success:', data);
            // Remove the deleted recipe from the list
            removeSingleRecipeFromList(id);
        })
        .catch((error) => {
            console.error('There was a problem with the delete operation:', error);
        });
};

// Remove the item form List
const removeSingleRecipeFromList = (id) => {
    const recipeItem = document.querySelector(`.recipe-item[data-id='${id}']`);
    if (recipeItem) {
        recipeItem.remove();
    }
}


const updateSingleRecipe = (updateRecipe) => {
    //Using Put Method to update Recipe
    console.log(updateRecipe);
    const id = updateRecipe.id;
    const newUpdateRecipe = {
        duration: parseInt(updateRecipe.duration),
        photoUrl: updateRecipe.photoUrl,
        description: updateRecipe.description
    }

    if ((updateRecipe.description == null || updateRecipe.description === '') && 
        (updateRecipe.duration == null || updateRecipe.duration === '') && 
        (updateRecipe.photoUrl == null || updateRecipe.photoUrl === '')){
        console.error('At least one attribute is available')
    } else {
    fetch(`http://localhost:8000/recipes/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(newUpdateRecipe),
    }).then((response) => response.json()).then(
        (data) => {
            console.log("Success:", data)
            //update the modify recipe
            updateForm.style.display = 'none';
            updateSingleRecipeFromList(updateRecipe);

        }
    ).catch((error) => {
        console.error('There was a problem with the update operation:', error);
    });}
};

// Update List

const updateSingleRecipeFromList = (updateRecipe) => {
    const id = updateRecipe.id;
    console.log(updateRecipe);
    const recipeItem = document.querySelector(`.recipe-item[data-id='${id}']`);
    if (recipeItem) {

        const durationElement = recipeItem.querySelector('#item-duration');
        console.log(durationElement);
        if (durationElement) {
            if (updateRecipe.duration){
                durationElement.innerHTML = `<span id="item-duration">${updateRecipe.duration}</span>`
            }else{
                durationElement.innerHTML = `<span id="item-duration">**</span>`
            }
                  }

        const descriptionElement = recipeItem.querySelector('#item-description');
        console.log(descriptionElement);
        if (descriptionElement) {

            if (updateRecipe.description){
                descriptionElement.innerHTML = `<div id="item-description" class="item-content">${updateRecipe.description}</div>`
            }else{
                descriptionElement.innerHTML = `<div id="item-description" class="item-content"> </div>`
            }
        }

        const pictureElement = recipeItem.querySelector('#item-pic');
        console.log(pictureElement);
        if (pictureElement) {
            if (updateRecipe.photoUrl){
                pictureElement.src = updateRecipe.photoUrl;
                pictureElement.alt = "Update photo address"
            }else{
                pictureElement.src = ""
                pictureElement.alt = "No photo address"
            }         
        }
    } else {
        console.error('Update Recipe item not found');
    }

};


const showUpdateForm = (id) => {
    // Get the update recipe popupForm

    const html = `<form id = "popupForm" class="popupForm-container" autocomplete="off">
    <label for="duration"><b>Cook Duration(min)</b></label>
    <input type="number" placeholder="Cook Duration(min)" name="duration" id="duration" min="0" max="1440"/>
    <label for="photoUrl"><b>Photo Url or Local Dir</b></label>
    <input type="text" placeholder="Photo Url or Local Dir" name="photoUrl" maxlength="255" id="photoUrl" pattern="(https?:\/\/.*|\.\/assets\/img\/.*)\.(jpg|jpeg|png)$" />
    <label for="description"><b>Description</b></label>
    <input type="text" placeholder="Description" name="description" maxlength="255" id="description" />
    <button type="submit" class="btn">Confirm Update</button>
    <button type="button" class="btn-cancel"">Close</button>
</form>`

    updateForm.innerHTML = html;
    updateForm.style.display = 'block';

    // Add event listener for submit to update or cancel
    const updateBtn = document.getElementsByClassName('btn');
    const cancelBtn = document.getElementsByClassName('btn-cancel');

    document.querySelector('.popupForm-container').addEventListener('click', (e) => {
        console.log(e);
        if (e.target === cancelBtn[0]) {
            // close popupForm
            updateForm.style.display = 'none';
        }
        if (e.target === updateBtn[0]) {
            // update Recipe information
            document.getElementById("popupForm").addEventListener('submit', function (event) {
                event.preventDefault(); // Prevent default form submission behavior
                const updateRecipe = {
                    id: id,
                    duration: event.currentTarget.duration.value,
                    photoUrl: event.currentTarget.photoUrl.value,
                    description: event.currentTarget.description.value
                }
                updateSingleRecipe(updateRecipe);
            });


        }
    })

};


document.addEventListener('DOMContentLoaded', () => {
    fetchAllRecipes();

    // Add event listener for update buttons
    document.querySelector('.recipe-list').addEventListener('click', (e) => {
        if (e.target && e.target.classList.contains('update-item')) {
            const recipeId = e.target.value;
            showUpdateForm(recipeId);
        }
    });

    // Add event listener for delete buttons
    document.querySelector('.recipe-list').addEventListener('click', (e) => {
        // console.log(e.target);
        // console.log(e.target.classList);
        if (e.target && e.target.classList.contains('remove-item')) {
            const recipeId = e.target.value;
            // Ask for confirmation before deleting
            const userConfirmed = confirm("Are you sure you want to delete this recipe?");
            if (userConfirmed) {
                deleteSingleRecipe(recipeId);
            }
        }
    });

});

