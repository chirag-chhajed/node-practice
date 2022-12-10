const { da } = require('date-fns/locale')

const data = {
    employees: require('../model/employees.json'),
    setEmployees: function(data){
        this.employees = data
    }
}

const getAllEmployees = (req,res) => {
    res.json(data.employees)
}

const createNewEmployee = (req,res) => {
    const newEmployee = {
        id: data.employees[data.employees.length-1].id + 1 || 1,
        "firstname": req.body.firstname,
        "lastname": req.body.lastname
    }

    if(!newEmployee.firstname || !newEmployee.lastname){
        return res.status(400).json({'message': 'first and last names are required'})
    }

    data.setEmployees([...data.employees,newEmployee])
    res.status(201).json(data.employees)
}

const updateEmployee = (req,res)=>{
    const {firstname,lastname} = req.body
    const employee = data.employees.find(emp => emp.id === parseInt(req.body.id))
    if(!employee){
        return res.status(400).json({"message":`employee id not found`})
    }
    if(firstname) employee.firstname = firstname;
    if(lastname) employee.lastname = lastname
    const filteredArray = data.employees.filter(emp => emp.id !== parseInt(req.body.id))
    const unSortedArray = [...filteredArray,employee]
    data.setEmployees(unSortedArray.sort((a,b)=> a.id > b.id ? 1 : a.id < b.id ? -1 :0))
    res.json(data.employees)
}

const deleteEmployee = (req,res)=>{
    const employee = data.employees.find(emp => emp.id === parseInt(req.body.id))
    if(!employee){
        return res.status(400).json({"message":`employee id not found`})
    }
    const filteredArray = data.employees.filter(emp => emp.id !== parseInt(req.body.id))
    data.setEmployees([...filteredArray])
    res.json(data.employees)
}

const getEmployee = (req,res)=>{
    const employee = data.employees.find(emp => emp.id === parseInt(req.params.id))
    console.log(employee)
    if(!employee){
        return res.status(400).json({"message":`employee id not found`})
    }
    else{
        return res.json(employee)
    }
    
}

module.exports = {
    getAllEmployees,
    createNewEmployee,
    updateEmployee,
    deleteEmployee,
    getEmployee
}