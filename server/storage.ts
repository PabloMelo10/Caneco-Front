import { 
  User, InsertUser, 
  Product, InsertProduct,
  Category, InsertCategory,
  Sale, InsertSale,
  CashTransaction, InsertCashTransaction,
  DailyRegister, InsertDailyRegister
} from "@shared/schema";

// modify the interface with any CRUD methods
// you might need
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Category operations
  getCategories(): Promise<Category[]>;
  getCategory(id: number): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  
  // Product operations
  getProducts(): Promise<Product[]>;
  getProductsByCategory(categoryId: number): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  
  // Sale operations
  getSales(): Promise<Sale[]>;
  getSalesByDateRange(startDate: Date, endDate: Date): Promise<Sale[]>;
  getSale(id: number): Promise<Sale | undefined>;
  createSale(sale: InsertSale): Promise<Sale>;
  
  // Cash transaction operations
  getCashTransactions(): Promise<CashTransaction[]>;
  getCashTransactionsByDateRange(startDate: Date, endDate: Date): Promise<CashTransaction[]>;
  createCashTransaction(transaction: InsertCashTransaction): Promise<CashTransaction>;
  
  // Daily register operations
  getDailyRegisters(): Promise<DailyRegister[]>;
  getDailyRegistersByDateRange(startDate: Date, endDate: Date): Promise<DailyRegister[]>;
  createDailyRegister(register: InsertDailyRegister): Promise<DailyRegister>;
  getCurrentSystemBalance(): Promise<number>;
  getCashSalesTotal(): Promise<number>;
  getCardSalesTotal(): Promise<number>;
  getPixSalesTotal(): Promise<number>;
  getSalesCount(): Promise<number>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private categories: Map<number, Category>;
  private products: Map<number, Product>;
  private sales: Map<number, Sale>;
  private cashTransactions: Map<number, CashTransaction>;
  private dailyRegisters: Map<number, DailyRegister>;
  
  private currentUserId: number;
  private currentCategoryId: number;
  private currentProductId: number;
  private currentSaleId: number;
  private currentCashTransactionId: number;
  private currentDailyRegisterId: number;

  constructor() {
    this.users = new Map();
    this.categories = new Map();
    this.products = new Map();
    this.sales = new Map();
    this.cashTransactions = new Map();
    this.dailyRegisters = new Map();
    
    this.currentUserId = 1;
    this.currentCategoryId = 1;
    this.currentProductId = 1;
    this.currentSaleId = 1;
    this.currentCashTransactionId = 1;
    this.currentDailyRegisterId = 1;
    
    // Seed data
    this.seedData();
  }

  private seedData() {
    // Seed users
    this.createUser({ username: "admin", password: "password", name: "Administrator", isAdmin: true });
    this.createUser({ username: "operator", password: "password", name: "João Operator", isAdmin: false });
    
    // Seed categories
    const beverages = this.createCategory({ name: "Bebidas", icon: "local_bar" });
    const produce = this.createCategory({ name: "Hortifruti", icon: "eco" });
    const cleaning = this.createCategory({ name: "Limpeza", icon: "cleaning_services" });
    const food = this.createCategory({ name: "Alimentos", icon: "restaurant" });
    const misc = this.createCategory({ name: "Diversos", icon: "category" });
    
    // Seed products
    this.createProduct({
      name: "Água Mineral 500ml",
      description: "Água mineral sem gás 500ml",
      price: 2.50,
      imageUrl: "https://images.unsplash.com/photo-1616118132534-381148898bb4?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300",
      categoryId: beverages.id,
      inStock: true
    });
    
    this.createProduct({
      name: "Refrigerante Cola 350ml",
      description: "Refrigerante sabor cola em lata",
      price: 4.00,
      imageUrl: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300",
      categoryId: beverages.id,
      inStock: true
    });
    
    this.createProduct({
      name: "Suco de Laranja 1L",
      description: "Suco de laranja natural 1 litro",
      price: 8.90,
      imageUrl: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300",
      categoryId: beverages.id,
      inStock: true
    });
    
    this.createProduct({
      name: "Energético 250ml",
      description: "Bebida energética em lata",
      price: 7.50,
      imageUrl: "https://images.unsplash.com/photo-1622543925917-763c34d1a86e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300",
      categoryId: beverages.id,
      inStock: true
    });
    
    // Add produce products
    this.createProduct({
      name: "Maçã Fuji kg",
      description: "Maçã Fuji fresca por quilo",
      price: 9.99,
      imageUrl: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300",
      categoryId: produce.id,
      inStock: true
    });
    
    this.createProduct({
      name: "Banana Prata kg",
      description: "Banana Prata por quilo",
      price: 5.99,
      imageUrl: "https://images.unsplash.com/photo-1528825871115-3581a5387919?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300",
      categoryId: produce.id,
      inStock: true
    });
    
    // Add cleaning products
    this.createProduct({
      name: "Detergente Líquido 500ml",
      description: "Detergente líquido para louças",
      price: 3.50,
      imageUrl: "https://images.unsplash.com/photo-1585421514738-01798e348b17?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300",
      categoryId: cleaning.id,
      inStock: true
    });
    
    // Add food products
    this.createProduct({
      name: "Arroz Integral 1kg",
      description: "Arroz integral tipo 1",
      price: 7.99,
      imageUrl: "https://images.unsplash.com/photo-1586201375761-83865001e8ac?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300",
      categoryId: food.id,
      inStock: true
    });
    
    this.createProduct({
      name: "Feijão Preto 1kg",
      description: "Feijão preto tipo 1",
      price: 8.49,
      imageUrl: "https://images.unsplash.com/photo-1622623222183-53cb693fdf88?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300",
      categoryId: food.id,
      inStock: true
    });
    
    // Add misc products
    this.createProduct({
      name: "Pilhas AA (4 unidades)",
      description: "Pacote com 4 pilhas alcalinas AA",
      price: 12.90,
      imageUrl: "https://images.unsplash.com/photo-1626420925443-c6845a6a3814?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300",
      categoryId: misc.id,
      inStock: true
    });
    
    // Seed a cash transaction for opening balance
    this.createCashTransaction({
      amount: 100,
      reason: "opening",
      notes: "Abertura de caixa inicial",
      operatorId: 2,
    });
    
    // Seed some sales
    const saleItems = [
      {
        productId: 1,
        name: "Água Mineral 500ml",
        price: 2.50,
        quantity: 2,
        imageUrl: "https://images.unsplash.com/photo-1616118132534-381148898bb4?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300"
      },
      {
        productId: 2,
        name: "Refrigerante Cola 350ml",
        price: 4.00,
        quantity: 1,
        imageUrl: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300"
      }
    ];
    
    this.createSale({
      total: 9.00,
      paymentMethod: "Dinheiro",
      amountReceived: 20.00,
      change: 11.00,
      operatorId: 2,
      items: saleItems,
    });
    
    // Add another sale with credit card
    this.createSale({
      total: 23.50,
      paymentMethod: "Cartão de Crédito",
      operatorId: 2,
      items: [
        {
          productId: 3,
          name: "Suco de Laranja 1L",
          price: 8.90,
          quantity: 1,
          imageUrl: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300"
        },
        {
          productId: 8,
          name: "Arroz Integral 1kg",
          price: 7.99,
          quantity: 1,
          imageUrl: "https://images.unsplash.com/photo-1586201375761-83865001e8ac?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300"
        },
        {
          productId: 5,
          name: "Maçã Fuji kg",
          price: 9.99,
          quantity: 0.66,
          imageUrl: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300"
        }
      ],
    });
    
    // Add a PIX sale
    this.createSale({
      total: 42.80,
      paymentMethod: "PIX",
      operatorId: 2,
      items: [
        {
          productId: 9,
          name: "Feijão Preto 1kg",
          price: 8.49,
          quantity: 2,
          imageUrl: "https://images.unsplash.com/photo-1622623222183-53cb693fdf88?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300"
        },
        {
          productId: 10,
          name: "Pilhas AA (4 unidades)",
          price: 12.90,
          quantity: 2,
          imageUrl: "https://images.unsplash.com/photo-1626420925443-c6845a6a3814?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300"
        }
      ],
    });
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Category operations
  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }
  
  async getCategory(id: number): Promise<Category | undefined> {
    return this.categories.get(id);
  }
  
  async createCategory(category: InsertCategory): Promise<Category> {
    const id = this.currentCategoryId++;
    const newCategory: Category = { ...category, id };
    this.categories.set(id, newCategory);
    return newCategory;
  }
  
  // Product operations
  async getProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }
  
  async getProductsByCategory(categoryId: number): Promise<Product[]> {
    return Array.from(this.products.values()).filter(
      (product) => product.categoryId === categoryId
    );
  }
  
  async getProduct(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }
  
  async createProduct(product: InsertProduct): Promise<Product> {
    const id = this.currentProductId++;
    const newProduct: Product = { ...product, id };
    this.products.set(id, newProduct);
    return newProduct;
  }
  
  // Sale operations
  async getSales(): Promise<Sale[]> {
    return Array.from(this.sales.values());
  }
  
  async getSalesByDateRange(startDate: Date, endDate: Date): Promise<Sale[]> {
    return Array.from(this.sales.values()).filter(
      (sale) => {
        const saleDate = new Date(sale.createdAt!);
        return saleDate >= startDate && saleDate <= endDate;
      }
    );
  }
  
  async getSale(id: number): Promise<Sale | undefined> {
    return this.sales.get(id);
  }
  
  async createSale(sale: InsertSale): Promise<Sale> {
    const id = this.currentSaleId++;
    const newSale: Sale = { 
      ...sale, 
      id, 
      createdAt: new Date() 
    };
    this.sales.set(id, newSale);
    return newSale;
  }
  
  // Cash transaction operations
  async getCashTransactions(): Promise<CashTransaction[]> {
    return Array.from(this.cashTransactions.values());
  }
  
  async getCashTransactionsByDateRange(startDate: Date, endDate: Date): Promise<CashTransaction[]> {
    return Array.from(this.cashTransactions.values()).filter(
      (transaction) => {
        const transactionDate = new Date(transaction.createdAt!);
        return transactionDate >= startDate && transactionDate <= endDate;
      }
    );
  }
  
  async createCashTransaction(transaction: InsertCashTransaction): Promise<CashTransaction> {
    const id = this.currentCashTransactionId++;
    const newTransaction: CashTransaction = { 
      ...transaction, 
      id, 
      createdAt: new Date() 
    };
    this.cashTransactions.set(id, newTransaction);
    return newTransaction;
  }
  
  // Daily register operations
  async getDailyRegisters(): Promise<DailyRegister[]> {
    return Array.from(this.dailyRegisters.values());
  }
  
  async getDailyRegistersByDateRange(startDate: Date, endDate: Date): Promise<DailyRegister[]> {
    return Array.from(this.dailyRegisters.values()).filter(
      (register) => {
        const registerDate = new Date(register.closedAt!);
        return registerDate >= startDate && registerDate <= endDate;
      }
    );
  }
  
  async createDailyRegister(register: InsertDailyRegister): Promise<DailyRegister> {
    const id = this.currentDailyRegisterId++;
    const newRegister: DailyRegister = { 
      ...register, 
      id, 
      closedAt: new Date() 
    };
    this.dailyRegisters.set(id, newRegister);
    return newRegister;
  }
  
  async getCurrentSystemBalance(): Promise<number> {
    // Calculate from all cash transactions and cash sales
    let balance = 0;
    
    // Add all cash transactions
    Array.from(this.cashTransactions.values()).forEach(
      (transaction) => {
        balance += Number(transaction.amount);
      }
    );
    
    // Add cash sales
    Array.from(this.sales.values())
      .filter(sale => sale.paymentMethod === "Dinheiro")
      .forEach(sale => {
        balance += Number(sale.total);
      });
    
    return balance;
  }
  
  async getCashSalesTotal(): Promise<number> {
    // Sum up all cash sales
    return Array.from(this.sales.values())
      .filter(sale => sale.paymentMethod === "Dinheiro")
      .reduce((total, sale) => total + Number(sale.total), 0);
  }
  
  async getCardSalesTotal(): Promise<number> {
    // Sum up all card sales (credit and debit)
    return Array.from(this.sales.values())
      .filter(sale => sale.paymentMethod === "Cartão de Crédito" || sale.paymentMethod === "Cartão de Débito")
      .reduce((total, sale) => total + Number(sale.total), 0);
  }
  
  async getPixSalesTotal(): Promise<number> {
    // Sum up all PIX sales
    return Array.from(this.sales.values())
      .filter(sale => sale.paymentMethod === "PIX")
      .reduce((total, sale) => total + Number(sale.total), 0);
  }
  
  async getSalesCount(): Promise<number> {
    return this.sales.size;
  }
}

export const storage = new MemStorage();
