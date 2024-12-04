// Storage Controller
const StorageCtrl = (function(){
    // Public methods

    return {
        storeItem: function(item){
            let items = [];
            // Check if any items in ls
            if(localStorage.getItem('items') !== null){
                items = JSON.parse(localStorage.getItem('items'));
            }
            // Push new item 
            items.push(item);
            // Set local storage
            localStorage.setItem('items', JSON.stringify(items));
        },
        getItemsFromStorage: function(){
            let items = [];
            if(localStorage.getItem('items') !== null){
                items = JSON.parse(localStorage.getItem('items'));
            }
            
            return items;
        },
        updateItemStorage: function(updatedItem){
            let items = JSON.parse(localStorage.getItem('items'));
            
            items.forEach(function(item, index){
                if(updatedItem.id === item.id){
                    items.splice(index, 1, updatedItem);
                }
            });
            localStorage.setItem('items', JSON.stringify(items));
        },
        deleteItemStorage: function(currentItem){
            let items = JSON.parse(localStorage.getItem('items'));
            
            items.forEach(function(item, index){
                if(currentItem.id === item.id){
                    items.splice(index, 1);
                }
            });
            localStorage.setItem('items', JSON.stringify(items));
        },
        clearItemsFromStorage: function(){
            localStorage.removeItem('items');
        }
    }
})();


// Item Controller
const ItemCtrl = (function(){
    // Constructor
    const Item = function(id, name, calories){
        this.id = id;
        this.name = name;
        this.calories = calories;
    }

    // DataStructure / State
    const data = {
        // items: [
        //     // {id: 0, name: 'Steak Dinner', calories: 1200}, 
        //     // {id: 1, name: 'Cookies', calories: 400}, 
        //     // {id: 2, name: 'Eggs', calories: 300} 
        // ],
        items: StorageCtrl.getItemsFromStorage(),
        currentItem: null,
        totalCalories: 0
    }

    // public methods
    return{
        getItems: function(){
            return data.items;
        },
        addItem: function(name, calories){
            let ID;
            // Create id
            if(data.items.length > 0){
                ID = data.items[data.items.length - 1].id + 1;
            }else{
                ID = 0;
            }

            //  Calories to number
            calories = parseInt(calories);

            // Create new item
            newItem = new Item(ID, name, calories);

            data.items.push(newItem);
            
            return newItem;
        },
        getItemById: function(id){
            let found = null;
            data.items.forEach(function(item){
                if(item.id === id){
                    found = item;
                }
            });
            return found;
        },
        updateItem: function(name, calories){
            calories = parseInt(calories);

            let found = null;
            data.items.forEach(function(item){
                if(item.id === data.currentItem.id){
                    item.name = name;
                    item.calories = calories;
                    found = item;
                }
            });
            return found;
        },
        deleteItem: function(id){
            ids = data.items.map(function(item){
                return item.id;
            });

            // Get index
            const index = ids.indexOf(id);

            // Remove Item
            data.items.splice(index, 1);
        },
        clearAllItems: function(){
            data.items = [];
        },
        setCurrentItem: function(item){
            data.currentItem = item;
        },
        getCurrentItem: function(){
            return data.currentItem;
        },
        getTotalCalories: function(){
            let total = 0;

            data.items.forEach(function(item){
                total += item.calories;
            });

            data.totalCalories = total;

            return data.totalCalories;
        },
        logData: function(){
            return data;
        }
    }


})();



//  UI Controller
const UICtrl = (function(){

    const UISelectors = {
        clearBtn: '.clear-btn',
        itemList: '#item-list',
        listItems: '#item-list li',
        addBtn: '.add-btn',
        backBtn: '.back-btn',
        deleteBtn: '.delete-btn',
        updateBtn: '.update-btn',
        itemNameInput: '#item-name',
        itemCaloriesInput: '#item-calories',
        totalCalories: ".total-calories"

    }
    
    // public methods
    return{
        populateItemList: function(items){
            let html = ``;

            items.forEach(function(item){
                html += `<li class="collection-item" id="item-${item.id}">
                <strong>${item.name}: </strong><em>${item.calories} Calories</em>
                <a href="#" class="secondary-content"><i class="material-icons">create</i></a>
                </li>`
            });

            // Insert List Items
            document.querySelector(UISelectors.itemList).innerHTML = html;
        },
        getItemInput: function(){
            return {
                name:document.querySelector(UISelectors.itemNameInput).value,
                calories:document.querySelector(UISelectors.itemCaloriesInput).value
            }
        },
        addListItem: function(item){
            // Show the list
            document.querySelector(UISelectors.itemList).style.display = 'block';
            // Create li element, add class and add id
            const li = document.createElement(`li`);
            li.className = `collection-item`;
            li.id = `item-${item.id}`;
            // Add HTML
            li.innerHTML = `<strong>${item.name}: </strong><em>${item.calories} Calories</em><a href="#" class="secondary-content"><i class="material-icons">create</i></a>`;
            // Insert item
            document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li)
        },
        updateListItem: function(item){
            let listItems = document.querySelectorAll(UISelectors.listItems);

            // Turn Node list into array;
            listItems = Array.from(listItems);

            listItems.forEach(function(listItem){
                const itemID = listItem.getAttribute('id');

                if(itemID === `item-${item.id}`){
                    document.querySelector(`#${itemID}`).innerHTML =  `<strong>${item.name}: </strong><em>${item.calories} Calories</em><a href="#" class="secondary-content"><i class="material-icons">create</i></a>`;
                }
            });
        },
        deleteListItem: function(id){
            const itemID = `#item-${id}`;
            const item = document.querySelector(itemID);
            item.remove();
        },
        clearInput: function(){
            document.querySelector(UISelectors.itemNameInput).value = '';
            document.querySelector(UISelectors.itemCaloriesInput).value = '';
        },
        addItemToForm: function(){
            document.querySelector(UISelectors.itemNameInput).value = ItemCtrl.getCurrentItem().name;
            document.querySelector(UISelectors.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories;
            UICtrl.showEditState();
        },
        removeItems: function(){
            let listItems = document.querySelectorAll(UISelectors.listItems);

            // Turn node list into array
            listItems = Array.from(listItems);

            listItems.forEach(function(item){
                item.remove();
            });
        },
        hideList: function(){
            document.querySelector(UISelectors.itemList).style.display = 'none';
        },
        showTotalCalories: function(totalCalories){
            document.querySelector(UISelectors.totalCalories).textContent = totalCalories;
        },
        clearEditState: function(){
            UICtrl.clearInput();
            document.querySelector(UISelectors.updateBtn).style.display = 'none';
            document.querySelector(UISelectors.backBtn).style.display = 'none';
            document.querySelector(UISelectors.deleteBtn).style.display = 'none';
            document.querySelector(UISelectors.addBtn).style.display = 'inline';
        },
        showEditState: function(){
            document.querySelector(UISelectors.updateBtn).style.display = 'inline';
            document.querySelector(UISelectors.backBtn).style.display = 'inline';
            document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
            document.querySelector(UISelectors.addBtn).style.display = 'none';
        },
        getSelectors: function(){
            return UISelectors;
        }
    }
})();



// App Controller
const AppCtrl = (function(ItemCtrl, StorageCtrl, UICtrl){
    // Load event Listeners
    const loadEventListeners = function(){
        const UISelectors = UICtrl.getSelectors();

        // Add Item event
        document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);

        // Disable submit on enter
        document.addEventListener('keypress', function(e){
            if(e.keycode === 13 || e.which === 13){
                e.preventDefault();
                return false;
            }
        });

        // Edit icon click event
        document.querySelector(UISelectors.itemList).addEventListener('click', itemEditClick);

        // Update Meal event
        document.querySelector(UISelectors.updateBtn).addEventListener('click', itemUpdateSubmit);
        
        // Delete item event
        document.querySelector(UISelectors.deleteBtn).addEventListener('click', itemDeleteSubmit);

        // Back Button event
        document.querySelector(UISelectors.backBtn).addEventListener('click', UICtrl.clearEditState);
        
        // clearall Button event
        document.querySelector(UISelectors.clearBtn).addEventListener('click', clearAllItemsClick);
    };

    // Add item submit
    const itemAddSubmit = function(e){
        // Get form input from Ui Controller
        const input = UICtrl.getItemInput();

        // check for name and calorie input
        if(input.name !== '' && input.calories !== ''){
            // Add item
            const newItem = ItemCtrl.addItem(input.name, input.calories);
            // Add item to UI list
            UICtrl.addListItem(newItem);
            
            // Get the total Caalories
            const totalCalories = ItemCtrl.getTotalCalories();
            // Add total calories to UI
            UICtrl.showTotalCalories(totalCalories);

            // Store in local Storage
            StorageCtrl.storeItem(newItem);

            // clear fields
            UICtrl.clearInput();
        }

        e.preventDefault();
    }
    // click edit item
    const itemEditClick = function(e){
        if(e.target.classList.contains('material-icons')){
            // Get list item id (item-0, item-1)
            const listId = e.target.parentNode.parentNode.id;

            // Break into an array
            const listIdArr = listId.split('-');
            // Get the actual id
            const id = parseInt(listIdArr[1]);
            // Get item
            const itemToEdit = ItemCtrl.getItemById(id);

            // Set current Item
            ItemCtrl.setCurrentItem(itemToEdit);

            // add item to form
            UICtrl.addItemToForm();
        }
        
        
        e.preventDefault();
    }
    // update item submit
    const itemUpdateSubmit = function(e){
        // Get item  input
        const input = UICtrl.getItemInput();

        // Update item
        const updatedItem = ItemCtrl.updateItem(input.name, input.calories);

        // Update UI
        UICtrl.updateListItem(updatedItem);

        // Get the total Caalories
        const totalCalories = ItemCtrl.getTotalCalories();
        // Add total calories to UI
        UICtrl.showTotalCalories(totalCalories);

        // Update local storage
        StorageCtrl.updateItemStorage(updatedItem);

        UICtrl.clearEditState();
        
        e.preventDefault();
    }
    // Delete item submit
    const itemDeleteSubmit = function(e){
        // Get Current Item
        const currentItem = ItemCtrl.getCurrentItem();

        // Delete from data structure
        ItemCtrl.deleteItem(currentItem.id);

        // Delete from UI
        UICtrl.deleteListItem(currentItem.id);

        // Get the total Caalories
        const totalCalories = ItemCtrl.getTotalCalories();
        // Add total calories to UI
        UICtrl.showTotalCalories(totalCalories);

        // Delete in localStorage
        StorageCtrl.deleteItemStorage(currentItem);

        UICtrl.clearEditState();

        e.preventDefault();
    }
    // Clear items event
    const clearAllItemsClick = function(e){
        // Delete all items from data structure
        ItemCtrl.clearAllItems();

        
        // Get the total Caalories
        const totalCalories = ItemCtrl.getTotalCalories();
        // Add total calories to UI
        UICtrl.showTotalCalories(totalCalories);
        
        // Remove from UI
        UICtrl.removeItems();

        // Clear from local storage
        StorageCtrl.clearItemsFromStorage();

        // Hide UL
        UICtrl.hideList();
        
    }

    // Public methods
    return {
        init: function(){
            // Clear edit state / set initial set
            UICtrl.clearEditState();

            // Fetech items from dataStructure 
            const items = ItemCtrl.getItems();

            // Check if any items 
            if(items.length === 0){
                UICtrl.hideList();
            }else{
                // Populate list with items
                UICtrl.populateItemList(items);
            }


            // Get the total Caalories
            const totalCalories = ItemCtrl.getTotalCalories();
            // Add total calories to UI
            UICtrl.showTotalCalories(totalCalories);

            // Load event Listeners 
            loadEventListeners();
        }
    }

})(ItemCtrl, StorageCtrl, UICtrl);

AppCtrl.init();