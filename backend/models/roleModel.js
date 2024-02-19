const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema({
  name: String, // Role name (e.g., "user," "admin," "editor," etc.)
  permissions: {
    // Category Management
    createCategory: Boolean,
    updateCategory: Boolean,
    deleteCategory: Boolean,

    // Country Management
    createCountry: Boolean,
    updateCountry: Boolean,
    deleteCountry: Boolean,

    // Customer Management
    createCustomer: Boolean,
    updateCustomer: Boolean,
    deleteCustomer: Boolean,
    getCustomerByEmail: Boolean,

    // Email Subscription Management
    deleteEmailSubscription: Boolean,
    getAllEmailSubscriptions: Boolean,

    // Media Management
    uploadMedia: Boolean,
    getMedia: Boolean,
    deleteMedia: Boolean,

    // Order Management
    getOrdersByEmail: Boolean,
    updateOrderStatusByEmail: Boolean,
    deleteOrderByEmail: Boolean,
    getSingleOrder: Boolean,
    getAllOrders: Boolean,
    updateOrder: Boolean,
    deleteOrder: Boolean,

    // Product Management
    getAdminProducts: Boolean,
    createProduct: Boolean,
    updateProduct: Boolean,
    deleteProduct: Boolean,

    // User Management
    getAllUsers: Boolean,
    getSingleUser: Boolean,
    updateUserRole: Boolean,
    deleteUser: Boolean,

    // Role Management
    getAllRoles: Boolean,
    createRole: Boolean,
    updateRole: Boolean,
    deleteRole: Boolean,
  },
});



module.exports = mongoose.model("Role", roleSchema);
