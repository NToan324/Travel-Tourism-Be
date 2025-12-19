import UserModel from '@/models/user.model'

async function initializeAdminUser() {
    const adminUser = await UserModel.findOne({
        email: process.env.ADMIN_EMAIL,
        role: 'admin',
    })
    if (!adminUser) {
        await UserModel.create({
            fullName: 'Admin',
            email: process.env.ADMIN_EMAIL,
            password: process.env.ADMIN_PASSWORD,
            role: 'admin',
        })

        console.log('Admin user created')
    }
}

initializeAdminUser().catch((error) => {
    console.error('Error initializing admin user:', error)
})