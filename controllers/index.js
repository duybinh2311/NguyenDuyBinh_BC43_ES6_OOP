import {
  btnAddPerson,
  btnUpdatePerson,
  btnResetForm,
  inputList,
  categoryForm,
  table,
  btnSort,
  searchBox,
  filterCategory,
  errorElement,
} from './DOM.js'
import ListPerson from '../models/ListPerson.js'
import Validation from '../models/Validation.js'

/* Validation Input */
Validation.addPerson = () => {
  /* New Person = Category Select */
  const person = ListPerson[categoryForm.value]()
  // /* Assign Value For Person */
  for (const property in person) {
    const input = inputList.find((element) => element.id === property)
    if (input) person[property] = input.value
  }
  person.category = categoryForm.value
  /* Render List Person */
  ListPerson.add(person)
  ListPerson.render(table)
  ListPerson.saveLocal()
  ListPerson.resetForm()
}
btnAddPerson.onclick = () => {
  Validation.validateForm('.form-input')
}

/* Button Update Person */
btnUpdatePerson.onclick = () => {
  const personEdit = ListPerson[categoryForm.value]()
  for (const property in personEdit) {
    const input = inputList.find((element) => element.id === property)
    if (input) personEdit[property] = input.value
  }
  personEdit.category = categoryForm.value
  ListPerson.update(personEdit)
  ListPerson.render(table)
  ListPerson.saveLocal()
}

/* Button Sort List */
btnSort.onclick = () => {
  const listSortByName = ListPerson.sort()
  ListPerson.render(table, listSortByName)
}

/* Search Box */
searchBox.oninput = () => {
  const listSearch = []
  const keywordAscent = ListPerson.stringToSlug(searchBox.value)
  for (const person of ListPerson.list) {
    if (ListPerson.stringToSlug(person.name).search(keywordAscent) !== -1) {
      listSearch.push(person)
    }
  }
  ListPerson.render(table, listSearch)
}

/* Filter Category */
filterCategory.onchange = () => {
  const value = filterCategory.value // Student
  if (value === 'all') {
    ListPerson.render(table)
    return
  }
  const filterList = ListPerson.list.filter(
    (element) => element.category === value
  )
  ListPerson.render(table, filterList)
}

/* Disable Input By Category Form */
categoryForm.onchange = () => {
  if (categoryForm.value === 'select') {
    for (const input of inputList) {
      input.removeAttribute('disabled')
    }
    ListPerson.resetMessage(inputList, errorElement)
    return
  }
  for (const input of inputList) {
    if (!ListPerson[categoryForm.value]().hasOwnProperty(input.id)) {
      input.setAttribute('disabled', true)
    } else {
      input.removeAttribute('disabled')
    }
  }
  ListPerson.resetMessage(inputList, errorElement)
}

/* Reset Form */
btnResetForm.onclick = () => {
  ListPerson.resetForm()
}

/* Get List Person Form Local And Render UI */
ListPerson.getLocal(table)
