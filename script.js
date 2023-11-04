const itemForm = document.getElementById('item-form');
const itemInput = document.getElementById('item-input');
const itemList = document.getElementById('item-list');
const itemFilter = document.getElementById('filter');
const clearBtn = document.getElementById('clear');

//functions
//display Items
function displayItems(){
	let itemsFromStorage = getItemsFromStorage();
	itemsFromStorage.forEach(item =>{
		addItemToDOM(item);
	});
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

//Remove item from the list when clicked on the delete mark
function removeItem(e){
	if(e.target.parentElement.classList.contains('remove-item')){
		if(confirm('Are you sure?')){
			e.target.parentElement.parentElement.remove();
		}
	}
	checkUI();
}

//Clear all items in the list
function clearItems(){
	while(itemList.firstChild){
		itemList.removeChild(itemList.firstChild);
	}
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
}


//Event Listeners
function init(){
	itemForm.addEventListener('submit', onAddItemSubmit);
	itemList.addEventListener('click', removeItem);
	clearBtn.addEventListener('click', clearItems);
	itemFilter.addEventListener('input', filterItems);
	document.addEventListener('DOMContentLoaded', displayItems);
	checkUI();
}

init();
