// Lab 5 - 2.5 Modularization
// This module only holds data and functions: it prints nothing by itself.

export const doctors = ['Dr. Lee', 'Dr. Khan']

export const patients = [
  { id: 1, name: 'Alice', age: 34 },
  { id: 2, name: 'John', age: 45 },
  { id: 3, name: 'Marie', age: 29 }
]

export function addDoctor (name) {
  doctors.push(name)
}

export function addPatient (name, age) {
  const id = patients.reduce((max, p) => Math.max(max, p.id), 0) + 1
  const patient = { id, name, age }
  patients.push(patient)
  return patient
}

export function filterByAge (minAge) {
  return patients.filter(p => p.age > minAge)
}
