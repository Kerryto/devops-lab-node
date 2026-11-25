// 2.1 Variables and Data Types
const hospitalName = 'Central Hospital'
const numberOfDoctors = 12
let isOpen = true

if (isOpen) {
  console.log(`Welcome to ${hospitalName}! We have ${numberOfDoctors} doctors currently available.`)
} else {
  console.log(`${hospitalName} is currently closed.`)
}

isOpen = false
if (!isOpen) {
  console.log(`Update: ${hospitalName} is now closed.`)
}

// 2.2 Working with Arrays and Loops
const doctors = ['Dr. Lee', 'Dr. Khan', 'Dr. Sarah', 'Dr. Alain', 'Dr. Julie']

let index = 1
for (const doc of doctors) {
  console.log(`Doctor #${index}: ${doc}`)
  index++
}

doctors.push('Dr. Emma')
console.log(`Updated doctor count: ${doctors.length}`)

function findDoctor (name) {
  return doctors.includes(name) ? 'Doctor found' : 'Doctor not found'
}
console.log(findDoctor('Dr. Lee'))
console.log(findDoctor('Dr. Unknown'))

// 2.3 Objects and Nested Data
const patient = {
  name: 'Alice Martin',
  age: 34,
  conditions: ['diabetes', 'hypertension'],
  doctor: { name: 'Dr. Lee', specialty: 'Cardiology' }
}

console.log(`Doctor name: ${patient.doctor.name}`)
console.log(`Number of conditions: ${patient.conditions.length}`)
console.log(`${patient.name} is treated by ${patient.doctor.name} (${patient.doctor.specialty}).`)

patient.conditions.push('anxiety')
console.log('Updated patient object:', patient)

// 2.4 Functions and Array Filtering
const patients = [
  { id: 1, name: 'Alice', age: 34 },
  { id: 2, name: 'John', age: 45 },
  { id: 3, name: 'Marie', age: 29 }
]

function filterByAge (minAge) {
  return patients.filter(p => p.age > minAge)
}

function addPatient (name, age) {
  const newPatient = { id: patients.length + 1, name, age }
  patients.push(newPatient)
}

addPatient('Pierre', 50)
console.log('Patients older than 30:', filterByAge(30))

// 2.6 Error Handling and Validation
function createAppointment (doctorNameParam, patientNameParam, date) {
  if (!doctorNameParam || !patientNameParam || !date) {
    throw new Error('Missing required fields')
  }
  return { doctor: doctorNameParam, patient: patientNameParam, date }
}

try {
  console.log(createAppointment('Dr. Lee', 'Alice', '2025-03-15'))
  console.log(createAppointment('Dr. Lee'))
} catch (err) {
  console.error('Error:', err.message)
}

// 2.7 Asynchronous Code
function getHospitalData () {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ name: 'Central Hospital', uptime: 1234 })
    }, 1000)
  })
}

async function showData () {
  console.log('Fetching hospital data...')
  const data = await getHospitalData()
  console.log('Data loaded:', data)
}

showData()
