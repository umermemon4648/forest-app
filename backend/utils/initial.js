const Category = require("../models/categoryModel");
const Country = require("../models/countryModel");
const Role = require("../models/roleModel");

// Function to initialize default categories and countries
const initializeDefaults = async () => {
  try {
    // Create default category if it doesn't exist
    const uncategorizedCategory = await Category.findOne({ name: "uncategorized" });
    if (!uncategorizedCategory) {
      await Category.create({
        name: "uncategorized",
        description: "Default category for uncategorized products",
      });
    }

    // Create default country if it doesn't exist
    const ourForestCountry = await Country.findOne({ name: "Our Forest" });
    if (!ourForestCountry) {
      await Country.create({
        name: "Our Forest",
        description: "Default country for Our Forest locations",
      });
    }
    const defaultRole = await Role.findOne({ name: "admin" });
    if (!defaultRole) {
      await Role.create({
        name: "admin",
        permissions: {
          // Category Management
          createCategory: true,
          updateCategory: true,
          deleteCategory: true,
        
          // Country Management
          createCountry: true,
          updateCountry: true,
          deleteCountry: true,
        
          // Customer Management
          createCustomer: true,
          updateCustomer: true,
          deleteCustomer: true,
          getCustomerByEmail : true,
        
          // Email Subscription Management
          deleteEmailSubscription: true,
          getAllEmailSubscriptions: true,

          // Media Management
          uploadMedia: true,
          getMedia: true,
          deleteMedia: true,
        
          // Order Management
          getOrdersByEmail: true,
          updateOrderStatusByEmail: true,
          deleteOrderByEmail: true,
          getSingleOrder: true,
          getAllOrders: true,
          updateOrder: true,
          deleteOrder: true,
        
          // Product Management
          getAdminProducts: true,
          createProduct: true,
          updateProduct: true,
          deleteProduct: true,
        
          // User Management
          getAllUsers: true,
          getSingleUser: true,
          updateUserRole: true,
          deleteUser: true,
        
          // Role Management
          getAllRoles: true,
          createRole: true,
          updateRole: true,
          deleteRole: true,
        },
        
      });
    }
    

  } catch (err) {
    console.error(err);
  }
};

module.exports = initializeDefaults;
