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
  static render(table, listPerson = this.list) {
    let htmlString = ''
    for (const person of listPerson) {
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
        this.edit(this.list[index].id)
      })
    }
    for (const [index, btn] of btnListDelete.entries()) {
      btn.addEventListener('click', () => {
        ListPerson.delete(this.list[index].id)
        this.render(table)
        this.saveLocal()
      })
    }
  }
  /* Add Person */
  static add(person) {
    this.list.push(person)
  }
  /* Edit Person */
  static edit(id) {
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
  static delete(id) {
    const indexPerson = this.list.findIndex((element) => element.id === id)
    this.list.splice(indexPerson, 1)
  }
  /* Update Person */
  static update(personEdit) {
    const person = this.list.find((person) => person.id === personEdit.id)
    Object.assign(person, personEdit)
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
  /* Reset Message Error */
  static resetMessage(arrInput, arrError) {
    for (const input of arrInput) {
      input.classList.remove('border-danger')
    }
    for (const error of arrError) {
      error.classList.add('d-none')
    }
  }
  /* Sort By Name */
  static sort() {
    const listSortByName = [...this.list]
    listSortByName.sort((a, b) => {
      const fullNameA = a.name.toLowerCase()
      const fullNameB = b.name.toLowerCase()
      const nameA = fullNameA.split(' ')
      const nameB = fullNameB.split(' ')
      if (nameA[nameA.length - 1] < nameB[nameB.length -1]) return -1
      if (nameA[nameA.length - 1] > nameB[nameB.length -1]) return 1
      return 0
    })
    return listSortByName
  }
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
    this.render(table)
  }
  /* String To Slug */
  static stringToSlug(string) {
    let slug = string.toLowerCase()
    slug = slug.replace(/á|à|ả|ạ|ã|ă|ắ|ằ|ẳ|ẵ|ặ|â|ấ|ầ|ẩ|ẫ|ậ/gi, 'a')
    slug = slug.replace(/é|è|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ/gi, 'e')
    slug = slug.replace(/i|í|ì|ỉ|ĩ|ị/gi, 'i')
    slug = slug.replace(/ó|ò|ỏ|õ|ọ|ô|ố|ồ|ổ|ỗ|ộ|ơ|ớ|ờ|ở|ỡ|ợ/gi, 'o')
    slug = slug.replace(/ú|ù|ủ|ũ|ụ|ư|ứ|ừ|ử|ữ|ự/gi, 'u')
    slug = slug.replace(/ý|ỳ|ỷ|ỹ|ỵ/gi, 'y')
    slug = slug.replace(/đ/gi, 'd')
    slug = slug.replace(
      /\`|\~|\!|\@|\#|\||\$|\%|\^|\&|\*|\(|\)|\+|\=|\,|\.|\/|\?|\>|\<|\'|\"|\:|\;|_/gi,
      ''
    )
    slug = slug.replace(/ /gi, '-')
    slug = slug.replace(/\-\-\-\-\-/gi, '-')
    slug = slug.replace(/\-\-\-\-/gi, '-')
    slug = slug.replace(/\-\-\-/gi, '-')
    slug = slug.replace(/\-\-/gi, '-')
    slug = '@' + slug + '@'
    slug = slug.replace(/\@\-|\-\@|\@/gi, '')
    return slug
  }
}
