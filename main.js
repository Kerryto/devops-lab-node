// Lab 5 - 2.5 Modularization
// Imports the data and functions of hospitalData.js and uses them.
// Run with: node main.js
import { doctors, addDoctor, addPatient, filterByAge } from './hospitalData.js'

console.log('Doctors:', doctors)

addDoctor('Dr. Julie')
console.log('Updated doctors:', doctors)

addPatient('Pierre', 50)
console.log('Patients older than 30:', filterByAge(30))
