let app = new function() {

  // переменные для форм удаления и обновления элементов
  let deletingID;
  let updatingID;

  // переменные для сортировки элементов
  let ascendingName      = false;
  let ascendingPrice     = true;
  let lastSelectedFilter = 'name';

  // значения инпутов из формы добавления элементов
  let getName  = document.getElementById('add-name');
  let getCount = document.getElementById('add-count');
  let getPrice = document.getElementById('add-price');

  // значения инпутов из формы редактирования элементов
  let editName  = document.getElementById('edit-name');
  let editCount = document.getElementById('edit-count');
  let editPrice = document.getElementById('edit-price');

  // модальные окна приложения
  let addModule    = document.getElementById('add-module');
  let editModule   = document.getElementById('edit-module');
  let deleteModule = document.getElementById('delete-module');
  let inactiveMask = document.getElementById('inactive-mask');

  // поля ошибок формы добавления элементов
  let addErrorNameField  = document.getElementById('add-error-information-name');
  let addErrorCountField = document.getElementById('add-error-information-count');
  let addErrorPriceField = document.getElementById('add-error-information-price');

  // поля ошибок формы редактирования элементов
  let editErrorNameField  = document.getElementById('edit-error-information-name');
  let editErrorCountField = document.getElementById('edit-error-information-count');
  let editErrorPriceField = document.getElementById('edit-error-information-price');


  this.table    = document.getElementById('products');
  this.products = [{name: 'Books', count: 10, price: 1400},
               {name: 'Magazines', count: 25, price: 1000},
               {name: 'Newspapers', count: 140, price: 2800}
             ];

  this.FetchAll = function() {
    let data = '';
    if (this.products.length > 0) {
      for (i = 0; i < this.products.length; i++) {
        data += '<tr>';
        data += '<td class="app__table-name-value">' + this.products[i].name +
                '</td>';
        data += '<td class="app__table-count-value">' + this.products[i].count +
                '</td>';
        data += '<td>' + ' ' + new Intl.NumberFormat('en-EN',
        { style: 'currency', currency: 'USD' }).format(this.products[i].price)
        + '</td>';
        data += '<td><div class="app__table-actions-block">' +
                '<button onclick="app.Edit(' + i + ')">Edit</button>' +
                '<button onclick="app.Delete(' + i + ')">Delete</button></div></td>';
        data += '</tr>';
      }
    }
    return this.table.innerHTML = data;
  };

  this.Add = function() {
    class NewObj {
      constructor(name, count, price) {
        this.name = name;
        this.count = count;
        this.price = price;
      }
    }

    let product = new NewObj(getName.value.trim(), getCount.value, getPrice.value);

    if (this.Check('get')) {
        addModule.style.display = 'none';
        inactiveMask.style.display = 'none';

        this.products.push(product);
        this.FetchAll();

        // сортировка таблицы по действующему фильтру при добавлении элемента
        ascendingName  = !ascendingName;
        ascendingPrice = !ascendingPrice;
        this.Sort(lastSelectedFilter);

        getName.value  = '';
        getCount.value = '';
        getPrice.value = '';
      }
  };

  this.AddNew = function() {
    addModule.style.display = 'flex';
    inactiveMask.style.display = 'block';

    getName.value  = '';
    getCount.value = '';
    getPrice.value = '';

    getName.style.borderColor  = '#0C2427';
    getCount.style.borderColor = '#0C2427';
    getPrice.style.borderColor = '#0C2427';

    addErrorNameField.innerHTML = '';
    addErrorCountField.innerHTML = '';
    addErrorPriceField.innerHTML = '';
  };

  this.closeAddForm = function() {
    addModule.style.display = 'none';
    inactiveMask.style.display = 'none';
  };

  this.Delete = function(item) {
    deletingID = item;
    deleteModule.style.display = 'flex';
    inactiveMask.style.display = 'block';
  };

  this.closeDeleteForm = function() {
    deleteModule.style.display = 'none';
    inactiveMask.style.display = 'none';
  };

  this.applyDeleteForm = function() {
    deleteModule.style.display = 'none';
    inactiveMask.style.display = 'none';
    this.products.splice(deletingID, 1);
    this.FetchAll();
  };

  this.Edit = function(item) {
    editModule.style.display = 'flex';
    inactiveMask.style.display = 'block';

    updatingID = item;

    editName.style.borderColor = '#0C2427';
    editCount.style.borderColor = '#0C2427';
    editPrice.style.borderColor = '#0C2427';

    editName.value  = this.products[item].name;
    editCount.value = this.products[item].count;
    editPrice.value = this.products[item].price;

    editErrorNameField.innerHTML = '';
    editErrorCountField.innerHTML = '';
    editErrorPriceField.innerHTML = '';
  };

  this.closeEditForm = function() {
   editModule.style.display = 'none';
   inactiveMask.style.display = 'none';
  }

   this.applyEditForm = function() {
     if (this.Check('edit')) {
       this.products[updatingID].name  = editName.value;
       this.products[updatingID].count = editCount.value;
       this.products[updatingID].price = editPrice.value;

       this.FetchAll();

       ascendingName  = !ascendingName;
       ascendingPrice = !ascendingPrice;
       this.Sort(lastSelectedFilter);

       editModule.style.display = 'none';
       inactiveMask.style.display = 'none';
     }
   };

  this.Sort = function(param) {
    if (param === 'name') {
      if (ascendingName) {
        this.products.sort(compareDescendingName);
        ascendingName = false;
        lastSelectedFilter = 'name';
        document.getElementById("table-sort-triangle-name").innerHTML="&#9660;"
      } else {
        this.products.sort(compareAscendingName);
        ascendingName = true;
        lastSelectedFilter = 'name';
        document.getElementById("table-sort-triangle-name").innerHTML="&#9650;"
      }
    };

    if (param === 'price') {
      if (ascendingPrice) {
        this.products.sort(compareDescendingPrice);
        ascendingPrice = false;
        lastSelectedFilter = 'price';
        document.getElementById("table-sort-triangle-price").innerHTML="&#9660;"
      } else {
        this.products.sort(compareAscendingPrice);
        ascendingPrice = true;
        lastSelectedFilter = 'price';
        document.getElementById("table-sort-triangle-price").innerHTML="&#9650;"
      }
    }

    this.FetchAll();

    function compareAscendingPrice(x, y) {
      return x.price - y.price;
    }
    function compareDescendingPrice(x, y) {
      return y.price - x.price;
    }

    function compareAscendingName(x, y) {
      if (x.name > y.name) return 1;
      if (x.name < y.name) return -1;
    }
    function compareDescendingName(x, y) {
      if (x.name > y.name) return -1;
      if (x.name < y.name) return 1;
    }
  };

  // сортировка элементов таблицы по параметру name при загрузке страницы
  this.Sort('name');

  this.Search = function() {
    let searchValue = document.getElementById('search-form').value.toLowerCase().trim();
    let searchArray = this.products;
    let searchCompleted = [];

    for (i = 0; i < searchArray.length; i++) {
      let currentStr = searchArray[i].name.slice(0, searchValue.length).toLowerCase();
      if (searchValue === currentStr) {
        searchCompleted.push(searchArray[i]);
      }
    }

    this.products = searchCompleted;
    this.FetchAll();
    document.getElementById('search-form').value = '';
  };

  /*
   * Проверяет корректность заполнения формы
   *
   * @param {get} - проверка формы добавления нового элемента
   * @param {edit} - проверка формы редактирования элемента
   * return {true/false} - корректно/некорректно заполнена форма
   */
  this.Check = function(param) {
    let checker = true;

    if (param === 'get') {
      if (getName.value.trim() === '') {
        getName.style.borderColor = '#F2223C';
        addErrorNameField.innerHTML = 'Please, enter the value.';
        checker = false;
      }
      if (getName.value.trim().length > 15) {
        getName.style.borderColor = '#F2223C';
        addErrorNameField.innerHTML = 'Sorry, but the field can\'t ' +
                                      'exceed 15 characters.';
        checker = false;
      }
      if (getCount.value.trim() === '') {
        getCount.style.borderColor = '#F2223C';
        addErrorCountField.innerHTML = 'Please, enter the value.';
        checker = false;
      }
      if (getPrice.value.trim() === '') {
        getPrice.style.borderColor = '#F2223C';
        addErrorPriceField.innerHTML = 'Please, enter the value.';
        checker = false;
      }
      return checker;
    }

    if (param === 'edit') {
      if (editName.value.trim() === '') {
        editName.style.borderColor = '#F2223C';
        editErrorNameField.innerHTML = 'Please, enter the value.';
        checker = false;
      }
      if (editName.value.trim().length > 15) {
        editName.style.borderColor = '#F2223C';
        editErrorNameField.innerHTML = 'Sorry, but the field can\'t ' +
                                       'exceed 15 characters.';
        checker = false;
      }
      if (editCount.value.trim() === '') {
        editCount.style.borderColor = '#F2223C';
        editErrorCountField.innerHTML = 'Please, enter the value.';
        checker = false;
      }
      if (editPrice.value.trim() === '') {
        editPrice.style.borderColor = '#F2223C';
        editErrorPriceField.innerHTML = 'Please, enter the value.';
        checker = false;
      }
      return checker;
    }
  };

  // подсвечивание некорректных значений после потери фокуса

  getName.onblur = function() {
    if (getName.value.trim() === '') {
      getName.style.borderColor = '#F2223C';
      addErrorNameField.innerHTML = 'Please, enter the value.';
    }
    if (getName.value.trim().length > 15) {
      getName.style.borderColor = '#F2223C';
      addErrorNameField.innerHTML = 'Sorry, but the field can\'t ' +
                                    ' exceed 15 characters.';
    }
  }
  getName.onfocus = function() {
      getName.style.borderColor = '#0C2427';
      addErrorNameField.innerHTML = '';
  };

  getCount.onblur = function() {
    if (getCount.value.trim() === '') {
      getCount.style.borderColor = '#F2223C';
      addErrorCountField.innerHTML = 'Please, enter the value.';
    }
  }
  getCount.onfocus = function() {
      getCount.style.borderColor = '#0C2427';
      addErrorCountField.innerHTML = '';
  };

  getPrice.onblur = function() {
    if (getPrice.value.trim() === '') {
      getPrice.style.borderColor = '#F2223C';
      addErrorPriceField.innerHTML = 'Please, enter the value.';
    }
  }
  getPrice.onfocus = function() {
      getPrice.style.borderColor = '#0C2427';
      addErrorPriceField.innerHTML = '';
  };

  editName.onblur = function() {
    if (editName.value.trim() === '') {
      editName.style.borderColor = '#F2223C';
      editErrorNameField.innerHTML = 'Please, enter the value.';
    }
    if (editName.value.trim().length > 15) {
      getName.style.borderColor = '#F2223C';
      editErrorNameField.innerHTML = 'Sorry, but the field can\'t ' +
                                     ' exceed 15 characters.';
    }
  }
  editName.onfocus = function() {
      editName.style.borderColor = '#0C2427';
      editErrorNameField.innerHTML = '';
  };

  editCount.onblur = function() {
    if (editCount.value.trim() === '') {
      editCount.style.borderColor = '#F2223C';
      editErrorCountField.innerHTML = 'Please, enter the value.';
    }
  }
  editCount.onfocus = function() {
      editCount.style.borderColor = '#0C2427';
      editErrorCountField.innerHTML = '';
  };

  editPrice.onblur = function() {
    if (editPrice.value.trim() === '') {
      editPrice.style.borderColor = '#F2223C';
      editErrorPriceField.innerHTML = 'Please, enter the value.';
    }
  }
  editPrice.onfocus = function() {
      editPrice.style.borderColor = '#0C2427';
      editErrorPriceField.innerHTML = '';
  };

};

app.FetchAll();
