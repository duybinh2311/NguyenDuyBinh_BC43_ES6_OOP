import {
  inputList,
  table,
  categoryForm,
  btnAddPerson,
  btnClose,
} from '../controllers/DOM.js'
import Customer from './Customer.js'
import Employee from './Employee.js'
import Student from './Student.js'

export default class ListPerson {
  static list = []
  /* Instance Of Class */
  static student = () => new Student()
  static employee = () => new Employee()
  static customer = () => new Customer()

  /* Render List Person */
  static renderListPerson(table) {
    let htmlString = ''
    for (const person of this.list) {
      htmlString += `
      <tr>
        <td>${person.id}</td>
        <td>${person.name}</td>
        <td>${person.address}</td>
        <td>${person.email}</td>
        <td class="text-center">${
          person.averageScore ? person.averageScore() : ''
        }</td>
        <td class="text-center">${
          person.totalSalary ? person.totalSalary() : ''
        }</td>
        <td class="text-center">${person.nameCompany || ''}</td>
        <td class="text-center">${person.billInvoice || ''}</td>
        <td class="text-center">${person.serviceRating || ''}</td>
        <td class="text-center">
          <button class="btn btn-primary btn-sm btn-edit" data-bs-toggle="modal" data-bs-target="#formInput">
            <i class="fa fa-edit"></i>
          </button>
          <button class="btn btn-danger btn-sm btn-delete" onclick="delete(${
            person.id
          })">
            <i class="fa fa-times-circle"></i>
          </button>
        </td>
        <td class="text-center text-capitalize">${person.category || ''}</td>
      </tr>
    `
    }
    table.innerHTML = htmlString
    this.eventHandleBtn()
  }
  /* Assign Event Button */
  static eventHandleBtn() {
    const btnListEdit = document.querySelectorAll('.btn-edit')
    const btnListDelete = document.querySelectorAll('.btn-delete')
    for (const [index, btn] of btnListEdit.entries()) {
      btn.addEventListener('click', () => {
        this.updatePerson(this.list[index].id)
      })
    }
    for (const [index, btn] of btnListDelete.entries()) {
      btn.addEventListener('click', () => {
        ListPerson.deletePerson(this.list[index].id)
      })
    }
  }
  /* Update Person */
  static updatePerson(id) {
    const person = this.list.find((element) => element.id === id)
    for (const input of inputList) {
      if (!person.hasOwnProperty(input.id)) {
        input.value = ''
      } else {
        input.value = person[input.id]
      }
    }
    categoryForm.value = person.category
    categoryForm.dispatchEvent(new Event('change'))
    categoryForm.setAttribute('disabled', true)
    inputList[0].setAttribute('disabled', true)
    btnAddPerson.setAttribute('disabled', true)
    btnClose.addEventListener('click', this.resetForm, { once: true })
  }
  /* Delete Person */
  static deletePerson(id) {
    const indexPerson = this.list.findIndex((element) => element.id === id)
    this.list.splice(indexPerson, 1)
    this.renderListPerson(table)
    this.saveLocal()
  }
  /* Reset Form */
  static resetForm() {
    categoryForm.value = 'select'
    categoryForm.dispatchEvent(new Event('change'))
    categoryForm.removeAttribute('disabled')
    btnAddPerson.removeAttribute('disabled')
    for (const input of inputList) {
      input.value = ''
    }
  }
  /* Confirm Update Person */
  // static confirmUpdatePerson()
  /* Error Message */
  static alertError(message) {
    alert(message)
  }
  /* Save List Person To Local */
  static saveLocal() {
    if (this.list.length) {
      localStorage.setItem('listPerson', JSON.stringify(this.list))
      return
    }
    localStorage.removeItem('listPerson')
  }
  /* Get List Person From Local And Render */
  static getLocal(table) {
    /* Get List, Return If Get False */
    let listPersonLocal
    if (localStorage.getItem('listPerson')) {
      listPersonLocal = JSON.parse(localStorage.getItem('listPerson'))
    } else return
    /* Convert List Because Local Not Save Function */
    this.list = listPersonLocal.map((element) => {
      const person = this[element.category]()
      Object.assign(person, element)
      return person
    })
    /* Render List Person */
    this.renderListPerson(table)
  }
}
