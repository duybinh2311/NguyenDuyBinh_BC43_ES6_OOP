import Person from './Person.js'

export default class Student extends Person {
  mathScore
  physicScore
  chemistryScore
  averageScore() {
    return (
      (Number(this.mathScore) +
        Number(this.physicScore) +
        Number(this.chemistryScore)) /
      3
    )
  }
}
