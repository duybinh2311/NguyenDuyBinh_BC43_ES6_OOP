import {
  btnAddPerson,
  btnUpdatePerson,
  btnResetForm,
  inputList,
  categoryForm,
  table,
} from './DOM.js'
import ListPerson from '../models/ListPerson.js'

/* Form Input */
/* Add Person */
btnAddPerson.onclick = () => {
  /* If Don't Select Category => Return */
  if (categoryForm.value === 'select') {
    ListPerson.alertError('Please select category')
    return
  }
  /* New Person = Category Select */
  const person = ListPerson[categoryForm.value]()
  /* Assign Value For Person */
  for (const property in person) {
    const input = inputList.find((element) => element.id === property)
    if (input) person[property] = input.value
  }
  person.category = categoryForm.value
  /* Valid ID And Push Person To Array Person */
  if (ListPerson.list.find((element) => element.id === person.id)) {
    ListPerson.alertError('This ID is already on the list')
    return
  } else {
    ListPerson.list.push(person)
  }
  /* Render List Person */
  ListPerson.renderListPerson(table)
  ListPerson.saveLocal()
  ListPerson.resetForm()
}

/* Disable Input By Category Form */
categoryForm.onchange = () => {
  if (categoryForm.value === 'select') {
    for (const input of inputList) {
      input.removeAttribute('disabled')
    }
    return
  }
  for (const input of inputList) {
    if (!ListPerson[categoryForm.value]().hasOwnProperty(input.id)) {
      input.setAttribute('disabled', true)
    } else {
      input.removeAttribute('disabled')
    }
  }
}

/* Reset Form */
btnResetForm.onclick = () => {
  ListPerson.resetForm()
}

/* Get List Person Form Local And Render UI */
ListPerson.getLocal(table)
