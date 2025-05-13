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
    this.createUser({ username: "admin", password: "password", name: "Administrador", isAdmin: true });
    this.createUser({ username: "vendedor", password: "123456", name: "João Vendedor", isAdmin: false });
    
    // Seed categories
    const beverages = this.createCategory({ name: "Bebidas", icon: "local_bar" });
    const produce = this.createCategory({ name: "Hortifruti", icon: "eco" });
    const cleaning = this.createCategory({ name: "Limpeza", icon: "cleaning_services" });
    const food = this.createCategory({ name: "Alimentos", icon: "restaurant" });
    const misc = this.createCategory({ name: "Diversos", icon: "category" });
    const bakery = this.createCategory({ name: "Padaria", icon: "bakery_dining" });
    
    // Bebidas
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
    
    this.createProduct({
      name: "Cerveja Lager 350ml",
      description: "Cerveja pilsen em lata",
      price: 3.99,
      imageUrl: "https://images.unsplash.com/photo-1566633806327-68e152aaf26d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300",
      categoryId: beverages.id,
      inStock: true
    });
    
    this.createProduct({
      name: "Vinho Tinto 750ml",
      description: "Vinho tinto seco nacional",
      price: 29.90,
      imageUrl: "https://images.unsplash.com/photo-1553361371-9513f3251822?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300",
      categoryId: beverages.id,
      inStock: true
    });
    
    // Hortifruti
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
    
    this.createProduct({
      name: "Tomate kg",
      description: "Tomate fresco por quilo",
      price: 8.50,
      imageUrl: "https://images.unsplash.com/photo-1607305387299-a3d9611cd469?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300",
      categoryId: produce.id,
      inStock: true
    });
    
    this.createProduct({
      name: "Alface Crespa Unidade",
      description: "Alface crespa fresca",
      price: 3.49,
      imageUrl: "https://images.unsplash.com/photo-1621458452298-0ada22833210?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300",
      categoryId: produce.id,
      inStock: true
    });
    
    this.createProduct({
      name: "Cenoura kg",
      description: "Cenoura fresca por quilo",
      price: 4.99,
      imageUrl: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300",
      categoryId: produce.id,
      inStock: true
    });
    
    // Limpeza
    this.createProduct({
      name: "Detergente Líquido 500ml",
      description: "Detergente líquido para louças",
      price: 3.50,
      imageUrl: "https://images.unsplash.com/photo-1585421514738-01798e348b17?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300",
      categoryId: cleaning.id,
      inStock: true
    });
    
    this.createProduct({
      name: "Sabão em Pó 1kg",
      description: "Sabão em pó para lavagem de roupas",
      price: 12.90,
      imageUrl: "https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300",
      categoryId: cleaning.id,
      inStock: true
    });
    
    this.createProduct({
      name: "Desinfetante 2L",
      description: "Desinfetante para uso geral",
      price: 8.99,
      imageUrl: "https://images.unsplash.com/photo-1605713673658-098957694a88?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300",
      categoryId: cleaning.id,
      inStock: true
    });
    
    this.createProduct({
      name: "Esponja Multiuso 3 unid",
      description: "Pacote com 3 esponjas para limpeza geral",
      price: 4.50,
      imageUrl: "https://images.unsplash.com/photo-1622560480654-d96214fdc887?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300",
      categoryId: cleaning.id,
      inStock: true
    });
    
    // Alimentos
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
    
    this.createProduct({
      name: "Macarrão Espaguete 500g",
      description: "Macarrão espaguete tradicional",
      price: 4.75,
      imageUrl: "https://images.unsplash.com/photo-1551462147-ff29053bfc14?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300",
      categoryId: food.id,
      inStock: true
    });
    
    this.createProduct({
      name: "Molho de Tomate 340g",
      description: "Molho de tomate tradicional",
      price: 3.99,
      imageUrl: "https://images.unsplash.com/photo-1608508644127-ba99d7732fee?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300",
      categoryId: food.id,
      inStock: true
    });
    
    this.createProduct({
      name: "Azeite Extra Virgem 500ml",
      description: "Azeite de oliva extra virgem importado",
      price: 29.90,
      imageUrl: "https://images.unsplash.com/photo-1565636291290-4810fe964a01?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300",
      categoryId: food.id,
      inStock: true
    });
    
    // Padaria
    this.createProduct({
      name: "Pão Francês 1kg",
      description: "Pão francês fresco do dia",
      price: 12.99,
      imageUrl: "https://images.unsplash.com/photo-1573497620053-ea5300f94f21?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300",
      categoryId: bakery.id,
      inStock: true
    });
    
    this.createProduct({
      name: "Bolo de Chocolate Fatia",
      description: "Fatia de bolo de chocolate caseiro",
      price: 6.50,
      imageUrl: "https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300",
      categoryId: bakery.id,
      inStock: true
    });
    
    this.createProduct({
      name: "Pão de Queijo 6 unid",
      description: "Pão de queijo mineiro tradicional",
      price: 8.75,
      imageUrl: "https://images.unsplash.com/photo-1598143379732-a5dc436c4fdf?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300",
      categoryId: bakery.id,
      inStock: true
    });
    
    this.createProduct({
      name: "Sonho Recheado",
      description: "Sonho recheado com creme",
      price: 5.99,
      imageUrl: "https://images.unsplash.com/photo-1586985288123-2495f577c250?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300",
      categoryId: bakery.id,
      inStock: true
    });
    
    this.createProduct({
      name: "Croissant",
      description: "Croissant francês folhado",
      price: 6.49,
      imageUrl: "https://images.unsplash.com/photo-1623334044303-241021148842?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300",
      categoryId: bakery.id,
      inStock: true
    });
    
    // Diversos
    this.createProduct({
      name: "Pilhas AA (4 unidades)",
      description: "Pacote com 4 pilhas alcalinas AA",
      price: 12.90,
      imageUrl: "https://images.unsplash.com/photo-1626420925443-c6845a6a3814?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300",
      categoryId: misc.id,
      inStock: true
    });
    
    this.createProduct({
      name: "Papel Alumínio 30m",
      description: "Rolo de papel alumínio 30 metros",
      price: 7.99,
      imageUrl: "https://images.unsplash.com/photo-1620039188898-f733209ea8e7?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300",
      categoryId: misc.id,
      inStock: true
    });
    
    this.createProduct({
      name: "Filtro de Café 103 (30 unid)",
      description: "Caixa com 30 filtros de papel para café",
      price: 5.49,
      imageUrl: "https://images.unsplash.com/photo-1572119951839-327c386b56ad?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300",
      categoryId: misc.id,
      inStock: true
    });
    
    this.createProduct({
      name: "Carregador Portátil USB",
      description: "Carregador de celular com 2 entradas USB",
      price: 24.90,
      imageUrl: "https://images.unsplash.com/photo-1583863788534-eebd9306f204?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300",
      categoryId: misc.id,
      inStock: true
    });
    
    this.createProduct({
      name: "Caderno Universitário 100 fls",
      description: "Caderno com espiral e capa dura",
      price: 19.90,
      imageUrl: "https://images.unsplash.com/photo-1582078892174-dc3e9214e122?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300",
      categoryId: misc.id,
      inStock: true
    });
    
    this.createProduct({
      name: "Guarda-Chuva Dobrável",
      description: "Guarda-chuva compacto e automático",
      price: 29.99,
      imageUrl: "https://images.unsplash.com/photo-1518627675136-e9a92cf987f3?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300",
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
