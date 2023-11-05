const itemForm = document.getElementById('item-form');
const itemInput = document.getElementById('item-input');
const itemList = document.getElementById('item-list');
const itemFilter = document.getElementById('filter');
const clearBtn = document.getElementById('clear');
const formBtn = itemForm.querySelector('button');
let isEditMode = false;

//functions
//display Items
function displayItems(){
	let itemsFromStorage = getItemsFromStorage();
	itemsFromStorage.forEach(item =>{
		addItemToDOM(item);
	});
	checkUI();
}

//Adding items on submit
function onAddItemSubmit(e){
	e.preventDefault();

	const newItem = itemInput.value;
	//Validate Input
   if(newItem === ''){
        alert('please add an item');
        return;
   }

   //Check for edit mode
   if(isEditMode){
	const itemToEdit = itemList.querySelector('.edit-mode');

	removeItemFromLocalStorage(itemToEdit.textContent);
	itemToEdit.classList.remove('edit-mode');
	itemToEdit.remove();
	isEditMode = false;
   }else{
	if(checkIfItemExists(newItem)){
		alert('That item already exists!');
		return;
	}
   }

   //Add item to DOM
   addItemToDOM(newItem);

   //Add Item to the LocalStorage
   addItemToStorage(newItem);
   	//Check list items
	checkUI();
	itemInput.value = '';
}

//Add item to DOM
function addItemToDOM(item){
	//create list item
	const li = document.createElement('li');
	li.appendChild(document.createTextNode(item));

	//create a button
	const button = createButton('remove-item btn-link text-red');

	li.appendChild(button);
	itemList.appendChild(li);
}

//create button function
function createButton(classes){
	const button = document.createElement('button');
	button.className = classes;
	//create icon
	const icon = createIcon('fa-solid fa-xmark');
	button.appendChild(icon);
	return button;
}

//Create Icon function
function createIcon(classes){
	const icon = document.createElement('i');
	icon.className = classes;
	return icon;
}


//Add Item to the LocalStorage
function addItemToStorage(item){
	let itemsFromStorage = getItemsFromStorage();

	//push item to array
	itemsFromStorage.push(item);

	//convert to JSON string using JSON.stringify() and set to localStorage
	localStorage.setItem('items', JSON.stringify(itemsFromStorage));
	
}

//get items from localStorage
function getItemsFromStorage(){
	let itemsFromStorage;

	if(localStorage.getItem('items') === null){
		itemsFromStorage = [];
	}else{
		itemsFromStorage = JSON.parse(localStorage.getItem('items'));
	}

	return itemsFromStorage;
}

function onClickItem(e){
	if(e.target.parentElement.classList.contains('remove-item')){
		removeItem(e.target.parentElement.parentElement);
	}else{
		setItemToEdit(e.target);
	}
}

//Set Item to Edit Mode
function setItemToEdit(item){
	isEditMode = true;

	itemList.querySelectorAll('li').forEach((i) =>{
		i.classList.remove('edit-mode');
	})

	// item.style.color = 'red';
	item.classList.add('edit-mode');//from style.css
	formBtn.innerHTML = '<i class="fa-solid fa-open"></i> Update Item';
	formBtn.style.backgroundColor = '#228B22';
	itemInput.value = item.textContent;
}

//Remove item from the list when clicked on the delete mark
function removeItem(item){
	if(confirm('Are you sure?')){
		//Remove item from DOM
		item.remove();

		//remove item form the localStorage
		removeItemFromLocalStorage(item.textContent);

		checkUI();
	}
	
}

//Remove Items fromm the localStorage
function removeItemFromLocalStorage(item){
	let itemsFromStorage = getItemsFromStorage();
	//Filter out items to be removed
	itemsFromStorage = itemsFromStorage.filter(i => i!== item);

	//re-set to local storage
	localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}

//Clear all items in the list
function clearItems(){
	//clear all items from the DOM
	while(itemList.firstChild){
		itemList.removeChild(itemList.firstChild);
	}

	//Clear all items from the localStorage
	localStorage.removeItem('items');

	checkUI();
}

//filter Items
function filterItems(e){
	const items = document.querySelectorAll('li');
	const text = e.target.value.toLowerCase();
	
	items.forEach(item =>{
		const itemName = item.firstChild.textContent.toLowerCase();
		
		if(itemName.indexOf(text) != -1){
			item.style.display = 'flex';
		}else{
			item.style.display = 'none';
		}
	});
	
}


//Reset UI state to original when there are no list items
function checkUI(){
	const items = document.querySelectorAll('li');
	if(items.length === 0){
		clearBtn.style.display = 'none';
		itemFilter.style.display = 'none';
	}else{
		clearBtn.style.display = 'block';
		itemFilter.style.display = 'block';
	}

	formBtn.innerHTML = '<i class = "fa-solid fa-plus"></i> Add Item';
	formBtn.style.backgroundColor = '#333';

	isEditMode = false;
}

function checkIfItemExists(item){
	const itemsFromStorage = getItemsFromStorage();
	return itemsFromStorage.includes(item);
}


//Event Listeners
function init(){
	itemForm.addEventListener('submit', onAddItemSubmit);
	itemList.addEventListener('click', onClickItem);
	clearBtn.addEventListener('click', clearItems);
	itemFilter.addEventListener('input', filterItems);
	document.addEventListener('DOMContentLoaded', displayItems);
	checkUI();
}

init();
