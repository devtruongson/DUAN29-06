const Role = require('../models/role')


module.exports = {

    createRecordsDefault: async () => {
        try {
           const roleAdmin = await Role.findOne({ where: { roleID: 1 } })
            if (roleAdmin == null) await Role.create({ roleID: 1, roleName: 'admin' })

          const  roleCustomer = await Role.findOne({ where: { roleID: 2 } })
            if (roleCustomer == null) await Role.create({ roleID: 2, roleName: 'customer' })

           
        } catch (err) {
            console.log(err)
        }
    }
}